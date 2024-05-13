export {  
          KTS4Browser,
          digraph,
          digraph2svg,
          dot2svg,
          animate_content,
       	  kts_console,      
          timelines,        
                          } from "./KTS4Browser.js"

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
