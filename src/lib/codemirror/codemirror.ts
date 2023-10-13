import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";

import { basicSetup, EditorView } from "codemirror";
import { THEME, HIGHTLIGHT_STYLE } from "@/lib/codemirror/editor-theme";

import { Compartment, EditorState, type Extension } from "@codemirror/state";
import { indentUnit, syntaxHighlighting } from "@codemirror/language";
import { json, jsonLanguage, jsonParseLinter } from "@codemirror/lang-json";
import { linter } from "@codemirror/lint";

const initalText = `\
{
	"compilerOptions": {
		"target": "es2017",
		"module": "commonjs",
		"strict": true,
		"esModuleInterop": true,
		"skipLibCheck": true,
		"forceConsistentCasingInFileNames": true,
	}
}
`;

export const tabSize = new Compartment

export default (parentEl: HTMLElement, extentions?: Extension, doc = initalText) => {
	return new EditorView({
		state: EditorState.create({
			doc,
			extensions: [
				basicSetup,

				THEME,
				syntaxHighlighting(HIGHTLIGHT_STYLE, { fallback: true }),

				keymap.of([indentWithTab]),
				tabSize.of(EditorState.tabSize.of(2)),
				// javascript({
				// 	typescript: true
				// }),
				json(),
				linter(jsonParseLinter()),
				(extentions ? extentions : [])
			]
		}),
		parent: parentEl
	});
};
