import { createSignal, onMount } from 'solid-js';
import Codemirror from "./codemirror";

export default ({ children }) => {
  let editorEl: HTMLDivElement;
  onMount(() => {
    Codemirror(editorEl);

    new Worker(new URL("/workers/tsserver.js", import.meta.url), {
      name: 'ts-server',
      // type: "module"
    });

  });

  return (<div id="editor" ref={editorEl}></div>);
}