import JSON_WORKER from "../workers/json-server.ts?worker";

import { onMount } from "solid-js";
import Codemirror from "../scripts/codemirror";

import { languageServer } from "../scripts/lsps";

export default () => {
  let editorEl: HTMLDivElement;
  onMount(() => {
    const ls = languageServer({
      // serverWorker: new Worker(new URL('./json-server.ts', import.meta.url), { type: 'module', name: "json-server" }),
      serverWorker: new JSON_WORKER(),
      rootUri: "file:///",
      documentUri: `file:///tsconfig.json`, //
      languageId: "json", // As defined at https://microsoft.github.io/language-server-protocol/specification#textDocumentItem.
    });

    Codemirror(editorEl, ls);
  });

  return <div id="editor" ref={editorEl}></div>;
};
