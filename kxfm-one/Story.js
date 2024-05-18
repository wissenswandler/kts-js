import * as yaml  from "js-yaml"

import * as  Arr        from './Arr.js'
import * as  Text       from './Text.js'
import {  EventArena  } from './EventArena.js'
import {  DotRenderer } from './DotRenderer.js'

export 
class Story extends EventArena
{

constructor( story_text_or_object, selected_entities_or_everything_flag = true )
{
  super()
  
  /* initializing class properties as workaround
   * for "experimental classProperty syntax"
   */
  this.central_entity = ""

  this.entity_default_properties_by_type = new Map(
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

  // full set of all timelines 
  // never filtered in base class and always constant
  // entries are parsed from "story" text in parse_timeline()
  this.entity_timelines = {}

  this.event_filters = []

  this.event_filter_objects = []
  
  this.constructor.story_delimiter = /- - -.*/
  
  this.constructor.color_12_paired = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928']
  this.constructor.color_12_set3 = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f']
  this.constructor.color_12_set3_minus_yellow = [
'#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f',
'#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462',
] // found yellow too hard to read on most screens, and changed the order so that it starts with bright green
  
  this.constructor.color_palette = this.constructor.color_12_set3_minus_yellow;

  /* 
   * end class properties workaround */
  
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

addFilter( filter_object ) 
{
  this.event_filter_objects.push( filter_object )
  return this
}
  
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

keep_types( type_array )
{
  return this.constructor.filter_types( type_array, this.entity_timelines, true  )
}
hide_types( type_array )
{
  return this.constructor.filter_types( type_array, this.entity_timelines, false )
}

type_of( entity )
{
  return this.entity_timelines[entity]?.options?.rdfType
}

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
  
static split_story( text )
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
        .entries(  yaml.load( split[1] )  )
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
   .map( block => block.split("\n").map( l => Text.trim(l) ).map(  l => l.startsWith('#') ? "" : l ).join(' ')  )
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
          return  this.constructor.datepart_from_event( e_b ).localeCompare( 
                  this.constructor.datepart_from_event( e_a )  
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

// return the split datepart of the first event in the given entity's timeline
first_notice_of( entity )
{
  return this.entity_timelines[entity].events[0].split('_').slice(1) 
}

 /*
  * TODO: add transitive steps to calculate additional certain_ranges from previously inferred certain_ranges
  */
calculate_undated_event_certain_ranges()
{
  return [ ...this.events.values() ].filter( e => !e.date ).map( e => e.key ).map
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
}

  
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

  const other_entities_for_event = this.constructor.find_entities_by_event( e1, this.entity_timelines, this.central_entity ); 

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

/*
 *
 * static functions
 *
 */

// we want to option to find invisible entities, too - 
// so we need to be able to pass an arbitrary entities object
// hence a static method
static find_entities_by_event( event, entities, except )
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
  timeline_text = Text.trim( timeline_text );
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
        options = Object.assign(  options, yaml.load( "{ " + options_string + " }" )  )
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

  options = Object.assign( {}, this.entity_default_properties_by_type.get( options.rdfType ) ?? {}, options ) // assigning default properties first, so that explicit properties in the options object may override default properties
  
  const tokens = timeline_text.split(' ');
  const rdfLabel = tokens[0];
  tokens.shift();

  let id = this.find_available_key( DotRenderer.id_from_options_or_label( rdfLabel, options ) );
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
static create_event_object( rdfLabel, rdfDescription )
{
  const event = { rdfLabel }
  if( rdfDescription )
    event.rdfDescription = rdfDescription
  
  return event
}

static datepart_from_event( event )
{
  return event.split('_').slice(1).join('_')
}

}
