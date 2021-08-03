import { basicSetup } from "@codemirror/basic-setup";

import { keymap, EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { foldGutter } from "@codemirror/fold";

import { defaultTabBinding } from "@codemirror/commands";
import { tags, HighlightStyle } from "@codemirror/highlight";

import { javascript } from "@codemirror/lang-javascript";

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
                
                foldGutter({
                    openText: "expand_more",
                    closedText: "chevron_right"
                }),

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
