/*
* test does not run in micro library because we don't want to add graphviz as a dependency there
*/

import { Graphviz } from "@hpcc-js/wasm/graphviz";
import {Tdot2svgStrings} from '@kxfm/dot2svg/Tdot2svgStrings.js';
const transformer = new Tdot2svgStrings(  await Graphviz.load() );

console.warn( "Expecting:" )
console.warn( "Error: syntax error in line 29 near '-'")
console.warn( "SVG is too short to be a GraphViz SVG - returning without rewriting" )
console.warn( "========" )

console.log(  transformer.build_diagram_from_string( "digraph must_fail_with_syntax_error_in_dot_source { Cause -?- Effect }" )  );
