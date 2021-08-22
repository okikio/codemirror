import {
    createSystem,
    createVirtualTypeScriptEnvironment
} from "@typescript/vfs";
// import ts from "typescript";

// @ts-ignore
// import ts from "https://unpkg.com/typescript@4.3.5/lib/typescript.js";

// @ts-ignore
// import ts from "https://cdn.esm.sh/typescript";

import ts from "./typescript";
console.log(ts)

const fsMap = new Map<string, string>();
fsMap.set("index.ts", 'const a = "Hello World"');

const system = createSystem(fsMap);

const compilerOpts = {};
// const env = createVirtualTypeScriptEnvironment(
//     system,
//     ["index.ts"],
//     ts,
//     compilerOpts
// );


// // You can then interact with the languageService to introspect the code
// let v = env.languageService.getDocumentHighlights("index.ts", 0, ["index.ts"]);
// console.log(v)
export { };