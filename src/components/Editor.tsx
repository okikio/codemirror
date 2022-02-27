import { onMount } from "solid-js";

// import { EventEmitter } from "@okikio/emitter";
// import { EditorView } from "@codemirror/view";
// import { autocompletion, completeFromList, startCompletion } from "@codemirror/autocomplete";
// import { hoverTooltip } from "@codemirror/tooltip";
// import { Diagnostic, linter } from "@codemirror/lint";
// import { keymap } from "@codemirror/view";

// import debounce from "lodash.debounce";
// import debounceAsync from "debounce-async";
// const asyncdebounce = debounceAsync.default;

// import type { CompletionContext, CompletionResult, Completion } from "@codemirror/autocomplete";
// import type { ViewUpdate } from "@codemirror/view";
// import type { Tooltip } from "@codemirror/tooltip";
// const emitter = new EventEmitter();

import Codemirror from "./codemirror";

// @ts-ignore
import TSServer from "./tsserver.ts?worker";

import { languageServer } from './lsps';
export const ls = languageServer({
    serverWorker: new TSServer(), //new Worker(new URL('./tsserver.js', import.meta.url), { type: 'module', name: "ts-server" }),
    rootUri: 'file:///',
    documentUri: `file:///index.ts`,
    languageId: 'ts' // As defined at https://microsoft.github.io/language-server-protocol/specification#textDocumentItem.
});

export default ({ children }) => {
    let editorEl: HTMLDivElement;
    onMount(() => {
        // let tsServer = new Worker(
        //     new URL("/workers/tsserver.js", import.meta.url),
        //     { name: "ts-server" }
        // );

        let editor = Codemirror(editorEl, [
            ls
            // EditorView.updateListener.of(debounce((update: ViewUpdate) => {
            //     if (update.docChanged) {
            //         tsServer.postMessage({
            //             event: "updateText",
            //             details: update.state.doc,
            //         });
            //     }
            // }, 150)),

            // autocompletion({
            //     activateOnTyping: true,
            //     override: [
            //         asyncdebounce(async (ctx: CompletionContext): Promise<CompletionResult | null> => {
            //             const { pos } = ctx;

            //             try {
            //                 tsServer.postMessage({
            //                     event: "autocomplete-request",
            //                     details: { pos }
            //                 });

            //                 const completions = await new Promise((resolve) => {
            //                     emitter.on("autocomplete-results", (completions) => {
            //                         resolve(completions);
            //                     });
            //                 });

            //                 if (!completions) {
            //                     console.log("Unable to get completions", { pos });
            //                     return null;
            //                 }

            //                 return completeFromList(
            //                     // @ts-ignore
            //                     completions.entries.map((c, i) => {
            //                         let suggestions: Completion = ({
            //                             type: c.kind,
            //                             label: c.name,
            //                             // TODO:: populate details and info
            //                             boost: 1 / Number(c.sortText),
            //                         })

            //                         return suggestions;
            //                     })
            //                 )(ctx);
            //             } catch (e) {
            //                 console.log("Unable to get completions", { pos, error: e });
            //                 return null;
            //             }
            //         }, 200),
            //     ],
            // }),

            // hoverTooltip(
            //     async ({ state }: EditorView, pos: number): Promise<Tooltip | null> => {
            //         tsServer.postMessage({
            //             event: "tooltip-request",
            //             details: { pos }
            //         });

            //         const { result: quickInfo, tootltipText } = await new Promise((resolve) => {
            //             emitter.on("tooltip-results", (completions) => {
            //                 resolve(completions);
            //             });
            //         });

            //         if (!quickInfo) return null;

            //         return {
            //             pos,
            //             create() {
            //                 const dom = document.createElement("div");
            //                 dom.setAttribute("class", "cm-quickinfo-tooltip");
            //                 dom.textContent = tootltipText;

            //                 return { dom };
            //             },
            //         };
            //     },
            //     {
            //         hideOnChange: true,

            //     }
            // ),

            // linter(async (view: EditorView): Promise<Diagnostic[]> => {
            //     tsServer.postMessage({
            //         event: "lint-request",
            //         details: []
            //     });

            //     const diagnostics = await new Promise((resolve) => {
            //         emitter.on("lint-results", (completions) => {
            //             resolve(completions);
            //         });
            //     });

            //     if (!diagnostics) return null;
            //     return diagnostics as Diagnostic[];
            // }, {
            //     delay: 400
            // }),
        ]);

        // emitter.on("ready", () => {
        //     console.log("ts-server is ready");

        //     tsServer.postMessage({
        //         event: "updateText",
        //         details: editor.state.doc,
        //     });
        // });

        // tsServer.addEventListener(
        //     "message",
        //     ({ data }: MessageEvent<{ event: string; details: any }>) => {
        //         let { event, details } = data;
        //         emitter.emit(event, details);
        //     }
        // );
    });

    return <div id="editor" ref={editorEl}></div>;
};
