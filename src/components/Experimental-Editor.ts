
import marked from "marked";

import { Workspace } from "@qualified/codemirror-workspace";
import "@qualified/codemirror-workspace/css/default.css";

const modeMap: { [k: string]: string } = {
  json: "application/json",
  typescript: "text/typescript",
  javascript: "text/javascript",
  html: "text/html",
  css: "text/css",
};

const highlight = (code: string, language: string) => {
  const mode = modeMap[language] || "text/plain";
  const tmp = document.createElement("div");
  CodeMirror.runMode(code, mode, tmp, { tabSize: 4 });
  return tmp.innerHTML;
};

marked.use({
  // @ts-ignore renderer can be object literal
  renderer: {
    code(code: string, language: string | undefined) {
      if (!language) language = "text";
      code = highlight(code, language);
      // We need to add a class for the theme (e.g., `cm-s-idea`) on the wrapper.
      // If we're using a custom theme, it can apply its styles to `code[class^="language-"]`
      // and use Marked's default `code` with `highlight` option.
      return `<pre><code class="cm-s-idea language-${language}">${code}</code></pre>`;
    },
  },
});

const initialText = `export * from "@okikio/animate";`;
import Codemirror from "./codemirror";

const config: CodeMirror.EditorConfiguration = {
  theme: "idea",
  // keyMap: "vim",
  gutters: ["cmw-gutter"],
  lineNumbers: true,
  matchBrackets: true,
  autoCloseBrackets: true,
};

const TSCodeEditor = CodeMirror($("#editor"), {
  ...config,
  mode: "text/typescript",
  value: initialText,
});

const TS_WORKER = "ts-worker";
const workspace = new Workspace({
  rootUri: "inmemory://workspace/",
  getLanguageAssociation: (uri: string) => {
    if (uri.endsWith(".ts")) {
      return { languageId: "typescript", languageServerIds: [TS_WORKER] };
    }
    return null;
  },
  getConnectionString: async (id: string) => {
    switch (id) {
      case TS_WORKER:
        return "workers/worker.js";
      default:
        return "";
    }
  },
  // Support Markdown documentation
  renderMarkdown: (markdown) => marked(markdown),
});

workspace.openTextDocument("index.ts", TSCodeEditor);