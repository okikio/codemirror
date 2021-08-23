importScripts("https://unpkg.com/@typescript/vfs@1.3.4/dist/vfs.globals.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/typescript/4.4.1-rc/typescript.min.js");
importScripts("https://unpkg.com/@okikio/emitter@2.1.7/lib/api.js");

var { createDefaultMapFromCDN, createSystem, createVirtualTypeScriptEnvironment } = globalThis.tsvfs as VFS;
var ts = globalThis.ts; // as TS

var EventEmitter = globalThis.emitter.EventEmitter;
var _emitter: EVENT_EMITTER = new EventEmitter();

globalThis.localStorage = globalThis.localStorage ?? {} as Storage;

(async () => {
    const compilerOpts = {
        target: ts.ScriptTarget.ES2020
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
    // env.languageService.getDocumentHighlights(ENTRY_POINT, 0, [ENTRY_POINT]);
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
                    (result.documentation?.length ? "\n" + ts.displayPartsToString(result.documentation)  : "")
            } : { result, tooltipText: "" }
        })
    })

    _emitter.on("lint-request", () => {
        let SyntacticDiagnostics = env.languageService.getSyntacticDiagnostics(ENTRY_POINT);
        let SemanticDiagnostic = env.languageService.getSemanticDiagnostics(ENTRY_POINT);
        let SuggestionDiagnostics = env.languageService.getSuggestionDiagnostics(ENTRY_POINT);
        type Diagnostics = typeof SyntacticDiagnostics & typeof SemanticDiagnostic & typeof SuggestionDiagnostics;
        let result: Diagnostics  = [].concat(SyntacticDiagnostics, SemanticDiagnostic, SuggestionDiagnostics);
        postMessage({
            event: "lint-results",
            details: result.map(v => ({
                from: v.start,
                to: v.start + v.length,
                message: v.messageText,
                source: v?.source,
                severity: "warning"
            }))
        })
    })
})();

addEventListener('message', ({ data }: MessageEvent<{ event: string, details: any }>) => {
    let { event, details } = data;
    _emitter.emit(event, details);
});