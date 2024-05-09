import {  DotRenderer  } from './DotRenderer.js'
import {  Story        } from './Story.js'

export 
class StoryToDotRenderer extends DotRenderer
{

  diagram_options = 
  {
    future_pointer_minlen: 1
    ,
    places_edge_style : "dotted"

    , entryArrowtail : "crow" // for a nicer distinction between the entity's name and its first event along the timeline
    
    //, entity_edge_style : "dashed"
    
    //, showExit : false // a river e.g. never extends beyond its estuary

    //, render_terminal_event_boxed : true
  }

  static highlight_all_timelines_of_event = "highlight all timelines of event"

  title_dot = "" // to be included near the top of DOT source - can be used to implement a title or supplementary graphics

  story
  
  constructor( story, diagram_toggles, project_lod )
  {
    super( project_lod )

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
    this.diagram_toggles = diagram_toggles

    //this.connect_entrynode_with_first_event = this.connect_entrynode_with_first_event.bind( this )
  }

/*
 * render Graphviz code compatible with "DOT"
 */
toString()
{ return this.story.eventsArray.length === 0 
  ? 
  `digraph <empty> {e [fontsize=20 label="story is empty - filters too narrow?"]  }` 
  : 
  `
digraph <Timelines> {

ranksep=0.1
nodesep=0.2
node [shape=none tooltip=""]

${ this.title_dot }

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
{ edge [ style=${ this.diagram_options?.places_edge_style ?? `""` } ]

${ this.render_topics() }

} # end topics


#
# entities (people / beings / things) : typically solid lines; 
# events may be shared because entities can meet/touch each other at the same place (or topic) + time
#
{ edge [ style=${ this.diagram_options?.entity_edge_style ? this.diagram_options?.entity_edge_style : `""` } ]

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
      const properties = event_json  ?  this.translate_nodeValues_to_dotValues( event_json )  :  new Map()
      
      const entities = Array.from( this.story.event_entity_map.get(k) ) // all entities which share this event - guaranteed to be at least one

      const classlist = new Array();
      if
      (
        this.diagram_toggles?.includes( this.constructor.highlight_all_timelines_of_event )
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
        this.render_timeline( c, this.story.entity_timelines, this.diagram_options ) 
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
    render_exitnode   = render_exitnode .bind( this )
    render_entrynode  = render_entrynode.bind( this )
    connect_entrynode_with_first_event = connect_entrynode_with_first_event.bind( this )

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
      
    const id      = super.constructor.id_from_options_or_label( rdfLabel, options );
    
    const minlen   = options.minlen      ?? 2;
    const dotLabel = options.labelPrefix ?  options.labelPrefix + ' ' + rdfLabel : rdfLabel;
    const shape    = options.shape       ?? options.labelPrefix ? "none" : "box";
    const endNode  = options.endNode     ?? id + "_future";
    const showEntry= options.showEntry   ?? this.diagram_options.showEntry ?? true;
    const showExit = options.showExit    ?? this.diagram_options.showExit  ?? events.length > 0; // don't show future-arrow for entities without events

    const color_clause = color ? ` color="${ color }"` : ""
    
    return `
  { node [ class=global_type_${id} ${ options.node ?? "" } ]
    edge [ class=global_type_${id} ${ options.edge ?? "" } tooltip="${dotLabel}" ]
    ${ events.length && this.diagram_options.render_terminal_event_boxed ? ` <${ events[ events.length-1 ] }> [shape=box${ color_clause }]` : "" }
    ${ render_entrynode( this ) } <${ events.join(">-><") }> ${ render_exitnode() }
  }
  `; // end return expression
  
    function render_entrynode()
    {
      return showEntry ?
    `<${id}> [${ id != dotLabel ? `label="${ dotLabel }" `:""}${ options.rdfDescription ? `tooltip="${ options.rdfDescription }" ` : "" }shape=${ shape }${ color_clause }] ` + connect_entrynode_with_first_event( this )
    : "" 
    }
    function connect_entrynode_with_first_event() { return events.length > 0 ? `<${id}> -> <${events[0]}> [penwidth=1${ this.diagram_options.entryArrowtail ? ` arrowtail=${ this.diagram_options.entryArrowtail }` : ""}] ` : "" }
  
    function render_exitnode()
    {
      return showExit ? `    
    node [ ${ this.diagram_options.repeat_entity_in_future ? `shape=box${ color_clause } label=${ dotLabel }` : "style=invis height=0 width=0 fixedsize=true" }]
    edge [class="global_type_${id} _future" arrowhead=""${this.diagram_options?.future_pointer_minlen != 1 ? " minlen="+this.diagram_options?.future_pointer_minlen : ""}] <${ events[events.length-1] }>-><${endNode}>` : ""
    }
  } // end render_timeline
}

