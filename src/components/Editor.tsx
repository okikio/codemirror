import { onMount } from "solid-js";
import Codemirror from "./codemirror";

import { languageServer } from './lsps';
export const ls = languageServer({
    serverWorker: new Worker(new URL('./json-server.ts', import.meta.url), { type: 'module', name: "json-server" }),
    rootUri: 'file:///',
    documentUri: `file:///tsconfig.json`, // 
    languageId: 'json' // json // As defined at https://microsoft.github.io/language-server-protocol/specification#textDocumentItem.
});

export default () => {
    let editorEl: HTMLDivElement;
    onMount(() => {
        Codemirror(editorEl, [ls]);
    });

    return <div id="editor" ref={editorEl}></div>;
};
