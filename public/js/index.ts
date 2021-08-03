import {
    highlightSpecialChars,
    drawSelection,
    highlightActiveLine,
    keymap,
    EditorView
} from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import {
    history,
    historyKeymap
} from "@codemirror/history";
import {
    foldGutter,
    foldKeymap
} from "@codemirror/fold";
import { indentOnInput } from "@codemirror/language";
import {
    lineNumbers,
    highlightActiveLineGutter
} from "@codemirror/gutter";
import {
    defaultKeymap,
    defaultTabBinding
} from "@codemirror/commands";
import { bracketMatching } from "@codemirror/matchbrackets";
import {
    closeBrackets,
    closeBracketsKeymap
} from "@codemirror/closebrackets";
import {
    highlightSelectionMatches,
    searchKeymap
} from "@codemirror/search";
import {
    autocompletion,
    completionKeymap
} from "@codemirror/autocomplete";
import { commentKeymap } from "@codemirror/comment";
import { rectangularSelection } from "@codemirror/rectangular-selection";
import {
    defaultHighlightStyle,
    tags,
    HighlightStyle
} from "@codemirror/highlight";
import { lintKeymap } from "@codemirror/lint";
import { javascript } from "@codemirror/lang-javascript";

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
const basicSetup = [
    /*@__PURE__*/ lineNumbers(),
    /*@__PURE__*/ highlightActiveLineGutter(),
    /*@__PURE__*/ highlightSpecialChars(),
    /*@__PURE__*/ history(),
    /*@__PURE__*/ foldGutter({
    openText: "expand_more",
    closedText: "chevron_right"
}),
    /*@__PURE__*/ drawSelection(),
    /*@__PURE__*/ EditorState.allowMultipleSelections.of(true),
    /*@__PURE__*/ indentOnInput(),
    defaultHighlightStyle.fallback,
    /*@__PURE__*/ bracketMatching(),
    /*@__PURE__*/ closeBrackets(),
    /*@__PURE__*/ autocompletion(),
    /*@__PURE__*/ rectangularSelection(),
    /*@__PURE__*/ highlightActiveLine(),
    /*@__PURE__*/ highlightSelectionMatches(),
    /*@__PURE__*/ keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...commentKeymap,
        ...completionKeymap,
        ...lintKeymap
    ])
];

const doc = `\
// Click Run for the Bundled + Minified + Gzipped package size
export * from "@okikio/animate";
foldGutter({

}),
`;
(async () => {
    let theme = await fetch(
        "https://cdn.skypack.dev/@primer/primitives@4.5.2/dist/json/colors/dark_dimmed.json"
    ).then((res) => res.json());

    const colors = {
        text: "#adbac7",
        bg: "#22272e",
        guttersBg: "#22272e",
        guttermarkerText: "#22272e",
        guttermarkerSubtleText: "#636e7b",
        linenumberText: "#768390",
        cursor: "#cdd9e5",
        selectionBg: "rgba(108,182,255,0.3)",
        activelineBg: "#2d333b",
        matchingbracketText: "#adbac7",
        linesBg: "#22272e",
        syntax: {
            comment: "#768390",
            constant: "#6cb6ff",
            entity: "#dcbdfb",
            keyword: "#f47067",
            storage: "#f47067",
            string: "#96d0ff",
            support: "#6cb6ff",
            variable: "#f69d50"
        }
    };

    let myTheme = EditorView.theme(
        {
            "&": {
                color: colors.text,
                backgroundColor: colors.bg,
                "border-radius": ".5rem",

                colorScheme: "dark",
                overflow: "hidden",

                height: "500px",
                resize: "both",

                fontSize: "14px",
                "font-variant-numeric": "tabular-nums",
                fontFamily: `Consolas, "Courier New", monospace`
            },
            ".cm-content": {
                paddingBlock: "15px",
                caretColor: colors.cursor
            },
            "&.cm-focused .cm-cursor": {
                borderLeftColor: colors.cursor
            },
            "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": {
                backgroundColor: colors.selectionBg,
                borderRadius: "5px"
            },

            ".cm-searchMatch": {
                backgroundColor: "#72a1ff59",
                border: "1px solid #457dff",
                borderRadius: "3px"
            },
            ".cm-searchMatch.cm-searchMatch-selected": {
                backgroundColor: "#61ffcc2f",
                borderRadius: "3px"
            },

            ".cm-selectionMatch": {
                backgroundColor: "#1aabff36",
                borderRadius: "5px"
            },
            ".cm-activeLine": {
                backgroundColor: colors.activelineBg,
                borderRadius: "5px"
            },
            ".cm-activeLineGutter": {
                backgroundColor: "transparent",
                color: "#E1E4E8"
            },

            ".cm-matchingBracket, .cm-nonmatchingBracket": {
                backgroundColor: "#25686C",
                borderRadius: "3px",
                color: colors.matchingbracketText
            },

            ".cm-gutters": {
                backgroundColor: colors.guttersBg,
                color: colors.guttermarkerSubtleText,
                border: "none"
            },
            ".cm-foldPlaceholder": {
                backgroundColor: "transparent",
                border: "none",
                color: "#ddd"
            },
            ".cm-lineNumbers": {
                "min-width": "5ch"
            },
            ".cm-foldGutter .cm-gutterElement": {
                transition: "color 0.25s ease",
                fontFamily: "Material Icons",
                paddingInline: "5px",
                "&:hover": {
                    color: theme.scale.gray[1]
                }
            },

            ".cm-tooltip": {
                border: "1px solid #181a1f",
                backgroundColor: colors.activelineBg,
                padding: "5px",
                "border-radius": "5px",
                "box-shadow": "0px 0px 15px rgb(20 20 20 / 25%)"
            },
            ".cm-tooltip.cm-tooltip-autocomplete": {
                "& > ul > li": {
                    "border-radius": "3px"
                },
                "& > ul > li[aria-selected]": {
                    backgroundColor: colors.bg,
                    color: colors.text
                }
            }
        },
        { dark: true }
    );

    const myHighlightStyle = HighlightStyle.define([
        {
            tag: [
                tags.variableName,
                tags.propertyName,
                tags.derefOperator,
                tags.separator
            ],
            color: "white"
        },

        {
            tag: [tags.comment, tags.lineComment, tags.blockComment],
            color: theme.scale.gray[3]
        },
        {
            tag: [
                tags.definitionKeyword,
                tags.bitwiseOperator,
                tags.logicOperator,
                tags.arithmeticOperator,
                tags.definitionOperator,
                tags.updateOperator,
                tags.compareOperator,
                tags.operatorKeyword,
                tags.punctuation,
                tags.null,
                tags.keyword
            ],
            color: colors.syntax.keyword
        },
        {
            tag: [tags.string, tags.special(tags.string)],
            color: colors.syntax.string
        },

        {
            tag: [tags.regexp],
            color: theme.scale.orange[2]
        },

        { tag: [tags.self], color: theme.scale.blue[3] },
        {
            tag: [tags.number, tags.bool, tags.modifier, tags.atom],
            color: theme.scale.blue[2]
        },

        {
            tag: [
                tags.function(tags.variableName),
                tags.function(tags.propertyName),

                tags.typeName,
                tags.labelName,
                tags.className
            ],
            color: colors.syntax.entity
        },

        { tag: [tags.bracket], color: theme.scale.yellow[1] }
    ]);

    new EditorView({
        state: EditorState.create({
            doc,
            extensions: [
                basicSetup,

                myTheme,
                myHighlightStyle,

                keymap.of([defaultTabBinding]),
                javascript({
                    typescript: true
                })
            ]
        }),
        parent: document.querySelector("#editor")
    });
})();

// new Worker(new URL("./workers/my-worker.ts", import.meta.url), {
//   type: "module"
// });
