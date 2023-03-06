/*
 * lightweight KTS lib for node.js
 *
 * depends on streams
 * may not work in Forge FaaS or Browser
 */

// streams come without import
import {Tdot2svgStrings} from './Tdot2svgStrings.js';

export class Tdot2svgStreams
{

static build_diagram_from_stdin( libPath, graphviz )
{
	let transformer = new Tdot2svgStrings( graphviz );

	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	let stream_input = "";
	process.stdin.on
	(	'data',
	 	(chunk) => stream_input += chunk
	);
	process.stdin.on
	(	'end',
		() => console.log( transformer.build_diagram_from_string( stream_input, libPath ) )
	);
}

} // end class Tdot2svgStreams