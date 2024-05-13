export {  Story               } from "./Story.js"
export {  ReducedStory        } from "./ReducedStory.js"
export {  DaterangeFilter     } from "./DaterangeFilter.js"
export {  SharedEventFilter   } from "./SharedEventFilter.js"
export {  StoryToDotRenderer  } from "./StoryToDotRenderer.js"

export const only_shared_events               = "only shared events"
export const show_future_faded                = "fade future"

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

/* TODO: apply to demo story */
const central_entity = "Second_Owner"

/* TODO: apply deviation to demo or test story */
const title_dot = "" // to be included near the top of DOT source - can be used to implement a title or supplementary graphics

/* TODO: apply deviation to demo or test story */
const diagram_options = 
{
  future_pointer_minlen: 1
  ,
  places_edge_style : "dotted"

  , entryArrowtail : "crow" // for a nicer distinction between the entity's name and its first event along the timeline
  
  //, entity_edge_style : "dashed"
  
  //, showExit : false // a river e.g. never extends beyond its estuary

  //, render_terminal_event_boxed : true
}

export function timelines2dot( timelines_text ) 
{
  return "digraph G {\n" + timelines_text + "\n}\n";
}
