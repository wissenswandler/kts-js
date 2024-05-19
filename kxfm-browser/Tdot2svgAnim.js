 /*
  * methods for Browser clients
  * to render Animated SVG
  */

import {  
          KTS4Dot             ,
	        Tdot2svgStrings     ,
                              } from "@kxfm/one"
import {
          Tdot2svgDOM         ,  
                              } from "./Tdot2svgDOM.js"
/*
 * imports and merge for d3-graphviz functionality
 */
import * as         d3g           from "d3-graphviz"
import * as              d3s      from "d3-selection"
import * as                   d3t from "d3-transition"
const  d6 = merge( [d3g, d3s, d3t] )

function merge(modules) 
{
  const o = {};
  for (const m of modules) {
    for (const k in m) {
      if (hasOwnProperty.call(m, k)) {
        if (m[k] == null) Object.defineProperty(o, k, {get: getter(m, k)});
        else o[k] = m[k];
      }
    }
  }
  return o;

  function getter(object, name) {
    return () => object[name];
  }
}
/* end d3-graphviz */

// pseudo compatibility with nodejs so that REPL can try to load this module
// of course: using 'document' in nodejs will fail
const document = globalThis.document ?? {}


export
async function animinit()
{
  return new Tdot2svgAnim( d6 )
}

 /*
  *
  */
class Tdot2svgAnim extends Tdot2svgDOM
{

constructor( graphvizInstance )
{
  super( graphvizInstance )
}

// installing a Promise to animate 
// an existing SVG node inside dom_node 
// with a new SVG, rendered from dot_string
render2( dot_string, dom_node, duration = 0.5 )
{
  const adjustWidthHeight = (d) =>
  {
    if (d.tag == "svg") 
    {
      try 
      { 
        const svg_width_in_px = d.attributes.width.match( /(\d+)pt/ )[1] * 4 / 3
        if(   svg_width_in_px > this.width )
        {
          d.attributes.width = null
          d.attributes.height = null
        }    
      } 
      catch (error) {
        // can't parse the width attribute
      }
    }
  }
  
  const transitionFactory = () => this.graphviz.transition("magjacT").duration(duration*1000*2/3);

  // create the Graphviz renderer instance on the passed-in element
  const graphviz_init = this.graphviz.select( dom_node ).graphviz( true )
  graphviz_init
  .zoom( false )
  .tweenPaths(false)
  .tweenShapes(false)
  .attributer( adjustWidthHeight )
  .transition( transitionFactory )
  .keyMode("id")  

  const preprocessed_dot = KTS4Dot.preprocess( dot_string )
  
  return new Promise
  ( (resolve, reject) =>
  { 
    graphviz_init.renderDot
    (
      preprocessed_dot, 
      () => resolve(this)
    )
  }
  )
  .then( diagram => globalThis.visco?.on_svg_load( {document: dom_node } ) ?? "" )
  .catch
  ( error => 
   {
    const line_numbered_message = "KTS Anim error " + error + " with following DOT source: " +
    preprocessed_dot.split('\n').map( (l,i) => (i+1) + ". " + l ).join('\n')

    console.error( line_numbered_message )    
    dom_node.innerText = "<div>" + line_numbered_message + "</div>"
   }
  )

}

} // end class Tdot2svgAnim
