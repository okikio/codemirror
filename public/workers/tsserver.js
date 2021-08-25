var _a;
importScripts("https://unpkg.com/@typescript/vfs@1.3.4/dist/vfs.globals.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/typescript/4.3.5/typescript.min.js");
importScripts("https://unpkg.com/@okikio/emitter@2.1.7/lib/api.js");
var { createDefaultMapFromCDN, createSystem, createVirtualTypeScriptEnvironment } = globalThis.tsvfs;
var ts = globalThis.ts; // as TS
var EventEmitter = globalThis.emitter.EventEmitter;
var _emitter = new EventEmitter();
globalThis.localStorage = (_a = globalThis.localStorage) !== null && _a !== void 0 ? _a : {};
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
    const fsMap = await createDefaultMapFromCDN(compilerOpts, ts.version, false, ts);
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
        });
    });
    _emitter.on("tooltip-request", ({ pos }) => {
        var _a;
        let result = env.languageService.getQuickInfoAtPosition(ENTRY_POINT, pos);
        postMessage({
            event: "tooltip-results",
            details: result ? {
                result,
                tootltipText: ts.displayPartsToString(result.displayParts) +
                    (((_a = result.documentation) === null || _a === void 0 ? void 0 : _a.length) ? "\n" + ts.displayPartsToString(result.documentation) : "")
            } : { result, tooltipText: "" }
        });
    });
    _emitter.on("lint-request", () => {
        let SyntacticDiagnostics = env.languageService.getSyntacticDiagnostics(ENTRY_POINT);
        let SemanticDiagnostic = env.languageService.getSemanticDiagnostics(ENTRY_POINT);
        let SuggestionDiagnostics = env.languageService.getSuggestionDiagnostics(ENTRY_POINT);
        let result = [].concat(SyntacticDiagnostics, SemanticDiagnostic, SuggestionDiagnostics);
        postMessage({
            event: "lint-results",
            details: result.map(v => {
                let from = v.start;
                let to = v.start + v.length;
                // let codeActions = env.languageService.getCodeFixesAtPosition(ENTRY_POINT, from, to, [v.category], {}, {});
                let diag = ({
                    from,
                    to,
                    message: v.messageText,
                    source: v === null || v === void 0 ? void 0 : v.source,
                    severity: ["warning", "error", "info", "info"][v.category],
                    // actions: codeActions as any as Diagnostic["actions"]
                });
                return diag;
            })
        });
    });
})();
addEventListener('message', ({ data }) => {
    let { event, details } = data;
    _emitter.emit(event, details);
});