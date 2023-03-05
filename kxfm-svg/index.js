/*
 * lightweight KTS micro library (no dependencies)
 */

export default class KTS4SVG
{
	/*
	* rewrite GraphViz SVG to include KTS CSS and Javascript,
	* and to fix GraphViz bug: reverse <title> and first <g> tags so that title will be effective in browser
	*/
	static rewrite_GraphViz_SVG_to_KTS_SVG( _svg, libPath = "https://wissenswandler.github.io/lib" )
	{
		if( ! (typeof _svg === 'string')  ) 
		{
			console.debug( "SVG of type " + typeof _svg + " = " + _svg );
			throw new Error( "SVG is not of String type" );
		}

		// insert helptext placeholder before closing </svg> tag
		// NOTE: this causes the helptext object to be drawn last and capturing all focus and click events
		// the problem with reversed order is that Graphviz always draws an unsolicited large filled polcygon as background
		// which makes the diagram opaque and prevents the helptext -in the background- from being visible
		let svg = _svg.replace( /<\/svg>/ , '<foreignObject id="fo0"><div id="htmldiv" xmlns="http://www.w3.org/1999/xhtml" /></foreignObject>\n</svg>' );

		// remove width and height attributes from <svg> tag as it causes unpredictable scaling (something like 50% larger than expected)
		svg = svg.replace( /<svg( (width|height)="\d+pt"){0,2}/g, '<svg' )

		const svgarray = svg.split(/\r?\n/);

		if( svgarray.length < 10 )
		{
			console.warn( "SVG is too short to be a GraphViz SVG - returning without rewriting" );
			return svg;
		}

		let swoppers = [8,9];
		// test whether line 9 consists of pattern ^<title>.+</title>$ ONLY and line 8 consists of pattern ^<g.+>$
		if
		(	
			svgarray[9].match(/^<title>.+<\/title>$/)
			&&
			svgarray[8].match(/^<g.+>$/)
		)
		{
			//console.debug( "swopping lines 9 + 8" );
			swoppers = [9,8];
		}
		else
		{
			//console.debug( "NOT swopping lines 9 + 8" );
		}

		return `${
			/*
			* keep <xml> preamble
			*/
			svgarray[0]}\n<?xml-stylesheet type="text/css" href="${libPath}/graph.css"?>\n${
			/*
			* join 2 DOCTYPE lines
			*/
			svgarray.slice(1, 3).join("")}
${svgarray[3]} via hpcc-js/wasm/graphviz, decorated by KTS -->
${
			/*
			 * skip "title" comment lines
			 *
			 * join 2 <svg ... viewBox .../> lines
			 */
			svgarray.slice(6, 8).join("")
			}
<script xlink:href="${libPath}/graph.js" type="text/ecmascript" />
<script xlink:href="https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.5.0/dist/svg-pan-zoom.min.js" type="text/ecmascript" />
${
			/*
			* fix GraphViz bug: reverse <title> and first <g> tags so that title will be effective in browser
			*/
			svgarray[ swoppers[0] ]}\n${svgarray[ swoppers[1] ]}\n${
			/*
			* keep all the rest of SVG document except last (empty) line
			*/
			svgarray.slice(10, -1).join("\n")
		}`;
	}	// end of rewrite_GraphViz_SVG_to_KTS_SVG()

    // escape html special characters
    // https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
	static escapeHtml(unsafe)
	{
		return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
	}	// end of escapeHtml()

static integrate_svg_into_page( svgtag, elmSelector, context )
{
  	// see HEIGHT HACK below
  	let clientHeight = document.querySelector( "body" ).clientHeight;
  
	let outElement = document.querySelector( elmSelector );
	if( outElement == null )
	{
		console.error( `no element found for selector ${elmSelector}` );
		return;
	}
	outElement.innerHTML = svgtag;

	if( multiple_kts_diagrams() )
	{
		devdebug( "no SVG scaling because multiple diagrams in this body" );
	}
	else
	{
		try
		{
			let svgElm = document.querySelector( elmSelector + " svg" );

			svgElm.setAttribute( "orig_width", svgElm.getAttribute( "width" ) );
			// using all available space (horizontal)
			svgElm.setAttribute(      "width", "100%");

			let	 orig_height = null;
			try{ orig_height = svgElm.getAttribute( "height" ).split( "pt" )[0] } catch(e){ /* no information about height*/ }

			let targetHeight = clientHeight;
			if( context && context.extension.type == 'jira:dashboardGadget' )
			{
				// Jira Dashboard Gadget has no implicit height. It collapses unless it sets a height explicitly.
				targetHeight = Math.max(  orig_height, Math.floor( 640 / 3 * 4 )  );
			}

			svgElm.setAttribute( "orig_height", orig_height+"pt" );
			// using all available space (vertical)
			// weird HEIGHT HACK against the inflated height in form of an SVGAnimatedLength;
			// found the scaling factor /4 * 3 by observation and experiment
			// the goal is to set the SVG element to "100%" of the available height
			svgElm.setAttribute("height", ( targetHeight / 4 * 3) + "pt") 

			//outElement.setAttribute( "height", 900 + "pt" );
		}
		catch (e) { console.error( e.stack + "...\nNo SVG tag?") }
	} 
}	// end of integrate_svg_into_page()

} // end of class KTS4SVG