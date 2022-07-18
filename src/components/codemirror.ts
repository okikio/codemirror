import { EditorView, basicSetup as BASIC_SETUP } from "codemirror";
import { keymap } from "@codemirror/view";

import { indentWithTab } from "@codemirror/commands";
import { json, jsonLanguage, jsonParseLinter } from "@codemirror/lang-json";

import { foldGutter, foldKeymap, syntaxHighlighting } from "@codemirror/language"

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
// Extension
export default (parentEl: HTMLElement, ext: Extension[] = [], doc = initalText) => {
  return new EditorView({
    doc,
    extensions: [
      BASIC_SETUP,

      THEME,
      syntaxHighlighting(HIGHTLIGHT_STYLE),

      // foldGutter({
      //   openText: "expand_more",
      //   closedText: "chevron_right"
      // }),

      keymap.of([indentWithTab]),
      json()
    ].concat(ext),
    parent: parentEl
  });
};
