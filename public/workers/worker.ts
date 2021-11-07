// Simple JSON LS in Web Worker that provides completion and hover.
// Includes a schema for `tsconfig.json`.
import {
    createConnection,
    BrowserMessageReader,
    BrowserMessageWriter,
    TextDocumentSyncKind,
} from "vscode-languageserver/browser";
import { TextDocument } from 'vscode-languageserver-textdocument';
import {
    createLanguageService,
    LanguageServiceHost
} from "vscode-typescript-languageservice";

import type { VersionedTextDocumentIdentifier } from "vscode-languageserver/browser";

type TS = typeof import('typescript/lib/tsserverlibrary');
import type { VirtualTypeScriptEnvironment } from "@typescript/vfs";
import type { System, CompilerOptions, CustomTransformers } from "typescript";

importScripts("https://unpkg.com/@typescript/vfs@1.3.5/dist/vfs.globals.js");
// importScripts("https://cdnjs.cloudflare.com/ajax/libs/typescript/4.4.4/typescript.min.js");
importScripts("https://unpkg.com/typescript@4.4.4/lib/tsserverlibrary.js")

export type VFS = typeof import("@typescript/vfs");
export type Diagnostic = import("@codemirror/lint").Diagnostic;

var { createDefaultMapFromCDN, createSystem, createVirtualCompilerHost, createVirtualLanguageServiceHost } = globalThis.tsvfs as VFS;
var ts = globalThis.ts as TS;

globalThis.localStorage = globalThis.localStorage ?? {} as Storage;
/**
 * Makes a virtual copy of the TypeScript environment. This is the main API you want to be using with
 * @typescript/vfs. A lot of the other exposed functions are used by this function to get set up.
 *
 * @param sys an object which conforms to the TS Sys (a shim over read/write access to the fs)
 * @param rootFiles a list of files which are considered inside the project
 * @param ts a copy pf the TypeScript module
 * @param compilerOptions the options for this compiler run
 * @param customTransformers custom transformers for this compiler run
 */

function createVirtualTypeScriptEnvironment(
    sys: System,
    rootFiles: string[],
    ts: TS,
    compilerOptions: CompilerOptions = {},
    customTransformers?: CustomTransformers
): VirtualTypeScriptEnvironment & { languageServiceHost: LanguageServiceHost } {
    const mergedCompilerOpts = { ...defaultCompilerOptions(ts), ...compilerOptions }

    const { languageServiceHost, updateFile } = createVirtualLanguageServiceHost(
        sys,
        rootFiles,
        mergedCompilerOpts,
        ts,
        customTransformers
    )
    const languageService = ts.createLanguageService(languageServiceHost)
    const diagnostics = languageService.getCompilerOptionsDiagnostics()

    if (diagnostics.length) {
        const compilerHost = createVirtualCompilerHost(sys, compilerOptions, ts)
        throw new Error(ts.formatDiagnostics(diagnostics, compilerHost.compilerHost))
    }

    return {
        // @ts-ignore
        name: "vfs",
        sys,
        languageService,
        languageServiceHost,
        getSourceFile: fileName => languageService.getProgram()?.getSourceFile(fileName),

        createFile: (fileName, content) => {
            updateFile(ts.createSourceFile(fileName, content, mergedCompilerOpts.target!, false))
        },
        updateFile: (fileName, content, optPrevTextSpan) => {
            const prevSourceFile = languageService.getProgram()!.getSourceFile(fileName)
            if (!prevSourceFile) {
                throw new Error("Did not find a source file for " + fileName)
            }
            const prevFullContents = prevSourceFile.text

            // TODO: Validate if the default text span has a fencepost error?
            const prevTextSpan = optPrevTextSpan ?? ts.createTextSpan(0, prevFullContents.length)
            const newText =
                prevFullContents.slice(0, prevTextSpan.start) +
                content +
                prevFullContents.slice(prevTextSpan.start + prevTextSpan.length)
            const newSourceFile = ts.updateSourceFile(prevSourceFile, newText, {
                span: prevTextSpan,
                newLength: content.length,
            })

            updateFile(newSourceFile)
        },
    }
}

/** The default compiler options if TypeScript could ever change the compiler options */
const defaultCompilerOptions = (ts: TS): CompilerOptions => {
    return {
        ...ts.getDefaultCompilerOptions(),
        jsx: ts.JsxEmit.React,
        strict: true,
        esModuleInterop: true,
        module: ts.ModuleKind.ESNext,
        suppressOutputPathCheck: true,
        skipLibCheck: true,
        skipDefaultLibCheck: true,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
    }
}

(async () => {
    const compilerOpts = {
        target: ts.ScriptTarget.ES2021,
        module: ts.ModuleKind.ES2020,
        "lib": [
            "es2021",
            "es2020",
            "dom",
            "webworker"
        ],
        "esModuleInterop": true,
    };

    let initialText = "const hello = 'hi'";

    const fsMap = await createDefaultMapFromCDN(compilerOpts, ts.version, false, ts)
    const ENTRY_POINT = "index.ts";

    // const docs = new Map<string, TextDocument>();
    // docs.set(ENTRY_POINT, TextDocument.create(ENTRY_POINT, "ts", Number(ts.version), initialText));
    fsMap.set(ENTRY_POINT, initialText);

    const system = createSystem(fsMap);
    const env = createVirtualTypeScriptEnvironment(system, [ENTRY_POINT], ts, compilerOpts);
    const tsls = createLanguageService(ts, env.languageServiceHost, env.languageService);

    const worker: Worker = self as any;
    const conn = createConnection(
        new BrowserMessageReader(worker),
        new BrowserMessageWriter(worker)
    );

    const getDiagnostics = (textDocument: VersionedTextDocumentIdentifier) => {
        return conn.sendDiagnostics({
            uri: textDocument.uri,
            version: textDocument.version || 0,
            diagnostics: tsls.doValidation(textDocument.uri, {
                declaration: true,
                semantic: true,
                suggestion: true,
                syntactic: true,
            })
        });
    };

    conn.onInitialize(() => {
        return {
            capabilities: {
                textDocumentSync: TextDocumentSyncKind.Incremental,
                completionProvider: {
                    triggerCharacters: ['"', ":", "'", " ", ".", ","],
                },
                hoverProvider: true,

                definitionProvider: true,
                typeDefinitionProvider: true,

                referencesProvider: true,

                foldingRangeProvider: true,
                codeActionProvider: true,

                documentFormattingProvider: true,
                documentRangeFormattingProvider: true,

                documentHighlightProvider: true,

                documentSymbolProvider: true,
                workspaceSymbolProvider: true,

                renameProvider: true,

                signatureHelpProvider: {
                    triggerCharacters: ["(", ","],
                },
            },
        };
    });

    conn.onDidOpenTextDocument(({ textDocument: { uri, languageId, version, text } }) => {
        let textDocument = TextDocument.create(uri, languageId, version, text);
        // docs.set(uri, textDocument);
        // fsMap.set(uri, text);
        env.createFile(uri, text);
        getDiagnostics(textDocument);
    });

    conn.onDidChangeTextDocument(({ textDocument, contentChanges }) => {
        if (fsMap.has(textDocument.uri)) {
            // const doc = docs.get(textDocument.uri);
            // docs.set(textDocument.uri, TextDocument.update(
            //     doc,
            //     contentChanges,
            //     textDocument.version || 0
            // ));
            // fsMap.set(textDocument.uri, contentChanges[0].text);

            env.updateFile(textDocument.uri, contentChanges[0].text);
            getDiagnostics(textDocument);
        }
    });

    conn.onSignatureHelp(({ textDocument, position, context }) => {
        
        // env.getSourceFile(textDocument.uri)
        if (!fsMap.has(textDocument.uri)) return null;
        return tsls.getSignatureHelp(textDocument.uri, position, context);
    });

    conn.onCompletion(({ textDocument, position, context }) => {
        if (!fsMap.has(textDocument.uri)) return null;
        return tsls.doComplete(textDocument.uri, position, context as unknown);
    });

    conn.onCompletionResolve((item) => {
        if (!item) return null;
        return tsls.doCompletionResolve(item);
    });

    conn.onHover(({ textDocument, position }) => {
        if (!fsMap.has(textDocument.uri)) return null;
        return tsls.doHover(textDocument.uri, position);
    });

    conn.onDocumentFormatting(({ textDocument, options }) => {
        if (!fsMap.has(textDocument.uri)) return null;
        return tsls.doFormatting(textDocument.uri, options);
    });

    conn.onDocumentRangeFormatting(({ textDocument, range, options }) => {
        if (!fsMap.has(textDocument.uri)) return null;
        return tsls.doFormatting(textDocument.uri, options, range);
    });

    conn.onTypeDefinition(({ textDocument, position }) => {
        if (!fsMap.has(textDocument.uri)) return null;
        return tsls.findTypeDefinition(textDocument.uri, position);
    });

    conn.onDefinition(({ textDocument, position }) => {
        if (!fsMap.has(textDocument.uri)) return null;
        return tsls.findDefinition(textDocument.uri, position);
    });

    conn.onReferences(({ textDocument, position }) => {
        if (!fsMap.has(textDocument.uri)) return null;
        return tsls.findReferences(textDocument.uri, position);
    });

    conn.onCodeAction(({ textDocument, range, context }) => {
        if (!fsMap.has(textDocument.uri)) return null;
        return tsls.getCodeActions(textDocument.uri, range, context);
    });

    conn.onCodeActionResolve((action) => {
        if (!action) return null;
        return tsls.doCodeActionResolve(action);
    });

    conn.onDocumentSymbol(({ textDocument }) => {
        if (!fsMap.has(textDocument.uri)) return null;
        return tsls.findDocumentSymbols(textDocument.uri);
    });

    conn.onDefinition(({ textDocument, position }) => {
        if (!fsMap.has(textDocument.uri)) return null;
        return tsls.findDefinition(textDocument.uri, position);
    });

    conn.onFoldingRanges(({ textDocument }) => {
        if (!fsMap.has(textDocument.uri)) return null;
        return tsls.getFoldingRanges(textDocument.uri);
    });

    conn.onPrepareRename(({ textDocument, position }) => {
        if (!fsMap.has(textDocument.uri)) return null;
        return tsls.prepareRename(textDocument.uri, position);
    });

    conn.onRenameRequest(({ textDocument, position, newName }) => {
        if (!fsMap.has(textDocument.uri)) return null;
        return tsls.doRename(textDocument.uri, position, newName);
    });

    conn.onDocumentSymbol(({ textDocument }) => {
        if (!fsMap.has(textDocument.uri)) return null;
        return tsls.findDocumentSymbols(textDocument.uri);
    });

    conn.onWorkspaceSymbol(({ query }) => {
        if (!query) return null;
        return tsls.findWorkspaceSymbols(query);
    });

    conn.onDocumentHighlight(({ textDocument, position }) => {
        if (!fsMap.has(textDocument.uri)) return null;
        return tsls.findDocumentHighlights(textDocument.uri, position);
    });

    conn.listen();
})();