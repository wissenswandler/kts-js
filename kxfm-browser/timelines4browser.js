import{  get_url_param         	} from "@kxfm/one"

import{	kts_console 		,
	dot2svg                 ,
	digraph                 } from "@kxfm/browser"

import{ StoryToDotRenderer, Story,
        show_future_faded,
        only_shared_events,
        StoryToHTMLRenderer,
        ReducedStory,
        SharedEventFilter,
        DaterangeFilter,
        set_input_value,
                               	} from "/lib/timelines2dot.js"

/*
 * tag function,
 * turning the template literal into a KTS Timelines diagram
 * accepts a Timelines story
 */
export
function timelines( strings, ... keys )
{
  return dot2svg(   new StoryToDotRenderer(  strings.reduce( (a, c) => a + keys.shift() + c )  )   )
}
