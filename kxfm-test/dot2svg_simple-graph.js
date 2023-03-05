/*
 * test does not run in micro library because we don't want to add graphviz as a dependency there
 */

import { Graphviz } from "@hpcc-js/wasm/graphviz";
import Tdot2svgStrings from '@kxfm/dot2svg/Tdot2svgStrings.js';
const transformer = new Tdot2svgStrings(  await Graphviz.load() );

console.log(  transformer.build_diagram_from_string( "digraph Pattern { Cause -> Effect }" )  );