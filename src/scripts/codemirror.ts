import { EditorView, basicSetup as BASIC_SETUP } from "codemirror";
import { keymap } from "@codemirror/view";

import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";

import { foldGutter, foldKeymap, syntaxHighlighting } from "@codemirror/language";
import { linter, lintGutter, lintKeymap } from "@codemirror/lint";
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";

import { THEME, HIGHTLIGHT_STYLE } from "../components/editor-theme";
import type { Extension } from "@codemirror/state";

const initalText = `\
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>
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

      // javascript({
      //   jsx: true,
      //   typescript: true
      // }),

      html(),

      // foldGutter({
      //   openText: "expand_more",
      //   closedText: "chevron_right"
      // }),

    ].concat(ext),
    parent: parentEl
  });
};
