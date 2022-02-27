import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { json, jsonParseLinter } from "@codemirror/lang-json";

import { BASIC_SETUP, EditorView, EditorState } from "./editor-basic-setup";
import { THEME, HIGHTLIGHT_STYLE } from "./editor-theme";

import type { Extension } from "@codemirror/state";

const initalText = `\
{
    "compilerOptions": {
      "target": "es2017",
      "module": "commonjs",
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true
    }
}
`;

export default (parentEl: HTMLElement, extentions?: Extension, doc = initalText) => { 
    return new EditorView({
        state: EditorState.create({
            doc,
            extensions: [
                BASIC_SETUP,

                THEME, 
                HIGHTLIGHT_STYLE,

                keymap.of([indentWithTab]),
                json(),
                // jsonParseLinter()
            ].concat(extentions)
        }),
        parent: parentEl 
    });
};
