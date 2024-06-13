 /*
  * functions for Browser clients
  * to render SVG,
  * operate on HTML/SVG DOM
  * and utilize VisCo
  */

export {  
          digraph             ,
          digraph2svg         ,
          dot2svg             ,
          dotReplaceWithSvg   ,
          default_options     ,
                              } from "./Tdot2svgDOM.js"
export {
          animinit            ,
                              } from "./Tdot2svgAnim.js"
export    
          * as visco               
                                from "./visco.js"
import {  
          dot2svg             ,
                              } from "./Tdot2svgDOM.js"
import {  
          StoryToDotRenderer  ,
                              } from "@kxfm/one"
/*
 * tag function,
 * turning the template literal into a KTS Timelines diagram
 * accepts a Timelines story
 */
export
function timelines( strings, ... keys )
{
  return timelines2svg(  strings.reduce( (a, c) => a + keys.shift() + c )  )
}

export
function timelines2svg( timelines_text, options )
{
  return dot2svg(  new StoryToDotRenderer( timelines_text ), options  )
}

export
function set_input_value(input, value, add_or_remove = undefined ) 
{
  if( add_or_remove === undefined )
    input.value = value
  else
  {
    switch( add_or_remove )
    {
      case '+':
        input.value = input.value.concat( Array.isArray(value) ? value : [value] )
        break
      case '-':
        input.value = input.value.filter( e => e != value )
        break
      default:
        throw new Error( `only operations '+' and '-' are defined (reading "${add_or_remove}")` )
    }
  }
  
  input.dispatchEvent(new Event("input", {bubbles: true}));
}

/*
 * Zero Dependencies
 */


/*
 * animating content from an array, optionally awaiting the visibility() Promise
 * @param {Array} contents - an array of DOT strings
 * @param {Number} duration - the duration of each content display in seconds
 * @param {Function} visibility - a function that returns a promise that resolves when the caller is visible
 * - pure JavaScript, no dependencies, most likely only useful in an interactive (browser) environment
 */
export
async function* animate_content( contents, duration, visibility )
{
  let i = 0;
  while (true)
  {
    if(   visibility )
    await visibility()

    yield( contents[i] )

                    i =
                   (i+1) 
         % contents.length

    await new Promise( (resolve) => setTimeout(resolve, duration*1000 ) );
  }
} 
