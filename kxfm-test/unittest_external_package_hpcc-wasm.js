import { Graphviz } from "@hpcc-js/wasm/graphviz";
const graphviz = await Graphviz.load();

const dot = "digraph G { Hello -> World }";
const svg = graphviz.dot(dot);
console.log( svg );