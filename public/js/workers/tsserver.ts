import {
    createSystem,
    createVirtualTypeScriptEnvironment
} from "@typescript/vfs";
// import ts from "typescript";

// @ts-ignore
import ts from "http://cdn.esm.sh/typescript";

const fsMap = new Map<string, string>();
fsMap.set("index.ts", 'const a = "Hello World"');

const system = createSystem(fsMap);




// const compilerOpts = {};
// const env = createVirtualTypeScriptEnvironment(
//     system,
//     ["index.ts"],
//     ts,
//     compilerOpts
// );

// ,
// "@typescript/vfs": "^1.3.4",
// "typescript": "^4.3.5"


// // You can then interact with the languageService to introspect the code
// env.languageService.getDocumentHighlights("index.ts", 0, ["index.ts"]);
export { };
