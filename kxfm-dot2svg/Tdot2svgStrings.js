/*
 * lightweight KTS lib for all environments
 * graphviz implementation must be initialized externally (CLI, Browser)
 *
 * don't chalk here because it does not work in Forge FaaS logging
 */
import {KTS4Dot} from '@kxfm/dot';
import {KTS4SVG} from '@kxfm/svg';

export class Tdot2svgStrings
{
	// standard image size to be used for both dimensions
	static IMAGE_SIZE = 16;

	graphviz = null;

	constructor( graphvizImplementation	)
	{
		if( graphvizImplementation == null )
			throw new Error( "graphvizImplementation must not be null" );

		this.graphviz = graphvizImplementation;
	}

/*
 * build diagram from DOT source string
 *
 * the source string is decorated to include KTS specific attributes for generating navigable SVG
 * 
 * the resulting SVG is decorated with KTS specific CSS and Javascript, to be used as a stand-alone interactive SVG document
 */
build_diagram_from_string( dot_string, libPath )
{
  	let imageAttributeArray = Tdot2svgStrings.getImageAttributeArray( dot_string );

	let kts_dot = KTS4Dot.preprocess(dot_string);
	
	let svg=null;
	/*
	 * BUG: the outer catch block never catches errors from graphviz, such as:
	 * Error: syntax error in line 35 near '-'
	 * instead, such error is simply logged to the console outside KTS (by hpcc-js/wasm ?)
	 */
	try
	{
		svg=this.graphviz.dot
		(
			this.graphviz.unflatten( kts_dot, 5, true, 5)
			,
			"svg"
			,
			{ images: imageAttributeArray } 
		);
		try
		{
			return KTS4SVG.rewrite_GraphViz_SVG_to_KTS_SVG( svg, libPath );
		}
		catch (e)
		{
			console.error( e.stack );
			console.error( "... while post-processing SVG" );
			console.error( "returning error SVG instead of crashing...\n~~~~~~~~" );
			return Tdot2svgStrings.simple_svg_from_error( e );
		}
	}
	catch (e)
	{
		console.error( e.stack );
		console.error( "... with following DOT source:\n~~~~~~~~\n" + dot_string + "\n~~~~~~~~" );
		console.error( "returning error SVG instead of crashing...\n~~~~~~~~" );
		return Tdot2svgStrings.simple_svg_from_error( e );
	}
}

/*
 * pure translator from DOT source string to SVG string
 */
dot2svg( dot_string )
{
	let svgtag;
	try
	{
		let imageAttributeArray = Tdot2svgStrings.getImageAttributeArray( dot_string );
		let kts_dot = KTS4Dot.preprocess(dot_string);
		let unflat_dot = this.graphviz.unflatten( kts_dot, 5, true, 5);
		let svgdoc = this.graphviz.dot(	unflat_dot,	"svg", {   images: imageAttributeArray } ) ;
		svgtag = svgdoc.slice( svgdoc.indexOf( "<svg" ) )
	
	} catch (e)
	{
		console.error( e.stack );
		console.error( "... with following DOT source:\n~~~~~~~~\n" + dot_string + "\n~~~~~~~~" );
		console.error( "returning error SVG instead of crashing...\n~~~~~~~~" );
		svgtag = Tdot2svgStrings.simple_svg_from_error( e );
	}
	return svgtag;
}

/*
 * render a DOT source string into a SVG element on an existing page,
 * typically in a reactive way as in Jira
 */
render( dot_string, elmSelector, context )
{
	const svgtag = this.dot2svg( dot_string );

	KTS4SVG.integrate_svg_into_page( svgtag, elmSelector, context );

	let consider_fullpage = true;
	if( typeof context !== 'undefined' )
	{
		switch( context?.extension?.type )
      	{
        case 'jira:projectPage':
		case 'jira:globalPage':
			break;
		default:
			consider_fullpage = false;
		}
	}
	on_svg_load( {elmSelector:elmSelector}, {consider_fullpage:consider_fullpage} );	// depends on global function, currently declared by graph.js
}


static simple_svg_from_error( e )
{
	return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
 <text x="50" y="50" text-anchor="middle" alignment-baseline="middle" font-size="0.1em" fill="darkred">error caught in KTS: ${e.message}</text>
</svg>`;
}

static getImageAttributeArray( dot_string )
{
  // parse the dot string for image URLs
  let regex = /IMG\s*SRC\s*=\s*"([^"]*)"/g;
  let imageUrlArray = Array.from(dot_string.matchAll(regex)).map((match) => match[1]);

  // create an array with entries of form { path:"", width:"16px", height:"16px" } for every entry of input array [C]
  return imageUrlArray.map(  image => ({ path: image, width: this.IMAGE_SIZE+'px', height: this.IMAGE_SIZE+'px' }) );
}

} // end of class Tdot2svgStrings