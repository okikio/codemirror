import { onMount } from "solid-js";

import Codemirror from "@/lib/codemirror/codemirror";
import { languageServer } from '@/lib/lsp/lsp';

import JSONServerWorker from "@/lib/lsp/json-server?worker";
const JSONServer = new JSONServerWorker();
export const ls = languageServer({
	serverWorker: JSONServer,
	rootUri: 'file:///',
	documentUri: `file:///tsconfig.json`, // tsconfig.json
	languageId: 'json' // json // As defined at https://microsoft.github.io/language-server-protocol/specification#textDocumentItem.
});

export default () => {
	let editorEl: HTMLDivElement;
	onMount(() => {
		Codemirror(editorEl, [
			ls
		]);
	});

	// @ts-ignore
	return <div id="editor" ref={editorEl}></div>;
};
