import { EditorView, basicSetup as BASIC_SETUP } from "codemirror";
import { keymap } from "@codemirror/view";

import { indentWithTab } from "@codemirror/commands";
import { json, jsonLanguage, jsonParseLinter } from "@codemirror/lang-json";

import { foldGutter, foldKeymap, syntaxHighlighting } from "@codemirror/language";
import { linter, lintGutter, lintKeymap } from "@codemirror/lint";
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";

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

export default (parentEl: HTMLElement, ext: Extension[] = [], doc = initalText) => {
  return new EditorView({
    doc,
    extensions: [
      BASIC_SETUP,

      THEME,
      syntaxHighlighting(HIGHTLIGHT_STYLE),

      keymap.of([indentWithTab]),
      keymap.of(lintKeymap),
      keymap.of(completionKeymap),
      keymap.of(foldKeymap),

      json(),
      linter(jsonParseLinter()),

      // foldGutter({
      //   openText: "expand_more",
      //   closedText: "chevron_right"
      // }),

    ].concat(ext),
    parent: parentEl
  });
};
