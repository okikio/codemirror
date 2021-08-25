import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";

import { BASIC_SETUP, EditorView, EditorState } from "./editor-basic-setup";
import { THEME, HIGHTLIGHT_STYLE } from "./editor-theme";

import type { Extension } from "@codemirror/state";

const doc = `\
// Click Run for the Bundled + Minified + Gzipped package size
export * from "@okikio/animate";
`;

export default (parentEl: HTMLElement, extentions?: Extension) => { 
    return new EditorView({
        state: EditorState.create({
            doc,
            extensions: [
                BASIC_SETUP,

                THEME, 
                HIGHTLIGHT_STYLE,

                keymap.of([indentWithTab]),
                javascript({
                    typescript: true
                })
            ].concat(extentions)
        }),
        parent: parentEl 
    });
};
