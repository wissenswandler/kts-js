 /*
  * class for rendering DOT content via SVG to DOM in the browser
  *
  * and base for animated subclass
  */

import {  
          KTS4Dot             ,
	        Tdot2svgStrings     ,
                              } from "@kxfm/one"

// works in Obs Framew, but not on unpkg due to the "graphviz" part of the URL !
//import {  Graphviz            } from "@hpcc-js/wasm/graphviz"

// works on unpkg, but not in Obs Framew !
//import {  Graphviz            } from "@hpcc-js/wasm"

/*
 * dynamic graphviz imports per environment
 * as a workaround for the above catch-22
 */
async function import_graphviz()
{
  let hwas
  try
  {
    // preferred way: importing from local node module
    hwas = await import("@hpcc-js/wasm/graphviz")
    console.info( "KTS: imported graphviz from local node module" )
  }
  catch( error )
  {
    console.info( "KTS: caught " + error + ", falling back to online lib" )
    hwas = await import("https://unpkg.com/@hpcc-js/wasm/dist/graphviz.js")
    console.info( "KTS: imported graphviz from unkpg online" )
  }
  return hwas.Graphviz
}
const Graphviz = import_graphviz()

// pseudo compatibility with nodejs
// so that REPL can load this module
// of course: using 'document' in nodejs fails
const document = globalThis.document ?? {}


export
const default_options = { fit : 'auto' }


export class Tdot2svgDOM extends Tdot2svgStrings
{

/*
 * unfortunately, following implementations are not equivalent;
 * the static initializer works in the browser,
 * where the getter is failing
 */
//get width() { document.querySelector('body').clientWidth }
//    width  =  document.querySelector('body').clientWidth

constructor( graphvizInstance, options = {},  ...rest)
{
  super( graphvizInstance, options, ...rest )

  this.width =
    options.clientwidth ?? document.querySelector?.('body').clientWidth ?? 480

  this.dot2svg      = this.dot2svg    .bind( this )
  this.digraph      = this.digraph    .bind( this )
  this.digraph2svg  = this.digraph2svg.bind( this )
}

/*
 * tag function,
 * turning the template literal into a KTS Value Map
 * accepts a dot fragment (digraph content)
 */
digraph ( strings, ... keys )
{
  return this.digraph2svg(  strings.reduce( (a, c) => a + keys.shift() + c )  )
}

/*
 * shorthand for dot2svg, wrapping a "digraph { ... }" block around DOT source
 */
digraph2svg ( inside_digraph_block, options )
{
  return this.dot2svg( KTS4Dot.dot_fragment_2_dot_string(inside_digraph_block, options ), options )
}

 /*
  * returns a promise to an HTML <span> element containing the diagram
  */
async dot2svg ( dot_string_generator, options = default_options )
{
  this.width = options.width ?? document.querySelector?.('body').clientWidth ?? 480

  const dot_string =
    typeof dot_string_generator === String 
    ?
    dot_string_generator 
    : 
    ""+dot_string_generator // triggering toString()

  let svg_string = await super.dot2svg( dot_string, false )

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
  {
    visco.on_svg_load( {document} )
    visco.on_svg_load( {document:span} )
    console.debug( "KTS: visco initialized" )
  }

  return span
}

} // end class Tdot2svgDOM


const transformer = new Tdot2svgDOM( Graphviz )

export 
const dot2svg     = transformer.dot2svg

export
const digraph     = transformer.digraph

export
const digraph2svg = transformer.digraph2svg

export
const dotReplaceWithSvg = ( selector = '.dotcontainer' ) =>
  document
  .querySelectorAll( selector )
  .forEach
  ( container =>
    dot2svg( container.innerText, false )
    .then
    ( svg_tag =>
    { container.innerHTML = svg_tag.outerHTML;
      visco.on_svg_load( {document:container} )
    }
    )
  )
