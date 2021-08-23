importScripts("https://unpkg.com/@typescript/vfs@1.3.4/dist/vfs.globals.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/typescript/4.4.1-rc/typescript.min.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js");

var { createDefaultMapFromCDN, createSystem } = globalThis.tsvfs;
var ts = globalThis.ts;
var lzstring = globalThis.LZString;// @ts-ignore
globalThis.localStorage = globalThis.localStorage ?? {};
console.log(globalThis)

const start = async () => {
    const shouldCache = false;
    // This caches the lib files in the site's localStorage
    const fsMap = await createDefaultMapFromCDN({ target: ts.ScriptTarget.ES2015 }, "4.3.5", shouldCache, ts)

    // This stores the lib files as a zipped string to save space in the cache
    // const otherMap = await createDefaultMapFromCDN({ target: ts.ScriptTarget.ES2015 }, "3.7.3", shouldCache, ts, lzstring)

    fsMap.set("index.ts", "const hello = 'hi'")
    // ...
    const system = createSystem(fsMap);
    console.log(system)
}

start()
// const shouldCache = true;
// // This caches the lib files in the site's localStorage
// const fsMap = await createDefaultMapFromCDN({ target: ts.ScriptTarget.ES2015 }, "3.7.3", shouldCache, ts)

// fsMap.set("index.ts", 'const a = "Hello World"');

// const system = globalThis.tsvfss.createSystem(fsMap);

// const compilerOpts = {
//     target: globalThis.ts.ScriptTarget.ES2015
// };
// const env = globalThis.tsvfss.createVirtualTypeScriptEnvironment(
//     system,
//     ["index.ts"],
//     globalThis.ts,
//     compilerOpts
// );

// // You can then interact with the languageService to introspect the code
// let v = env.languageService.getDocumentHighlights("index.ts", 0, ["index.ts"]);
// console.log(v)