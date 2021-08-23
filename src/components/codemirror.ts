import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";

import type { Extension, Transaction, EditorStateConfig } from "@codemirror/state";
interface IEditorConfig extends EditorStateConfig {
    /**
    [Extension(s)](https://codemirror.net/6/docs/ref/#state.Extension) to associate with this state.
    */
    extentions?: Extension;
    /**
    The view's initial state. Defaults to an extension-less state
    with an empty document.
    */
    state?: EditorStateConfig;
    /**
    If the view is going to be mounted in a shadow root or document
    other than the one held by the global variable `document` (the
    default), you should pass it here.
    */
    root?: Document | ShadowRoot;
    /**
    Override the transaction [dispatch
    function](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) for this editor view, which
    is the way updates get routed to the view. Your implementation,
    if provided, should probably call the view's [`update`
    method](https://codemirror.net/6/docs/ref/#view.EditorView.update).
    */
    dispatch?: (tr: Transaction) => void;
    /**
    When given, the editor is immediately appended to the given
    element on creation. (Otherwise, you'll have to place the view's
    [`dom`](https://codemirror.net/6/docs/ref/#view.EditorView.dom) element in the document yourself.)
    */
    parent?: Element | DocumentFragment;
}

import { BASIC_SETUP, EditorView, EditorState } from "./editor-basic-setup";
import { THEME, HIGHTLIGHT_STYLE } from "./editor-theme";

const doc = `\
// Click Run for the Bundled + Minified + Gzipped package size
export * from "@okikio/animate";
`;

export default (parentEl: HTMLElement, extentions?: Extension) => { 
    return new EditorView({
        state: EditorState.create({
            doc,
            extensions: [
                BASIC_SETUP,

                THEME, 
                HIGHTLIGHT_STYLE,

                keymap.of([indentWithTab]),
                javascript({
                    typescript: true
                })
            ].concat(extentions)
        }),
        parent: parentEl 
    });
};
