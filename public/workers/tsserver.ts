importScripts("https://unpkg.com/@typescript/vfs@1.3.4/dist/vfs.globals.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/typescript/4.3.5/typescript.min.js");
importScripts("https://unpkg.com/@okikio/emitter@2.1.7/lib/api.js");

export type VFS = typeof import("@typescript/vfs");
export type EVENT_EMITTER = import("@okikio/emitter").EventEmitter;
export type Diagnostic = import("@codemirror/lint").Diagnostic;

var { createDefaultMapFromCDN, createSystem, createVirtualTypeScriptEnvironment } = globalThis.tsvfs as VFS;
var ts = globalThis.ts; // as TS

var EventEmitter = globalThis.emitter.EventEmitter;
var _emitter: EVENT_EMITTER = new EventEmitter();

globalThis.localStorage = globalThis.localStorage ?? {} as Storage;

(async () => {
    const compilerOpts = {
        target: ts.ScriptTarget.ES2021,
        module: ts.ScriptTarget.ES2020,
        "lib": [
            "ES2020",
            "DOM",
            "WebWorker"
        ],
        "esModuleInterop": true,
    };

    let initialText = "const hello = 'hi'";
    _emitter.once("updateText", (details) => {
        initialText = details.text.join("\n");
    });

    const fsMap = await createDefaultMapFromCDN(compilerOpts, ts.version, false, ts)
    const ENTRY_POINT = "index.ts";
    fsMap.set(ENTRY_POINT, initialText);

    const system = createSystem(fsMap);
    const env = createVirtualTypeScriptEnvironment(system, [ENTRY_POINT], ts, compilerOpts);

    // You can then interact with the languageService to introspect the code
    postMessage({
        event: "ready",
        details: []
    });

    _emitter.on("updateText", (details) => {
        env.updateFile(ENTRY_POINT, [].concat(details.text).join("\n"));
        // console.log(details.text)
    });

    _emitter.on("autocomplete-request", ({ pos }) => {
        let result = env.languageService.getCompletionsAtPosition(ENTRY_POINT, pos, {});

        postMessage({
            event: "autocomplete-results",
            details: result
        })
    })

    _emitter.on("tooltip-request", ({ pos }) => {
        let result = env.languageService.getQuickInfoAtPosition(ENTRY_POINT, pos);

        postMessage({
            event: "tooltip-results",
            details: result ? {
                result,
                tootltipText: ts.displayPartsToString(result.displayParts) +
                    (result.documentation?.length ? "\n" + ts.displayPartsToString(result.documentation) : "")
            } : { result, tooltipText: "" }
        })
    })

    _emitter.on("lint-request", () => {
        let SyntacticDiagnostics = env.languageService.getSyntacticDiagnostics(ENTRY_POINT);
        let SemanticDiagnostic = env.languageService.getSemanticDiagnostics(ENTRY_POINT);
        let SuggestionDiagnostics = env.languageService.getSuggestionDiagnostics(ENTRY_POINT);

        type Diagnostics = typeof SyntacticDiagnostics & typeof SemanticDiagnostic & typeof SuggestionDiagnostics;
        let result: Diagnostics = [].concat(SyntacticDiagnostics, SemanticDiagnostic, SuggestionDiagnostics);

        postMessage({
            event: "lint-results",
            details: result.map(v => {
                let from = v.start;
                let to = v.start + v.length;
                // let codeActions = env.languageService.getCodeFixesAtPosition(ENTRY_POINT, from, to, [v.category], {}, {});

                let diag: Diagnostic = ({
                    from,
                    to,
                    message: v.messageText as string,
                    source: v?.source,
                    severity: ["warning", "error", "info", "info"][v.category] as Diagnostic["severity"],
                    // actions: codeActions as any as Diagnostic["actions"]
                });

                return diag;
            })
        })
    })
})();

addEventListener('message', ({ data }: MessageEvent<{ event: string, details: any }>) => {
    let { event, details } = data;
    _emitter.emit(event, details);
});