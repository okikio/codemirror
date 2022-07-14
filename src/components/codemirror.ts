import { EditorView, basicSetup as BASIC_SETUP } from "codemirror";
// import { keymap } from "@codemirror/view";
// import { indentWithTab } from "@codemirror/commands";

// import { javascript } from "@codemirror/lang-javascript";
import { json, jsonParseLinter } from "@codemirror/lang-json";

// import { BASIC_SETUP, EditorView, EditorState } from "./editor-basic-setup";
// import { THEME, HIGHTLIGHT_STYLE } from "./editor-theme";
// import type {
//   HighlightStyle
// } from "@codemirror/language";

// import type { Extension } from "@codemirror/state";

// import {foldGutter, foldKeymap} from "@codemirror/language"
  // foldGutter({
  //     openText: "expand_more",
  //     closedText: "chevron_right"
  // }),

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
// Extension
export default (parentEl: HTMLElement, extentions?: any[], doc = initalText) => {
  return new EditorView({
    doc,
    extensions: [
      BASIC_SETUP,

      // THEME,
      // HIGHTLIGHT_STYLE,

      // keymap.of([indentWithTab]),
      // json(),
      // jsonParseLinter()
    ].concat(extentions),
    parent: parentEl
  });
  //  as Extension[]
};
