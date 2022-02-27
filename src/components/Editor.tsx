import { onMount } from "solid-js";
import Codemirror from "./codemirror";

import { languageServer } from './lsps';
export const ls = languageServer({
    // json-server
    serverWorker: new Worker(new URL('./tsserver.ts', import.meta.url), { type: 'module', name: "ts-server" }),
    rootUri: 'file:///',
    documentUri: `file:///index.ts`, // tsconfig.json
    languageId: 'ts' // json // As defined at https://microsoft.github.io/language-server-protocol/specification#textDocumentItem.
});

export default () => {
    let editorEl: HTMLDivElement;
    onMount(() => {
        Codemirror(editorEl, [ls]);
    });

    return <div id="editor" ref={editorEl}></div>;
};
