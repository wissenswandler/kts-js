```js
title = md`# Timelines Library v 4`
```

This is the main implementation of the Timelines system as an Observable Notebook (npm to come).

For an introduction to the method see [the User Guide](https://observablehq.com/@bogo/timelines-user-guide).

For a collection of examples see [Timelines Demos](https://observablehq.com/collection/@bogo/kts-timeline-demos).

```js
timelines `
Rick      Casablanca_1941 airport

Ilsa      Casablanca_1941 airport  airplane

#Victor    Casablanca_1941 airport airplane

Strasser  Casablanca_1941 airport StrD - |
- - -
StrD: death
`
```


```js
notes = htl.html`<details><summary>How to read this Timeline diagram</summary>
${md`
## Timelines

> a Timelines diagram shows the chains of **events** in the lives of **entities** over **time**

For a detailed introduction see[the User Guide](https://observablehq.com/@bogo/timelines-user-guide).

*${this_particular_diagram}*

Colored lines represent so-called entities. An entity can be a person, a thing or any-thing that exists over time.

An entity's timeline chains one or more events in chronological order. Time flows bottom-up.

Each event can be shared by other entities. When people share an event, we can say that the meet or interact during this event.

### Interaction

Timeline diagrams are **interactive**. You can hover with your mouse cursor (on a pc) over any **_entity name_**, **_future arrow_**, **_connecting lines_** or some **_events_** (no mouse-click needed). Hovering will highlight exactly this one entity's timeline. The console box (usually at the lower left corner) will show the entity's name.

In addition, you can click on the active elements to make the highlight more permanent. This way, you can click on more than one entity and explore those events which are shared by these entities.

_Hovering is not available on touch devices (lacking a pointing device such as a mouse), but you can always click (brief touch) on those devices`}
</details>`
```

```js
diagram_full_story = dot2svg (  new StoryToDotRenderer( myStory )  )
```

⇧ above: unfiltered Timeline diagram

```js
bookmark_current = htl.html`<p><a class="screenonly" href="?details=${
selected_entities.join(',')
}&date_range=${
date_range.join(',')
}&only_shared_events=${
diagram_toggles.includes( only_shared_events )
}">bookmark current set of details</a></p>`
```

```js
viewof selected_entities = myStory.create_grouped_input()
```

```js
viewof type_buttons = myStory.create_type_buttons( viewof selected_entities, selected_entities, 9 )
```

```js
quick_select_buttons = Inputs.button
( 
  [
    [ "none", () => set_input_value( viewof selected_entities, [] ) ]
    ,
    [  "all", () => set_input_value( viewof selected_entities,  myStory.entity_keys ) ]
  ]
)
```

```js
create_button_to_apply_visible_entities_as_new_filter( viewof selected_entities, myReducedStory )
```

```js
create_button_to_apply_visible_entities_as_new_filter = (input, story) => Inputs.button( "apply visible entities as new filter", {reduce: () => set_input_value(input, story.visible_entity_keys) } )
```

```js
kts_console
```

```js
viewof date_range = create_daterange_input()
```

```js
viewof diagram_toggles = Inputs.checkbox
(
  [only_shared_events,highlight_all_timelines_of_event,show_future_faded], 
  {
    value: [show_future_faded].concat( get_initial_url_param( "only_shared_events", false )[0]==='true' ? [only_shared_events] : [] ) 
  } 
)
```

```js
diagram_reduced_story = dot2svg( reduced_story_dot_string )
```

```js
viewof project_lod = Inputs.radio(["title only", "full description"], {label: "level of detail", value: "title only"})
```

⇧ above: filtered Timeline Diagram

```js
flavour = myReducedStory.get_flavour()
```

⇩ below: tabular view of events, some of their details and related entities

```js
topics_count = md`showing ${ myReducedStory.n_topics } out of total ${ myStory.n_topics } topics`
```

```js
timeline_tabular = myReducedStory/*myStory*/.tabular_view( ["person","OU"] )
```

## Implementation

```js
reduced_story_dot_string = new StoryToDotRenderer( myReducedStory ).toString()
```

```js
diagram_styles = htl.html`<style>
${ diagram_toggles.includes(show_future_faded) ? ".type_future, ._future { opacity: 40% }" : "" }
</style>`
```

### Classes

```js
```

```js
class Arr
{
  static unique = (value, index, array) => array.indexOf(value) === index // one missing function from Array.prototype
}
```


```js
class EventFilter { } // abstract tagging base class
```

```js
class SharedEventFilter extends EventFilter
{
  diagram_toggles
  only_shared_events
  
  constructor( diagram_toggles, only_shared_events )
  {
    super();
    this.diagram_toggles    = diagram_toggles 
    this.only_shared_events = only_shared_events
  }

  filter = ( event, story ) =>
    !this.diagram_toggles.includes( this.only_shared_events )
    ||
    story.event_entity_map.get( event )
    &&
    story.event_entity_map.get( event ).size > 1
  
  static filter = ( event, story ) =>
    !diagram_toggles.includes( only_shared_events )
    ||
    story.event_entity_map.get( event )
    &&
    story.event_entity_map.get( event ).size > 1
}
```

```js
class DaterangeFilter extends EventFilter
{
  constructor( date_range )
  {
    super()

    this.date_range = date_range
  }
  filter( event, story )
  {
    return story.getEvent( event ).within( this?.date_range ?? date_range ) // NOTE: when the function "filter" is passed as an argument, then "this" is undefined. If called as a method on class DaterangeFilter, then "this" is bound and works as expected
  }
}
```

```js
function  create_daterange_input ( values_if_not_passed_in_url = ['',''] )
  {
    
  return Inputs.form
  (
    [
      create_date_text_input( "show events ranging from", values_if_not_passed_in_url, 0, myStory.get_date_labels()[0]     )
      ,
      create_date_text_input( "until",                    values_if_not_passed_in_url, 1, myStory.get_date_labels().pop()  )
    ],
    {
      template: inputs => htl.html`
        <details class="date_range screenonly">
          <summary>Date range filter</summary>
          <div>
            ${inputs[0]}
            &nbsp;
            ${inputs[1]}
          </div>
        </details>
        <style>
        
          details.date_range { max-width: 40% }
          
          details.date_range > div > form
          ,
          details.date_range > div > form > label
          { width: unset; max-width: unset; display: inline-block }
          
          details.date_range > div > form > div > input
          { width: 10em; max-width: 10em }
          
          details.date_range > div > form > div > input:invalid
          {background : lightpink }
          
        </style>
      `
    }
    // following references would cause a circular definition
  )

  /*static*/ function create_date_text_input( label, values_if_not_passed_in_url, index, placeholder = "YYYY-MM-DD" )
  { return  Inputs.text
    ( 
      {
        label:label,
        value: (get_initial_url_param('date_range') ?? [undefined,undefined])[index] ?? values_if_not_passed_in_url[index],
        maxlength:10,
        placeholder,
        pattern:"[0-9]{4}(-[01][0-9](-[0-3][0-9])?)?" 
      }
    )
  }
}
```

```js
class ReducedStory extends Story
{
  constructor( story, selected_entities, eventfilters = [] )
  {
    super( story, selected_entities )

    this.fullstory = story

    this.event_filters = eventfilters

    // now narrow the fields 
    this.entity_timelines = Object.fromEntries( this.entities_map.entries() ) // recreate the reduced timelines object
    this.calculate_entity_keys()
    this.harvest_story()  // depends on entity_keys, produces topics and events maps
    this.calculate_derived_fields( selected_entities )
  }
}
```

### Instances

```js
myReducedStory = new ReducedStory
(
  myStory, selected_entities 
)
  .addFilter(  new DaterangeFilter  ( date_range                          )  )
  .addFilter(  new SharedEventFilter( diagram_toggles, only_shared_events )  )
```

### (String) constants

```js
symbol_major_incident = '⚠️' // '💀' // '💥'
```

```js
only_shared_events = "only shared events"
```

```js
highlight_all_timelines_of_event = "highlight all timelines of event"
```

```js
show_future_faded = "fade future"
```

### functions

```js
/*static*/ function id_from_options_or_label( rdfLabel, options = {} )
{
    return options.id ?? rdfLabel.replaceAll( ' ',"" )
}
```

```js
/*static*/ datepart_from_event = event => event.split('_').slice(1).join('_')
```

```js
/*static*/ function has_date_part( event ) // datepart of event = all tokens starting at the 2nd, if any
{
  const tokenized_event = typeof event === "string" ? event.split('_') : event
  return ! isNaN(  Date.parse( tokenized_event.slice(1).join("-") )  ) // joining "-" for valid date format
}
```

## Exports

```js
/*
 * tag function,
 * turning the template literal into a KTS Timelines diagram
 * accepts a Timelines story
 */
function timelines( strings, ... keys )
{
  return dot2svg(   new StoryToDotRenderer(  strings.reduce( (a, c) => a + keys.shift() + c )  )   )
}
```

### with {...} (meant to be overridden in import)

```js
// shows up in the notes cell
this_particular_diagram = "This particular diagram has examples and testcases for the Timelines Library. Customize this italic paragraph in cell <code>this_particular_diagram</code>"
```

```js
// customization of the table view's headers
dictionary = 
{ return  { // this brace must be on same line as return statement !!
    "OU"    : "Organization"
    ,
    "begin" : "Start"
    ,
    "label" : "Place / Topic / Project"
  }
}
```

```js
entity_default_properties_by_type = new Map(
  [
    [  "replacement", { labelPrefix : "⚙" ,showExit : false  }  ]
    ,
    [  "dog"        , { labelPrefix : "🐕"                   }  ]
    ,
    [  "skill"      , { labelPrefix : "🔧" , edge : "style=dotted" }  ]
    ,
    [  "boat"       , { labelPrefix : "⛵" , edge : "style=dashed" }  ]
    ,
    [  "car"        , { labelPrefix : "🚗" , edge : "style=dashed" }  ]
    ,
    [  "education"  , { labelPrefix : "🎓"                         }  ]
    ,
    [  "school"     , { labelPrefix : "🏢"                         }  ]
    ,
    [  "OU"         , { labelPrefix : "🏢"                         }  ]
  ]
)
```

```js
diagram_options = 
{
  return {
    future_pointer_minlen: 1
    ,
    places_edge_style : "dotted"

    , entryArrowtail : "crow" // for a nicer distinction between the entity's name and its first event along the timeline
    
    //, entity_edge_style : "dashed"
    
    //, showExit : false // a river e.g. never extends beyond its estuary

    //, render_terminal_event_boxed : true
  }
}
```

```js
// e.g. for a CV: the "central entity" will not get listed in tabular views as a "related entity" because it is implicit 
central_entity = "Second_Owner"
```

```js
title_dot = "" // to be included near the top of DOT source - can be used to implement a title or supplementary graphics
```

## Imports


```js
import { get_initial_url_param, get_initial_details, digraph2svg, dot2svg, kts_console, visco, init, set_input_value}
with {selected_entities, hpcc_js_wasm_version}
from "@bogo/kxfm"
```
