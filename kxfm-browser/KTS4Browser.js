 /*
  * methods for Browser clients
  * to render SVG,
  * operate on HTML/SVG DOM
  * and utilize VisCo
  */

import{ KTS4Dot                 ,
	Tdot2svgStrings         } from "@kxfm/one"

import{  Graphviz               } from "@hpcc-js/wasm/graphviz"

import * as         d3g           from "d3-graphviz"
import * as              d3s      from "d3-selection"
import * as                   d3t from "d3-transition"
const  d6 = merge( [d3g, d3s, d3t] )

function merge(modules) {
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


/*
 * animating DOT content which is passed as an array of strings
 * @param {Array} contents - an array of DOT strings
 * @param {Number} duration - the duration of each content display in seconds
 * @param {Function} visibility - a function that returns a promise that resolves when the caller is visible
 */
export async function* animate_content( contents, duration, visibility )
{
  let i = 0;
  while (true)
  {
    if(   visibility )
    await visibility()

    yield( contents[i] );

    await new Promise( (resolve) => setTimeout(resolve, duration*1000 ) );

    i = (i+1) % contents.length
  }
} 

export const create_kts_console = () =>
{
  const div = document.createElement( 'div' )
  div.setAttribute( "id", "ktsConsole" )
  div.innerText =  "KTS loading..."
  return div
}

 /*
  * class for rendering DOT content to SVG in the browser
  * via different renderer implementations (once versus animated)
  *
  * construct with a graphviz instance for one-time rendering, resulting in a <span><svg>
  *
  * construct with no parameter for animated rendering, resulting in a updated dom element
  * after calling render()
  *
  */
export class KTS4Browser extends Tdot2svgStrings
{

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


static default_options = { fit : 'auto' }

width = document.querySelector('body').clientWidth

static async animinit()
{
  return new KTS4Browser( d6 )
}

constructor( graphvizInstance, options = {},  ...rest)
{
  super( graphvizInstance, options, ...rest )

  if( options.clientwidth )
    this.width = options.clientwidth

  this.dot2svg = this.dot2svg.bind( this )
}

/*
 * tag function,
 * turning the template literal into a KTS Value Map
 * accepts a dot fragment (digraph content)
 */
digraph = ( strings, ... keys ) => 
this.digraph2svg(  strings.reduce( (a, c) => a + keys.shift() + c )  )

/*
 * shorthand for dot2svg, wrapping a "digraph { ... }" block around DOT source
 */
digraph2svg = ( inside_digraph_block, options ) =>
this.dot2svg( KTS4Dot.dot_fragment_2_dot_string(inside_digraph_block, options ), options )


 /*
  * returns an HTML <span> element containing the diagram
  */
dot2svg( dot_string_generator, options = this.constructor.default_options )
{
  const dot_string =
    typeof dot_string_generator === String 
    ?
    dot_string_generator 
    : 
    ""+dot_string_generator // triggering toString()

  let svg_string = super.dot2svg( dot_string, false )

  let transformer_error = svg_string.includes( "error caught in KTS" )

  let remove_width_attribute = false
  
  if
  (
    options.remove_width_height 
    || 
    options.fit && options.fit != "auto"
  )
    remove_width_attribute = true

  let svg_width_in_px = undefined
  try 
  { 
      svg_width_in_px = svg_string.match( /<svg width="(\d+)pt"/ )[1] * 4 / 3
  } 
  catch (error) {
    // can't parse the width attribute
  }
  
  if( options.fit == "auto" )
  {
    if( svg_width_in_px > this.width )
      remove_width_attribute = true
  }

  if( remove_width_attribute )
  {
    svg_string = svg_string.replace( /<svg( (width|height)="\d+.{0,2}"){0,2}/g, '<svg' )
  }

  if( transformer_error )
  {
    svg_string = svg_string
      .replace( /"0.1em"/g, '"5em"' )
      .replace( /<svg( (width|height)="\d+.{0,2}"){0,2}/g, '<svg width="100%" height="25"' );
  }
  
  const 
  span = document.createElement( 'span' )
  span.innerHTML =  svg_string
  span.setAttribute( "id", options.domId )
  if( transformer_error )
  span.classList.add( 'transformer_error' )
  span.classList.add( 'ktscontainer' )

  if( typeof visco === 'undefined' )
    console.error( "KTS: visco is not defined, unable to initialize interaction" )
  else
    visco.on_svg_load( {document:span} )

  return span
}

} // end class KTS4Browser


export
const kts_console = create_kts_console()

const graphviz = await Graphviz.load()
const transformer = new KTS4Browser( graphviz )

export 
const dot2svg = transformer.dot2svg

export
const digraph = transformer.digraph

export
const digraph2svg = transformer.digraph2svg