 /*
  * methods for Browser clients
  * to operate on HTML/SVG DOM
  * and utilize VisCo
  */

import { Tdot2svgStrings  } from "./Tdot2svgStrings.js"

export class KTS4Browser extends Tdot2svgStrings
{

static default_options = { fit : 'auto' }

width = document.querySelector('body').clientWidth

constructor( graphvizInstance, options = {},  ...rest)
{
  super( graphvizInstance, options, ...rest )

  if( options.clientwidth )
    this.width = options.clientwidth
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
this.dot2svg( this.dot_fragment_2_dot_string(inside_digraph_block, options ), options )

/* wrapping a dot fragment with the obligatory "digraph { ... }" block,
 * and injecting an optional < options.title > tag
 */
dot_fragment_2_dot_string = (fragment,options) =>
`strict digraph ${options?.title ? ("<" + options.title + ">") : ""} { ${fragment} }`

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

  visco.on_svg_load( {document:span} )

  return span
}

}
