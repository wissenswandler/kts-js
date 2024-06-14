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
toc({
  headers: "h2,h3",
})
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

## Story Definition

```js
// main (and the only mandatory) definition of this diagram's story
myStory = new Story( `

#
# Usecase 1: simple case of a linear timeline
#

Linear_Entity EventA EventB - UseCase

#
# Usecase 2: time-anchored timeline: events are written in <topic>_<date> syntax
#

Historic_Entity Event1990_1990 Event2000_2000 Event2020May_2020_05 Event2030_2030 Beyond2030 - UseCase

Future_Entity goal Event2050_2050-05 - UseCase

#
# Usecase 3: recurring visitor: if the same topic is referenced more than once, then a (dotted) line will be drawn between those references
#

Recurring_Visitor FavouritePlace FavouritePlace_a FavouritePlace_b - UseCase

#
# Usecase 4: Two Timelines merging (and branching) at a common event 
#

Partner_A BothMeet2000_2000 - UseCase

Partner_B BothMeet2000_2000 - UseCase

#
# Edge Case: Entity without Events, shall be shown as a single entity box;
#
# Note: this does not make much sense in a proper Timeline diagram
# but could be a transitional state while you are writing a Timeline story and introduce a new Entity
# 

Boring_Entity - UseCase

#
# Special Case: duplicate entity names receive distinct internal keys
#

Same_Name some - 
rdfType: UseCase,
labelPrefix: =,
rdfDescription:  first entity by the name Same_Name

Same_Name some - 
rdfType: UseCase,
labelPrefix: =,
rdfDescription: second entity by the name Same_Name 
which is assigned a different ID internally

Same_Name some - 
rdfType: UseCase,
labelPrefix: =,
rdfDescription: third entity by the name Same_Name 

#
# Difficult_attributes (commented out for brevity)
#
# Difficult_attributes EventWithDash EventWithQuotes

#
# Syntax Error catches
#

ErrorEntity - a: b c: d

#
# testing different RDF types (commented out for brevity)
#

# aReplacement - replacement
# anEducation - edu
# aSchool - school

#
# Story Demo: short boat story, combining most of the features above
#

Shipyard Construction_1990 Construction_1991 MaidenVoyage - OU

Agency                                                               Transfer_2000 - OU

Boat     Construction_1990 Construction_1991 MaidenVoyage Daysailing Transfer_2000 AtlanticCrossing - boat

First_Owner  FOborn_1960_12                  MaidenVoyage Daysailing Transfer_2000                  - person

Second_Owner SOborn_1970                           Transfer_2000 AtlanticCrossing - person

Dog          DogBorn_2015                                        AtlanticCrossing - dog

sailing lessons MaidenVoyage Daysailing AtlanticCrossing - skill

carpentry Construction_1990 Construction_1991 - skill

- - - Timelines above / Event details below

FOborn_1960: '*'
SOborn_1970: '*'
DogBorn_2015: '*'

Transfer_2000:
 graphvizLabel: Sale/Purchase

EventWithDash:
 rdfLabel: with-Dash
 htmlTooltip: with-Dash

EventWithQuotes:
 rdfLabel: with"Quote

MaidenVoyage: Maiden Voyage

Construction_1990:
- =
- |
  of the boat
  which can have multiple lines

  or paragraphs of description
Construction_1991: finish

` )
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

```js echo
maximap = render_maximap_div()
```

### Classes

```js
/*
 * create an instance from a story, then typecast to String or call toString() directly 
 */
class StoryToDotRenderer extends DotRenderer
{
  story
  
  constructor( story )
  {
    super()
    switch( typeof story )
    {
      case 'object':
        this.story = story
        break;
      case 'string':
        this.story = new Story( story )
        break;
      default:
        throw(  new Error( "invalid datatype of story" )  )
    }     
  }

/*
 * render Gryphviz code suitable for "DOT"
 */
toString()
{ return this.story.eventsArray.length === 0 
  ? 
  `graph <empty> {e [fontsize=20 label="story is empty - filters too narrow?"]  }` 
  : 
  `
digraph <Timelines> {

ranksep=0.1
nodesep=0.2
node [shape=none tooltip=""]

${ title_dot }

#
# Events (Time+Space intersections) with labels (other than their ID) or tooltips
#
${ this.render_event_details() }

#
# Timelines from here
#

edge [color=grey]       # default edge color grey to recognize all which are not styled explicitly
edge [arrowhead=none]   # timelines have not arrowhead in all of their sections, except for the very last one (pointing to the future)

#
# topics timelines must appear before PEOPLEs' timelines,
# so that first appearance (event) of a place can serve as its type anchor;
# events are disjunct by definition, because topics can never "meet" each other
#
{ edge [ style=${ diagram_options?.places_edge_style ?? `""` } ]

${ this.render_topics() }

} # end topics


#
# entities (people / beings / things) : typically solid lines; 
# events may be shared because entities can meet/touch each other at the same place (or topic) + time
#
{ edge [ style=${ diagram_options?.entity_edge_style ? diagram_options?.entity_edge_style : `""` } ]

${ this.render_entities() }

}

${ this.render_timescale()    }
${ this.render_time_anchors() }

}`
}
  
// render details for all occuring events (after applying entity filter)
render_event_details()
{
  let result = ""
  
  this.story.eventsArray.forEach
  ( event => 
    {
      const k = event.key
      const event_json = this.story.events_json[k] // which is optional

      // properties of this event node will be either created from scratch, or extend the explicit event definition 
      const properties = event_json  ?  this.constructor.translate_nodeValues_to_dotValues( event_json )  :  new Map()
      
      const entities = Array.from( this.story.event_entity_map.get(k) ) // all entities which share this event - guaranteed to be at least one

      const classlist = new Array();
      if
      (
        diagram_toggles.includes( highlight_all_timelines_of_event )
        ||
        entities.length === 1
      )
      {
        entities.forEach(  ent => classlist.push( "global_type_" + ent )  );
      }

      if( event.date )
        classlist.push(  "type_date_" + event.datish  )
      
      if( event.isFuture ) // event can be known to occur in the future even without a date, but via certain_date_range
        classlist.push( "_future" )
      
      if( classlist.length > 0 )
        properties.set( "class", classlist.join(' ')  );
      
      if(   (  event.datish || properties.size === 0  ) && !properties.has( "label" )   )
        properties.set( "label", event.topic ); // present event by its topic name

      if( Array.from( properties.keys() ).length )
      {
        result += `
<${k}> [`;
        properties.forEach( (v,p) => result += `${p}="${ DotRenderer.to_dot_label_raw( v )}" ` );
        result += `]`;
      }
    }   // end foreach function
  )     // end foreach
  return result;
}

render_topics()
{
  let result = `
#
# Topics
#
`;
  this.story.topic_events_map.forEach
  ( (event_map, topic) => 
    {
      const sorted_events = Array.from( event_map )
        .filter( (e) => this.story.is_event_visible( e ) )
        .sort   // event keys shall be sorted according to their events' sort order, which takes into account the approximate date!
        ( (a,b) => 
          this.story.getEvent(a).toString().localeCompare(
          this.story.getEvent(b).toString()               )
        )
      if( sorted_events.length > 1 )
          result += this.render_timeline( topic, sorted_events, {showExit:false, showEntry:false} );
    }
  );
  return result;
}
  
  render_entities()
  {
    return this.story.entity_keys.reduce
      ( (a,c) => 
        a 
        +
        this.render_timeline( c, this.story.entity_timelines, diagram_options ) 
        , "" 
      )
  }
  
  /*
   * renders timescale as a vertical stack of Date values;
   *
   * not possible to pack these Dates in a cluster, 
   * because they are also members of the time_anchor subgraphs 
   * which prevents other subgraph memberships
   *
   * note that we create SVG elements with IDs that are not valids CSS identifiers,
   * so they cannot be found using CSS selectors, for the sake if IDs which are valid time values
   * so that the copied (yanked) IDs can be used as date filters right away (tough choice)
   */
  render_timescale()
  {
    const sorted_dates = this.story.get_date_labels()
    
    if(   sorted_dates.length === 0 ) return "";
    
    let result = `
#
# Time
#
{
  time_entity [label=Time style=rounded shape=box color=lightgrey fontcolor=lightgrey]

  edge [color=lightgrey arrowhead=none]
  node [fontsize=10]

  `;
  let prev = "";
  
  sorted_dates.forEach
  ( date =>
    {
      const datevalue = new Date(date)
      const tokens = date.split('-');
      switch( tokens.length ) // on which level of calendar precision are we?
      {
        case 1: // YEAR
          result += `
  <${date}> [class="type_date_${date}${ datevalue > Date.now() ? ' _future' : '' }" label="${tokens[0]}" fontsize=16]`
          break;
        case 2: // MM
          result += `
  <${date}> [class="type_date_${date}${ datevalue > Date.now() ? ' _future' : '' }" label=${ datevalue.toLocaleString('default', { month: 'short' }) }]`
        break;
        case 3: // DD
          result += `
  <${date}> [class="type_date_${date}${ datevalue > Date.now() ? ' _future' : '' }" label="${tokens[2]}"]`
          break;
      }
      
      prev = date;
    } 
  );
  
  result += `

  time_entity -> <`
  + 
    sorted_dates.join( ">-><");
  
  result += `>
  node [style=invis height=0 fixedsize=true]
  edge [class=_future id="time_future_arrow" arrowhead="" minlen=2] <${sorted_dates[sorted_dates.length-1]}> -> time_entity_future
}
`;
    // following DOT source would add another node on top of the timescale
    // which I rather remove for brevity
    // time_entity_future [shape=none id=time_entity_future label=" " class=_future]
    
    return result;
  }
   
  render_time_anchors()
  {    
    return this.story.get_date_labels().reduce
    ( (result, d) =>
       result += `
    {rank=same <${d}> ${ 
        [...this.story.events.values()]
          .filter( e => this.story.is_event_visible( e.key ) )
          .filter( e => e.datish === d )
          .map( e => `<${e.key}>` ).join(' ')
} } `
      ,
      "" // accumulator
    )
  } 

  /*
   * abstraction for rendering either an entity's timeline, or a topic's
   */
  render_timeline( rdfLabel_or_id, events_or_timelines_object, options = {} )
  {
    let events;
    let timelines;
    if( Array.isArray( events_or_timelines_object ) )
      events = events_or_timelines_object;
    else
      timelines = events_or_timelines_object;
    
    let rdfLabel
    let color=""
    const structured_timeline = timelines ? timelines[rdfLabel_or_id] : false;
    if( structured_timeline ) // entity timelines
    {
      const index = Object.keys(timelines).indexOf( rdfLabel_or_id );
      
      if( structured_timeline.options ) options = structured_timeline.options;
      options.id = rdfLabel_or_id;
  
      if( Array.isArray( structured_timeline ) )
        events = structured_timeline;
      else
        events = structured_timeline.events;
      
      rdfLabel = structured_timeline?.options?.rdfLabel ? structured_timeline?.options?.rdfLabel : options.id;
  
      color = options.color ?? ""
      let edge_option = options.edge ?? "";
      if(  ! edge_option.includes( "color=" )  )   options.edge = `${ edge_option } color="${ color }"`
    }
    else // topic timelines
    {
      rdfLabel = rdfLabel_or_id;
    }
  
    const filtered_events = events.filter(  e => this.story.is_event_visible( e )  )
  
    if( filtered_events.length === 0 && events.length > 0 ) return "" // if the number of events shrank to zero due to filtering: dont show the entity at all / but if the entity's event count has been zero before filtering, then it was the author's intention to show the entity
  
    events = filtered_events
      
    const id      = id_from_options_or_label( rdfLabel, options );
    
    const minlen   = options.minlen      ?? 2;
    const dotLabel = options.labelPrefix ?  options.labelPrefix + ' ' + rdfLabel : rdfLabel;
    const shape    = options.shape       ?? options.labelPrefix ? "none" : "box";
    const endNode  = options.endNode     ?? id + "_future";
    const showEntry= options.showEntry   ?? diagram_options.showEntry ?? true;
    const showExit = options.showExit    ?? diagram_options.showExit  ?? events.length > 0; // don't show future-arrow for entities without events

    const color_clause = color ? ` color="${ color }"` : ""
    
    return `
  { node [ class=global_type_${id} ${ options.node ?? "" } ]
    edge [ class=global_type_${id} ${ options.edge ?? "" } tooltip="${dotLabel}" ]
    ${ events.length && diagram_options.render_terminal_event_boxed ? ` <${ events[ events.length-1 ] }> [shape=box${ color_clause }]` : "" }
    ${ render_entrynode() } <${ events.join(">-><") }> ${ render_exitnode() }
  }
  `; // end return expression
  
    function render_entrynode()
    {
      return showEntry ?
    `<${id}> [${ id != dotLabel ? `label="${ dotLabel }" `:""}${ options.rdfDescription ? `tooltip="${ options.rdfDescription }" ` : "" }shape=${ shape }${ color_clause }] ` + connect_entrynode_with_first_event()
    : "" 
    }
    function connect_entrynode_with_first_event() { return events.length > 0 ? `<${id}> -> <${events[0]}> [penwidth=1${ diagram_options.entryArrowtail ? ` arrowtail=${ diagram_options.entryArrowtail }` : ""}] ` : "" }
  
    function render_exitnode()
    {
      return showExit ? `    
    node [ ${ diagram_options.repeat_entity_in_future ? `shape=box${ color_clause } label=${ dotLabel }` : "style=invis height=0 width=0 fixedsize=true" }]
    edge [class="global_type_${id} _future" arrowhead=""${diagram_options?.future_pointer_minlen != 1 ? " minlen="+diagram_options?.future_pointer_minlen : ""}] <${ events[events.length-1] }>-><${endNode}>` : ""
    }
  } // end render_timeline

  
}
```

```js
class DotRenderer
{
  
  static to_dot_label_raw = value => 
  {
    return value === null ? "" :
    typeof( value ) === 'string' 
    ?
    value
      ?.replace(/(?:\r\n|\r|\n)/g, '\\n')
       .replace(/"/g, '\\"') 
      ?? ""
    :
    value+"" // undefined.toString() causes an error
  }
  
  static translate_nodeValues_to_dotValues( node_o )
  {
    const view_summary = project_lod == "title only"; // dependency on a global switch !
    
    const labelAndDescription = 
      node_o.rdfDescription ?
      `${node_o.rdfLabel}: ${node_o.rdfDescription}`
      :
      node_o.rdfLabel
  
    const result = new Map( Object.entries( node_o ) )

    if( node_o.rdfLabel )
    if( view_summary )
    {
      // event.isExpanded    = false // TODO: finish turning this flag into a CSS class
      result.set( "graphvizLabel", node_o.rdfLabel )
      
      if( node_o.rdfDescription )
      result.set( "htmlTooltip",  labelAndDescription )
    }
    else 
    {
      //event.isExpanded    = true // TODO: finish turning this flag into a CSS class
      result.set( "graphvizLabel", labelAndDescription )
      result.set( "htmlTooltip",   " " ) // we don't want a tooltip because the description is already rendered as label
    }

    if( node_o.rdfLabel )
    result.set
    ( "graphvizShape",
      node_o.rdfLabel[0].search(/[a-zA-Z0-9]/) // if label begins with non-alpha character (an icon) then don't use boxed shape 
      ?
      "none" 
      :
        node_o.rdfDescription
        ?
        "note"
        :
        "none"  // if there is NO rdfDescription then we don't render the event with the visually heavier box because the event won't expand to a larger box in "details" mode
    )
    
    remap( "rdfLabel",      "label"   ) // generic label (typically short)
    remap( "graphvizLabel", "label"   ) // specific graphviz label - could be long if 'expanded'; overwrites "rdfLable"
    
    remap( "graphvizShape", "shape"   )
    
    remap( "rdfDescription","tooltip" ) // generic tooltip from description (if any)
    remap( "htmlTooltip"  , "tooltip" ) // an explicit tooltip, e.g. constructed through expansion
    
    return result
  
    function remap(from_name, to_name)
    {
      if( result.has( from_name ) )
          result.set(   to_name ,
          result.get( from_name )
         )
    }
  }

}
```

```js
// various generic utilities around Strings without technical dependencies
class Text
{
  static trim_line = string => string.trim().replace(/\s+/g, ' ')
  
  static truncate = (string, length = 12) => (""+string).length < length+4 ? (""+string) : (""+string).slice(0, length) + '…' 
  
  static capitalizeString = str => (""+str).charAt(0).toUpperCase() + (""+str).slice(1)
  
  /* translate e.g. (technical) type names into (business) role names if that is easier for the reader to comprehend */
  static translate = (name, fallback) => dictionary[name] ?? fallback ?? Text.capitalizeString( name )
}
```

```js
class Arr
{
  static unique = (value, index, array) => array.indexOf(value) === index // one missing function from Array.prototype
}
```

```js
class Story extends EventArena
{
  // full set of all timelines 
  // never filtered in base class and always constant
  // entries are parsed from "story" text in parse_timeline()
  entity_timelines = {}
  
  events_json // assigned in constructor, parsed in split_story
  
  topic_events_map // assigned in harvest_story
  event_entity_map // assigned in harvest_story 

  event_filters = []

  event_filter_objects = []
  
  static story_delimiter = /- - -.*/
  
  static color_12_paired = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928']
  static color_12_set3 = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f']
  static color_12_set3_minus_yellow = [
'#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f',
'#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462',
] // found yellow too hard to read on most screens, and changed the order so that it starts with bright green
  
  static color_palette = this.color_12_set3_minus_yellow;
  

constructor( story_text_or_object, selected_entities_or_everything_flag = true )
{
  super()
  
  switch( typeof story_text_or_object )
  {
    case 'string': // initial constructor, reading story via text
      
      this.fullstory = this
  
      const story_text = story_text_or_object
      const story_parts = this.constructor.split_story( story_text )
      this.events_json = story_parts[1]
    
      story_parts[0].split("\n").forEach( l => this.parse_timeline( l ) )
      this.calculate_entity_keys()
      
      this.harvest_story()  // depends on entity_keys, produces topics and events maps

      this.calculate_undated_event_certain_ranges() // perform calculation in base story, because we want the known date range taken from all known entity lines - not only from the reduced set for display
      
      break;
    case 'object': // "copy constructor"
      this.events           = story_text_or_object.events
      this.events_json      = story_text_or_object.events_json
      this.entity_timelines = story_text_or_object.entity_timelines
      this.calculate_entity_keys()
      this.topic_events_map = story_text_or_object.topic_events_map
      this.event_entity_map = story_text_or_object.event_entity_map
      break;
    default:
      throw( new Error( "invalid argument type" ) )
      break;
  }

  this.calculate_derived_fields( selected_entities_or_everything_flag )
    
  this.all_topics_details = Array.from
  (
    this.topic_events_map.keys() 
  ).map
  ( 
    topic => this.get_topic_details( topic ) 
  )

  this.all_topicdetails_keys = new Set
  (
    this.all_topics_details.reduce
    ( 
      (acc, topicdetails) => 
       acc.concat(  [...topicdetails.keys() ] )
      , 
      [] 
    )  
  )   
}

addFilter = (filter_object) => { this.event_filter_objects.push( filter_object ); return this }

  
 /*
  * get this story's visible events
  * (note that a reduced story still knows about all events 
  */
get eventsArray()
{
  return [... this.events.values()].filter(  e => this.is_event_visible( e.key )  )
}

// keys of all entities in this story, filtered or not
calculate_entity_keys() { this.entity_keys = Object.keys( this.entity_timelines ) }

 /*
  * return an array of keys of currently visible entities,
  * i.e. those who share a currently visible event
  */
get visible_entity_keys()
{
  return this.eventsArray
  .map( e => [... this.event_entity_map.get( e.key )] )
  .flat()
  .filter( Arr.unique )
  .sort()
}
  
get_flavour( type = "skill" )
{
  const flavours = this.visible_entity_keys.filter( e => this.type_of( e ) == type )
  switch( flavours.length )
  {
    case 1:
      return ", flavour: " + flavours[0]

    case 2:
    case 3:
      return ", featuring " + flavours.join( " + " ) + (type === 'person' ? "" : " " + type + 's')
      
    default:
      return  "" // which joins with comma
  }
}
  
calculate_derived_fields( selected_entities_or_everything_flag ) 
{
  this.all_entity_types = [... new Set(   this.entity_keys.map(  e => this.type_of( e )  )   ) ]
  
  this.selected_entity_keys =
    selected_entities_or_everything_flag === true 
    ? 
    this.entity_keys // by default (in base Story): all entities are 'selected'
    :
    selected_entities_or_everything_flag // must be an array of entity keys
  
  this.n_topics = [...this.topic_events_map.keys()].length
  
  this.entities_map = new Map
  (
    Object.entries( this.entity_timelines ).filter
    ( e => 
      this.selected_entity_keys.includes( e[0] ) 
    ) 
  )
}  

keep_types = type_array => this.constructor.filter_types( type_array, this.entity_timelines, true  )
hide_types = type_array => this.constructor.filter_types( type_array, this.entity_timelines, false )
  
type_of = ( entity ) => this.entity_timelines[entity]?.options?.rdfType

 /*
  * return a Set of all visible "date labels" (as used in the time scale);
  * each date on an event can produce 1, 2 or 3 "date labels", depending on the date's precision:
  * 1. year only 2. year + month 3. year + month + day 
  */
get_date_labels()
{
  const SEPARATOR = "-"
  
  let result = []
  
  this.eventsArray.forEach
  (
    event => 
    {
      if( event.date ) 
      {
        let tokens = event.datish
        do 
        {
          result.push( tokens )
          if( tokens.includes(                               SEPARATOR )  ) // String.slice would otherwise continue slicing the YEAR part
              tokens = tokens.slice(  0, tokens.lastIndexOf( SEPARATOR )  )
          else
              tokens = ""
        }
        while( tokens )
      }
    }
  )
  return result.filter( Arr.unique ).sort()
}
  
static split_story = text =>
{
  // split the text at a delimiter line that starts with "- - -" and return an array of two elements:
  //
  // first array element is the text before the delimiter line (or the full text in absence of delimiter)
  // second array element is a JSON object, parsed as YAML from the text after the delimiter line
  // the delimiter line is not returned

  const split = text.split( this.story_delimiter )

  return [
    transform_paragraphs_to_lines( split[0] )
    ,
    Object.fromEntries
    (
      Object
        .entries(  yaml`${ split[1] }`  )
        .map
        ( ( [ k,                     v  ] ) =>
            [ k, this.substitute( k, v )] 
        )
    )
  ]

  /*
   * transform "multi-line timeline syntax" (a) into "single-line timeline syntax" (b), where in...
   * (a) each Timeline can be written as consecutive lines; 2 or more consecutive linebreaks separate Timelines
   * (b) each Timeline must be written in a single line; Timelines are separated by 1 or more linebreaks
   */
  /*static*/ function transform_paragraphs_to_lines(text) 
  {
    return text
   .split("\n\n")
   .map( block => block.split("\n").map( l => Text.trim_line(l) ).map(  l => l.startsWith('#') ? "" : l ).join(' ')  )
   .join("\n\n")
  }
} // end split_story

// harvesting Maps of Events and Topics from structured timelines
harvest_story()
{
  const topics = new Map();
  const u_event_entity_map = new Map();

  this.entity_keys.forEach(  c => this.harvest_timeline( c, this.entity_timelines, topics, u_event_entity_map )  )
  this.topic_events_map = new Map
  (
    Array.from
    (
      topics.entries() 
    ).sort
    (
      (a, b) => 
      {
        const e_a = a[1].entries().next().value[0]
        const e_b = b[1].entries().next().value[0]
        
        if( e_a.split('_').length>0
            &&
            e_b.split('_').length>0 )
          return  datepart_from_event( e_b ).localeCompare( 
                  datepart_from_event( e_a )  
          )
        else if( this.common_entities( e_a, e_b ).length > 0 )
        {
          const common_e = this.common_entities( e_a, e_b )[0]
          return  this.entity_timelines[ common_e ].events.indexOf( e_b )
                  -
                  this.entity_timelines[ common_e ].events.indexOf( e_a )
        }
        else if( has_date_part(e_a) ) // and not e_b per previous test
          return -1
        else if( has_date_part(e_b) ) // and not e_a per previous tests
          return +1
        
        return 0;
      }
    )  
  )
  this.event_entity_map  = new Map
  (
    Array.from
    (
      u_event_entity_map.entries() 
    ).sort
    (
      // this would be easier if we had the actual event-object as key in the map
      (a, b) => this.getEvent( a[0] ).toString().localeCompare(  this.getEvent( b[0] ).toString()  )
    )  
  ) 
}

/* harvest information about (shared) events and topics by parsing timeline by timeline */
harvest_timeline( id, timelines, topics, event_entity_map )
{
  const structured_timeline = timelines[ id ]
  
  const 
  options = structured_timeline.options ?? {}
  options.id = id;

  const rdfLabel = options.rdfLabel ?? options.id;

  if(  ! (options.edge ?? "").includes( "color=" )  )   
  {
    options.color = this.constructor.color_palette
                      [
                        Object.keys(timelines).indexOf( id )
                        %
                        this.constructor.color_palette.length 
                      ]
  }
    
  structured_timeline.events.forEach( e => this.parse_event( e, id, topics, event_entity_map ) )
} // end harvest_timeline

// harvest information about event into "events", "topics..." and "...entities" maps
parse_event( event, entity, topics, event_entity_map )
{
  let entities_for_event = event_entity_map.get( event );
  if( entities_for_event )
    entities_for_event.add( entity );
  else
    entities_for_event = new Set( [entity] )

  event_entity_map.set( event, entities_for_event )
  
  const event_o = this.addEvent( event )

  let events_for_topic = topics.get( event_o.topic );
  if( events_for_topic )
      events_for_topic.add( event );
  else
    events_for_topic = new Set( [event] )
  
  topics.set( event_o.topic, events_for_topic );
}

first_notice_of = entity => this.entity_timelines[entity].events[0].split('_').slice(1) // return the split datepart of the first event in the given entity's timeline

 /*
  * TODO: add transitive steps to calculate additional certain_ranges from previously inferred certain_ranges
  */
calculate_undated_event_certain_ranges = () =>
[ ...this.events.values() ].filter( e => !e.date ).map( e => e.key ).map
( eventkey => 
  {
    return {
      eventkey, 
      range:  [ ...this.event_entity_map.get(eventkey).values() ]
              .map
              ( entkey =>
                {
                  const lineevents = this.entity_timelines[ entkey ].events 
                  const index = lineevents.indexOf( eventkey ) // position of undated event within line
                  return [
                    // events  before,                                              with date, last of them
                    lineevents.slice( 0, index ).map( ek => this.addEvent( ek ).date ).filter(e=>e).pop()    
                    ,
                    lineevents.slice( 1+ index ).map( ek => this.addEvent( ek ).date ).filter(e=>e).shift()  
                    // events  after,                                                 with date, first of them
                  ]
                }
              )
              .reduce
              ( (a, bao) => 
                [ 
                  a[0] == undefined ? bao[0] : ( a[0] < bao[0] ? bao[0] : a[0] ) // find greatest "before" date
                  ,
                  a[1] == undefined ? bao[1] : ( bao[1] < a[1] ? bao[1] : a[1] ) // find smallest "after" date
                ]
                ,
                [ undefined, undefined ]
              )
    } 
  } 
)
.forEach
( o =>
  this.addEvent( o.eventkey ).certain_date_range = o.range
)

  
event_details_map()
{
  return new Map
  (
    Object.entries( this.events_json ).map(
      ( [key, value] ) => [ key, dot_from_event_json( value )  ]
    )
  )

  /*static*/ function dot_from_event_json(value)
  { return '['
  + dotFromEntryIfExists( value, "graphvizLabel", "label"   )
  + dotFromEntryIfExists( value, "graphvizShape", "shape"   )
  + dotFromEntryIfExists( value, "cssClasslist" , "class"   )
  + dotFromEntryIfExists( value, "htmlTooltip"  , "tooltip" )
  + ']'
  
  /*static*/ function dotFromEntryIfExists( json, jsonName, graphvizName )
  {  return json[ jsonName ] ? `${graphvizName}="${  json[ jsonName ]  }" ` : "" }  }
  
} // end event_details_map

// event must pass through all installed event filters to appear as visible
is_event_visible( event ) 
{
  return this.event_entity_map.get( event ) // implicit filter - an entity-reduced story still knows all events in the events set (for the purpose of context, like limiting the certain date range)
    &&
    this.event_filters.reduce       ( (a,f) => a && f       ( event, this ), true )
    &&
    this.event_filter_objects.reduce( (a,f) => a && f.filter( event, this ), true )
}

get_topic_details( topic )
{
  // making the inner function available for unit testing
  this.get_topic_details.group_entities_by_type = group_entities_by_type

  if( !arguments.length ) return // this call was just to initialize above assignment
  
  const      events_for_topic = [ ... this.topic_events_map.get(topic).values() ]
  const e1 = events_for_topic[0]
  const e1_o = this.getEvent( e1 )
  const e2 = events_for_topic.slice(-1)[0]
  const e2_o = this.getEvent( e2 )
  
  const result = new Map(   Object.entries(  this.events_json[ e1 ] ?? {}  )   )
  
  const d1 = 
    e1_o.date?.getFullYear()  // Integer
  ?? 
    e1_o.certain_date_range[0]?.getFullYear() // Integer  
  ?? 
    ""  // String
  result.set( "begin", d1 )

  const d2 = 
    e2_o.date?.getFullYear()  // Integer
  ?? 
    e2_o.certain_date_range[1]?.getFullYear() // Integer  
  ?? 
    ""  // String

  if (d2 > d1)
    result.set( "end", `→ ${d2}` )

  const other_entities_for_event = this.constructor.find_entities_by_event( e1, this.entity_timelines, central_entity ); 

  const org_un = filter_entities_by_type( "OU",    other_entities_for_event, this.entity_timelines )
  const school = filter_entities_by_type( "school",other_entities_for_event, this.entity_timelines )
  
  const related_entities_by_type = group_entities_by_type( other_entities_for_event, this.entity_timelines )

  let description
  let label = topic
  if(  this.events_json[ e1 ]  )
  {
    description = this.events_json[ e1 ].rdfDescription
    
    label       = this.events_json[ e1 ].rdfLabel 
                  ?? 
                  this.events_json[ e1 ].graphvizLabel 
                  ??
                  this.events_json[ e1 ].label
                  ??
                  topic
  }
  result.set( "label", label )

  if( description )
  result.set( "description", description.split( "\n\n" )  )

  const client = org_un.concat( school ).map
  ( e => 
    this.entity_timelines[e].options.rdfLabel ?? e
  )
  if( client.length ) result.set( "client", client )

  related_entities_by_type.forEach
  ( (entities, type) => 
    set_map_if_related_entities_of_type( result, type , related_entities_by_type )
  )
  return result 
  
  /*static*/ function filter_entities_by_type( type, candidates_array, all_entities )
  {
    return candidates_array.filter
    ( key => all_entities[key].options.rdfType == type )
  }
  
  /*static*/ function set_map_if_related_entities_of_type( map, type, related_entities_by_type )
  {
    const related_entities = related_entities_by_type.get( type )
    if( related_entities ) map.set(  type, related_entities.join(", ")  )
  }

  /*static*/ function group_entities_by_type(candidates_array, all_entities) 
  {
    return candidates_array.reduce
    ( (map, candidate) => {
      const    key = all_entities[candidate].options.rdfType;
      map.has( key ) 
        ?
      map.get( key ).push( candidate  ) 
        : 
      map.set( key ,      [candidate] );
      return map;
    }, new Map());
  }
  
} // end get_topic_details

//
// UI component creators
//
  
create_grouped_input( label = htl.html`select<span class="printonly">ed</span> elements, grouped by type`, values_if_not_passed_in_url )
{
  const groups = new Set;
  const format = (d) => 
  {
    const group = d[1].options.rdfType
    const name =  d[0]
    const label = html`<span>${name}`;
    (groups[group] || (groups[group] = [])).push(label);
    return label;
  };

  function create_input( subjects, defaults = Object.keys(subjects) )
  {
    return Inputs.checkbox
    (
      Object.entries( subjects), 
      {
        value: get_initial_details( defaults )
        ,
        valueof: ([a]) => a 
        ,
        format
      }
    )
  }  
  
  const input = create_input( this.entity_timelines, values_if_not_passed_in_url )
  const parent = input.lastElementChild;
  const scope = DOM.uid().id;
  input.classList.add(`${scope}-input`);
  const style = html`<style>
.${scope}-head {
  font:13px/1.2 var(--sans-serif);
  margin-bottom: 1em;
  display: block;
}
.${scope}-body {
  padding-left: 1em;
}
.${scope}-input {
  max-width: none;
}
.${scope}-group {
  display: flex;
}
.${scope}-group > strong {
  display: block;
  padding-bottom: .5em;
  width: 9ch;
  flex-shrink: 0;
}
.${scope}-group + .${scope}-group {
  border-top: 1px solid #eee;
  margin-top: 5px;
  padding-top: 5px;
}
.${scope}-group label {
  margin-bottom: .5em;
}
`;

  for( const [name, nodes] of Object.entries(groups) )
  {
    const wrap = html`<div>`;
    wrap.append( ...nodes.map( (n) => n.parentElement) );
    const g = html`<div class="${scope}-group type_${name}">`
    g.append( html`<span class="screenonly">show&nbsp;</span>${ (Object.entries(groups).length>1) && (name != 'undefined') ? `<strong>${ Text.translate( name ) }</strong>&nbsp;` : '' }` )
    //g.append( Inputs.button("+") ) // can't get this button to set the inputvalue of surrounding cell because of circular definition by Observable means -- also can't manipulate via HTML DOM ('checked' attribute) because d3 does not reflext such a change in the value of the input: value remains unchanged even with checkbox being visibly checked or unchecked
    g.append( wrap )
    parent.appendChild(g);
  }
  
  const widget = html`<div>
    <span class="${scope}-head">${label}</span>
    <div class="${scope}-body">${input}</div>
    ${style}
  `;
  return Object.defineProperty(widget, "value", {
    get: () => input.value,
    set: (v) => {
      input.value = v;
    }
  });
} // end of create_grouped_input

create_type_buttons = (view, model, string_truncate_length = 3) =>
Inputs.button
(
  this.all_entity_types.reduce
  ( (acc, type) =>
    acc.concat
    (
    [
    [ html`<a title="no ${ Text.translate( type )}">- ${Text.truncate(Text.translate( type ),string_truncate_length)}</a>`, () => 
      set_input_value( view, model.filter( x => ! this.keep_types( ""+type ).includes(x) )  )  // ""+type casts "undefined" to String
    ],
    [ html`<a title="no ${ Text.translate( type )}">+ ${Text.truncate(Text.translate( type ),string_truncate_length)}</a>`, () => 
      set_input_value( view, model.concat(        this.keep_types( ""+type )             )  ) 
    ]
    ] 
    )
    ,
    []  // accumulator
  )
)
  
tabular_view = ( column_names = [], title_names = [] ) => {
  return d3.create('table').attr( "style", "max-width:100%" ).classed( "timeline_tabular_view", true )
    .call(table => {
      table.append('thead').append('tr').classed('header', true).call(headerline => {
        if( column_names[0] )
          headerline.append('th').text( title_names[0] ?? Text.translate(column_names[0]) )

        if( this.all_topicdetails_keys.has( "begin" ) )
          headerline.append('th').text(  Text.translate( "begin" )  )
        
        if( this.all_topicdetails_keys.has( "end" ) )
          headerline.append('th').text('End').style( 'text-align','right')
        
          headerline.append('th').text(  Text.translate( "label" )  )
        
        if( this.all_topicdetails_keys.has( "description" ) )
          headerline.append('th').text('Description').style("width","70%")
        
        if( column_names[1] )
          headerline.append('th').text( title_names[1] ?? Text.translate(column_names.slice(-1)[0]) )
      })
    }) // end header
    
    .call(table => {
    table.append('tbody')
    
    .selectAll('tr')
    .data
    (
      Array.from
      (
        this.topic_events_map.entries() 
      )
      .filter(  ([topic,events]) => this.is_event_visible( [... events.values()][0] )  )
      .map
      ( 
        ([topic, events]) => this.fullstory.get_topic_details( topic ) 
      )
    )
    .join('tr')
    .call(line => {
      
      if( column_names[0] )
      line
        .append('td')
        .text(  topic => topic.get( column_names[0] ) )

      if( this.all_topicdetails_keys.has( "begin" ) )
      line
        .append('td')
        .text( topic => topic.get("begin") ) 

      if( this.all_topicdetails_keys.has( "end" ) )
      line
        .append('td')
        .text( topic => topic.get( "end" )  )

      line
        .append('td')
        .append('b')
        .text( topic => topic.get( "label" ) )

      if( this.all_topicdetails_keys.has( "description" ) )
      line
        .append('td')
        .selectAll('p')
        .data( topic => topic.get( "description" ) ?? [] )
        .join('p')
        .text(description => description)
      
      if( column_names[1] )
      line
        .append('td')
        .text( topic => topic.get( column_names.slice(-1)[0] ) ) 

    }) // end topic line
    }) // end tbody
    .node() // of table, that is
}

/*
 *
 * static functions
 *
 */

// we want to option to find invisible entities, too - 
// so we need to be able to pass an arbitrary entities object
// hence a static method
static find_entities_by_event = ( event, entities, except ) =>
{
  return Object.keys( entities ).filter
  ( key => 
  {
    if( key === except ) return false;
    const valueArray = entities[key].events;
    return valueArray.some( value => value === event );
  })
}
  
static filter_types( type_array, entities_map, keep_or_hide /* true -> keep; false -> hide*/ )
{
  return Array.from( Object.entries( entities_map ).reduce
( ( a, [key,value] ) =>
  (   (  type_array.includes( value?.options["rdfType"] )  ) == keep_or_hide  )
  ?
  a.add(key)
  :
  a
, new Set()
).values())
}
  
// return array of common entities which have both events in their timelines
common_entities( event_a, event_b = event_a)
{
  const entities_a = this.event_entity_map.get( event_a ) ?? new Set()
  const entities_b = this.event_entity_map.get( event_b ) ?? new Set()
  return [...entities_a].filter( entity => entities_b.has(entity) )
}

// parse the entity from a single line of text into a structured object
// and store that under its key
parse_timeline( timeline_text )
{
  timeline_text = Text.trim_line( timeline_text );
  if( timeline_text == "" || timeline_text.startsWith("#") ) return;

  let options = {}

  let timeline_text_options = timeline_text.split(" - ");
  timeline_text = timeline_text_options[0];
  if( timeline_text_options.length > 1 )
  {
    let   options_string = timeline_text_options[1].replaceAll("'",`\\"`) // backward compatible for JSON (not YAML) times
    const options_string_space_tokens = options_string.split(' ')
    if( options_string_space_tokens.slice(-1)[0]==="|" )
    {
      options_string = options_string_space_tokens.slice(0,-1).join(' ')
      options.showExit = false
    }
    if( /^[a-zA-Z]+$/.test(options_string) )
        options.rdfType = options_string
    else
    try
    {
        options = Object.assign(  options, yaml`{ ${options_string} }`  )
    } catch( e1 )
    {
      try
      {
        options = Object.assign(  options, JSON.parse( "{" + options_string + "}" )  )
      } catch( e2 ) 
      {
        options = { rdfType:"Syntax_Error",  labelPrefix:"⛔", rdfDescription:"YAML and JSON parsing errors, see browser console for details" };              
        console.error(e1) 
        console.error(e2)
      }
    }
  }

  options = Object.assign( {}, entity_default_properties_by_type.get( options.rdfType ) ?? {}, options ) // assigning default properties first, so that explicit properties in the options object may override default properties
  
  const tokens = timeline_text.split(' ');
  const rdfLabel = tokens[0];
  tokens.shift();

  let id = this.find_available_key( id_from_options_or_label( rdfLabel, options ) );
  if( id !== rdfLabel ) options.rdfLabel = rdfLabel;
  
  this.entity_timelines[ id ] = { events : tokens, options : options };
} // end parse_timeline

/* recursively generate a key which is not in use yet */
find_available_key( key_name, key_suffix = "" )
{
  return  this.entity_timelines[ key_name + key_suffix ]
          ?
          this.find_available_key( key_name, (key_suffix==""?0:key_suffix)+1 )
          :
          key_name + key_suffix
}

/* expand event-detail JSON shorthands with explicit name-value maps */
static substitute( k, v )
{
  switch( typeof v)
  {
    case "string":
      switch( v )
      {
        case "finish" : return {
          ktsRole       : "finish" ,
          rdfLabel      : '🏁'     ,
          rdfDescription: "finish" , // of that topic
        }
        case "death" : return {
          ktsRole       : "death" ,
          rdfLabel      : '✝'     , 
        }
        default         : return { rdfLabel : v }
      }
    case "object":
      if( Array.isArray(v) )
      {
        if( v[0].trim() === "=" ) v[0] = k.split('_')[0] // support an empty "label" which will re replaced by the topic, so that the 2nd array element can be read as the description. This way, label and description are always written in the same sequence
        return this.create_event_object( ... v ) // deconstruct array into what we interpret as label an optional description
      }
      return v // object (with attributes) as-is
  }
}

 /*
  * create a simple JSON fact-object from a label and an optional description
  */
static create_event_object = ( rdfLabel, rdfDescription ) => 
{
  const event = { rdfLabel }
  if( rdfDescription )
    event.rdfDescription = rdfDescription
  
  return event
}

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
hpcc_js_wasm_version = '@2.8.0'
```

```js
import { get_initial_url_param, get_initial_details, digraph2svg, dot2svg, kts_console, visco, init, set_input_value}
with {selected_entities, hpcc_js_wasm_version}
from "@bogo/kxfm"
```

```js
import { EventArena, Event } from "@bogo/timelib-event"
```

```js
import { render_maximap_div } from "@bogo/maximap"
```

```js
import { yaml, YAML } from "@bogo/yaml"
```

```js
import { toc } from "@nebrius/indented-toc"
```

## Initialization

```js
init_statement = 
{
  diagram_full_story;
  diagram_reduced_story;
  maximap;
  
  init();
  
  yield "Timeline ready";
}
```
