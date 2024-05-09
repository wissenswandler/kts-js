import{  Graphviz              } from "@hpcc-js/wasm/graphviz"

import{  KTS4Browser,
         create_kts_console,
         get_url_param         } from "@kxfm/one"

import{ StoryToDotRenderer, Story,
        show_future_faded,
        only_shared_events,
        StoryToHTMLRenderer,
        ReducedStory,
        SharedEventFilter,
        DaterangeFilter,
        set_input_value,
                               } from "/lib/timelines2dot.js"

export
const kts_console = create_kts_console()

const graphviz = await Graphviz.load()
const transformer = new KTS4Browser( graphviz )

export 
const dot2svg = transformer.dot2svg

export
const digraph = transformer.digraph

/*
 * tag function,
 * turning the template literal into a KTS Timelines diagram
 * accepts a Timelines story
 */
export
function timelines( strings, ... keys )
{
  return transformer.dot2svg(   new StoryToDotRenderer(  strings.reduce( (a, c) => a + keys.shift() + c )  )   )
}
