import {keymap, highlightSpecialChars, drawSelection, highlightActiveLine} from "@codemirror/view"
import {Extension, EditorState} from "@codemirror/state"
import {history, historyKeymap} from "@codemirror/history"
import {foldGutter, foldKeymap} from "@codemirror/fold"
import {indentOnInput} from "@codemirror/language"
import {lineNumbers, highlightActiveLineGutter} from "@codemirror/gutter"
import {defaultKeymap} from "@codemirror/commands"
import {bracketMatching} from "@codemirror/matchbrackets"
import {closeBrackets, closeBracketsKeymap} from "@codemirror/closebrackets"
import {searchKeymap, highlightSelectionMatches} from "@codemirror/search"
import {autocompletion, completionKeymap} from "@codemirror/autocomplete"
import {commentKeymap} from "@codemirror/comment"
import {rectangularSelection} from "@codemirror/rectangular-selection"
import {defaultHighlightStyle} from "@codemirror/highlight"
import {lintKeymap} from "@codemirror/lint"

/// This is an extension value that just pulls together a whole lot of
/// extensions that you might want in a basic editor. It is meant as a
/// convenient helper to quickly set up CodeMirror without installing
/// and importing a lot of packages.
///
/// Specifically, it includes...
///
///  - [the default command bindings](#commands.defaultKeymap)
///  - [line numbers](#gutter.lineNumbers)
///  - [special character highlighting](#view.highlightSpecialChars)
///  - [the undo history](#history.history)
///  - [a fold gutter](#fold.foldGutter)
///  - [custom selection drawing](#view.drawSelection)
///  - [multiple selections](#state.EditorState^allowMultipleSelections)
///  - [reindentation on input](#language.indentOnInput)
///  - [the default highlight style](#highlight.defaultHighlightStyle) (as fallback)
///  - [bracket matching](#matchbrackets.bracketMatching)
///  - [bracket closing](#closebrackets.closeBrackets)
///  - [autocompletion](#autocomplete.autocompletion)
///  - [rectangular selection](#rectangular-selection.rectangularSelection)
///  - [active line highlighting](#view.highlightActiveLine)
///  - [active line gutter highlighting](#gutter.highlightActiveLineGutter)
///  - [selection match highlighting](#search.highlightSelectionMatches)
///  - [search](#search.searchKeymap)
///  - [commenting](#comment.commentKeymap)
///  - [linting](#lint.lintKeymap)
///
/// (You'll probably want to add some language package to your setup
/// too.)
///
/// This package does not allow customization. The idea is that, once
/// you decide you want to configure your editor more precisely, you
/// take this package's source (which is just a bunch of imports and
/// an array literal), copy it into your own code, and adjust it as
/// desired.
export const BASIC_SETUP: Extension = [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),  
  foldGutter({
      openText: "expand_more",
      closedText: "chevron_right"
  }),
  drawSelection(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  defaultHighlightStyle.fallback,
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...commentKeymap,
    ...completionKeymap,
    ...lintKeymap
  ])
]

export {EditorView} from "@codemirror/view";
export {EditorState} from "@codemirror/state";

/**
This is an extension value that just pulls together a whole lot of
extensions that you might want in a basic editor. It is meant as a
convenient helper to quickly set up CodeMirror without installing
and importing a lot of packages.

Specifically, it includes...

- [the default command bindings](https://codemirror.net/6/docs/ref/#commands.defaultKeymap)
- [line numbers](https://codemirror.net/6/docs/ref/#gutter.lineNumbers)
- [special character highlighting](https://codemirror.net/6/docs/ref/#view.highlightSpecialChars)
- [the undo history](https://codemirror.net/6/docs/ref/#history.history)
- [a fold gutter](https://codemirror.net/6/docs/ref/#fold.foldGutter)
- [custom selection drawing](https://codemirror.net/6/docs/ref/#view.drawSelection)
- [multiple selections](https://codemirror.net/6/docs/ref/#state.EditorState^allowMultipleSelections)
- [reindentation on input](https://codemirror.net/6/docs/ref/#language.indentOnInput)
- [the default highlight style](https://codemirror.net/6/docs/ref/#highlight.defaultHighlightStyle) (as fallback)
- [bracket matching](https://codemirror.net/6/docs/ref/#matchbrackets.bracketMatching)
- [bracket closing](https://codemirror.net/6/docs/ref/#closebrackets.closeBrackets)
- [autocompletion](https://codemirror.net/6/docs/ref/#autocomplete.autocompletion)
- [rectangular selection](https://codemirror.net/6/docs/ref/#rectangular-selection.rectangularSelection)
- [active line highlighting](https://codemirror.net/6/docs/ref/#view.highlightActiveLine)
- [active line gutter highlighting](https://codemirror.net/6/docs/ref/#gutter.highlightActiveLineGutter)
- [selection match highlighting](https://codemirror.net/6/docs/ref/#search.highlightSelectionMatches)
- [search](https://codemirror.net/6/docs/ref/#search.searchKeymap)
- [commenting](https://codemirror.net/6/docs/ref/#comment.commentKeymap)
- [linting](https://codemirror.net/6/docs/ref/#lint.lintKeymap)

(You'll probably want to add some language package to your setup
too.)

This package does not allow customization. The idea is that, once
you decide you want to configure your editor more precisely, you
take this package's source (which is just a bunch of imports and
an array literal), copy it into your own code, and adjust it as
desired.
*/
// export const BASIC_SETUP = [
//     lineNumbers(),
//     highlightActiveLineGutter(),
//     highlightSpecialChars(),
//     history(),
//     drawSelection(),
//     EditorState.allowMultipleSelections.of(true),
//     indentOnInput(),
//     defaultHighlightStyle.fallback,
//     bracketMatching(),
//     closeBrackets(),
//     autocompletion(),
//     rectangularSelection(),
//     highlightActiveLine(),
//     highlightSelectionMatches(),
//     keymap.of([
//         ...closeBracketsKeymap,
//         ...defaultKeymap,
//         ...searchKeymap,
//         ...historyKeymap,
//         ...foldKeymap,
//         ...commentKeymap,
//         ...completionKeymap,
//         ...lintKeymap
//     ])
// ];