/*  Copyright 2019-2023 Boran Gögetap <- boran@goegetap.name

    javascript for interactive SVG graph viewer,
    ... Teil von // part of ...
    Knowledge Transformation System (KTS)

    KTS ist Freie Software: Sie können es unter den Bedingungen
    der GNU Affero General Public License, wie von der Free Software Foundation,
    Version 3 der Lizenz oder (nach Ihrer Wahl) jeder neueren
    veröffentlichten Version, weiter verteilen und/oder modifizieren.

    KTS wird in der Hoffnung, dass es nützlich sein wird, aber
    OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
    Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
    Siehe die GNU Affero General Public License für weitere Details.

    Sie sollten eine Kopie der GNU Affero General Public License zusammen mit diesem
    Programm erhalten haben. Wenn nicht, siehe <https://www.gnu.org/licenses/>.

    //

    KTS is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    KTS is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with KTS.  If not, see <https://www.gnu.org/licenses/>.
 */

 /*
  * KTS contract for the id of edges so that we can split the edge id into node ids;
  * must be the same value as in DOT files, set via attribute: edge [ id="\\T___\\H" ]
  */

var visco = (function()
{

const NODE_SEPARATOR	= "___"
const CLASS_PREFIX_TYPE         = "type_"         // prefix for class names, declaring the type of nodes or  edges
const CLASS_PREFIX_GLOBAL_TYPE  = "global_type_"  // prefix for class names, declaring the type of nodes AND edges

var KTSDEBUG = false;

const DIRECTION_NORTH	= 1	// constant to indicate direction of travel, going "up" or "North"
const DIRECTION_SOUTH	= 0	// constant to indicate direction of travel, going "down" or "South"
const DIRECTION_BOTH  	= 2	// constant to indicate direction of travel, going "both" ways

const DIRSTRING		= ['South', 'North']	// textual representation of direction
const REASONING		= ['Dependency', 'Impact']	// textual representation of direction

const MISSION_ERASE	= "MISSION_ERASE"
const MISSION_COUNT 	= "MISSION_COUNT"

const ACTIONS_DISPLAY_MODE_NAME = ["collapsed", "reduced", "full"]
var   ACTIONS_DISPLAY_MODE = 0; // default to "collapsed"

const MOUSE_MODE_CAUSALITY= 0;
const MOUSE_MODE_SAME		  = 1;
const MOUSE_MODE_ONE		  = 2;
const MOUSE_MODE_NAMES = ["causality", "same", "one"]
var   MOUSE_MODE = MOUSE_MODE_CAUSALITY;

var NEXT_CLICK_MEMORY		= false
var NEXT_CLICK_DIRECTION	= -1

var nodes_visited
var focussed_node
var focussed_edge
var clipText
var all_nodes = []

var panZoomInstance

/*
 * convenience function to execute either a click- or a press-command
 * which is mostly used in the URL interface for passing a (sequence of) command(s)
 */
function e( symbol )
{
  let command = kts_actions[ symbol ];
  if( command )
  {
    press( symbol );
    return;
  }

  let elm = document.getElementById( symbol );
  if( elm )
  {
    on_click( elm );
    return;
  }

  console.warn( "don't know how to execute statement ==>" + symbol + "<== (may be OK for multi-diagram document)" );
}

function   click( elm ) { return explore( elm ) }

/*
 * Script API to explore graph element by id, supporting optional selector parameter
 */
function explore( elm_id, selector )
{
  if( typeof selector === 'undefined' )
    return explore_elm_id( elm_id );
  else
    return explore_nested( elm_id, selector );
}

/*
 * handles lookup of graph element by id, nested in a tag as defined by CSS selector
 */
function explore_nested( elm_id, selector)
{
  let selected = document.querySelector( selector );
  if( !selected )
  {
    console.error( "could not find element with selector " + selector );
    return; // don't throw from this API entry, because calling script (on HTML page) shall be allowed to continue exploring other elements without catching
  }
  if(                         selected.getSVGDocument                             )
  {
    if(                       selected.getSVGDocument().getElementById( elm_id )  )
    {
      return on_click( selected.getSVGDocument().getElementById( elm_id )  );
    }
    else
    {
      console.error( "could not find element with id " + elm_id + " in DOCUMENT " + selected.getSVGDocument() );
    }
  }
  else // selector does not point to an SVG document but perhaps to an SVG tag inside this HTML document
  {
    if(                       selected.querySelector( "#"+elm_id )  )
    {
      return on_click( selected.querySelector( "#"+elm_id )  );
    }
    else
    {
      console.error( "could not find element with id " + elm_id + " in ELEMENT " + selected.getSVGDocument() );
    }
  }
}

/*
 * handles page-wide lookup of graph element by id
 * and forwards to on_click()
 */
function explore_elm_id( elm )
{
  if( typeof elm !== 'string' ) throw "explore_elm_id() expects a string as parameter, but got " + typeof elm;

  const id = elm;
  devdebug( "converting ID " + id + " string to document element" )
  let elms = document.querySelectorAll( "#" + id )
  search_for_elm:
  switch( elms.length )
  {
    case 1:
      elm = elms[0];
      break;

    case 0:
        let nested_elms = [];
        devdebug( "now searching inside object tags..." );
        document.querySelectorAll( "object" ).forEach
        ( object => 
        {
          if( object.getSVGDocument() && object.getSVGDocument().getElementById( id ) )
          {
            console.info( "found element with id " + id + " in object tag with id: " + object.id );
            console.info( "note to script author: you can reference it directly by calling:" )
            console.info( `  explore( "${id}", "#${object.id}" )` );
            nested_elms.push( object.getSVGDocument().getElementById( id ) );
          }
        });
        switch( nested_elms.length )
        {
          case 0: 
            break;  // continue with error message below
          case 1:
            elm = nested_elms[0]; // lucky us, we found it
            break search_for_elm;
          default:
            console.warn( "found " + nested_elms.length + " elements with id '" + id + "' in object tags - using random one." ); 
            console.warn( "note to script author: you could call explore(elm, selector) with a CSS selector to narrow down elm" );
            elm = pick_random_element( nested_elms );
            break search_for_elm;
        }

      // still not found
      console.error( 'cannot find element with id "' + id + '" in document ' + document );
      return;

    default:
      console.warn( "found " + elms.length + " elements with id '" + id + "' - using random one." );
      console.warn( "note to script author: you could call explore(elm, selector) with a CSS selector to narrow down elm" );

      elm = pick_random_element( elms );
  }

  on_click( elm );
}

var is_flash_event = false; // is the current event a flash event (i.e. not a click but a mouseover or mouseout event)

/*
 * KTS response on a click: traverse the graph and present that path by coloring the nodes and edges
 *
 * count max distances from clicked node both ways (north and south),
 * then travel the longer path because that is more interesting
 * 
 * This core function also gets called from the explore() script API
 */
function on_click( elm, event = "script", document = globalThis.document )
{
  console.info( node_name_by_id( elm.id ) + " now being explored upon " + event + " ..." );
  
  const event_class_name = event?.constructor?.name;
  const mouseclicks = event.detail; // 1 or more for mouse clicks, 0 for other mouse events, undefined for script calls
  
  if( event && mouseclicks > 0 && event.preventDefault ) event.preventDefault(); // don't follow link in case this was a click on a hyperlinked node
  
  is_flash_event = ( event_class_name == "MouseEvent" && mouseclicks == 0 );
  devdebug( "is_flash_event = " + is_flash_event );
  
  if( !is_flash_event ) remove_flashes( document );
  
  focussed_node = elm;
  
  if( NEXT_CLICK_MEMORY == 'R' )
  {
  remove_visitor_tags_of_single_node( elm, document ) 
  NEXT_CLICK_MEMORY = false;
  return;
  }

  let graph_element_class;

  if( elm.classList.contains( "node" ) )
  {
    focussed_node = elm;
    graph_element_class = "node";
  }

  if( elm.classList.contains( "edge" ) )
  {
    focussed_edge = elm;
    graph_element_class = "edge";
  }

  switch( MOUSE_MODE)
  {
    case MOUSE_MODE_CAUSALITY:
      if( graph_element_class == "node" )
      {
        explore_causality( elm, event, document );
      }
      break;

    case MOUSE_MODE_SAME:
      explore_same_types( elm, event, document, graph_element_class );
      break;

    case MOUSE_MODE_ONE:
      // implemented by code before switch
      break;

    default:
      console.error( "unknown MOUSE_MODE: " + MOUSE_MODE );
  }
}

function explore_causality( elm, event, document )
{  

 var myTags = [	calculate_travel_tag( elm.id, DIRECTION_SOUTH ) ,
 		calculate_travel_tag( elm.id, DIRECTION_NORTH ) ]

 let max_distance = Array.from(  [0,1], dir => start_counting( elm , dir ).max_distance_found  )

 if( max_distance[0] + max_distance[1] == 0 ) { console.info("no neighbors"); return }

 var visitorTags = [ elm.getAttribute( "tag1" ), elm.getAttribute( "tag2" )]

 if( NEXT_CLICK_DIRECTION > -1 )		// explicit wish
 {
  if( NEXT_CLICK_DIRECTION == DIRECTION_BOTH )
  {
    start_travel_both_ways ( elm , max_distance );
  }
  else
    start_travel ( elm , max_distance , NEXT_CLICK_DIRECTION )
 }
 else
 if( max_distance[0] == max_distance[1] )
 {
  console.info( "equal path lengths North and South" )
  if( visitorTags.includes( myTags[ 0 ] )  	// been there
   && visitorTags.includes( myTags[ 1 ] ) ) 	// been the other way, too
  {
    console.info( "cleaning up" )
    if( !is_flash_event) erase_both_ways( elm )
  }
  else //follow both
  {
    start_travel_both_ways ( elm , max_distance );
  }
 }
 else // paths are not equally long
 {
    let direction = max_distance[0] > max_distance[1] ? 0 : 1	// direction of the longer path

    if(   visitorTags.includes( myTags[    direction ] )  )	// been there
    {
      if
      (
        visitorTags.includes( myTags[ 1- direction ] )  	// been the other way, too ...
	      ||
	      max_distance[ 1- direction ] == 0			// no reverse path
      )
      {
        if( !is_flash_event ) erase_both_ways( elm )			// ... reverse not an option
      }
      else
      {
        start_travel ( elm , max_distance , 1- direction)	// travel reversed direction
      }
    }
    else
        start_travel ( elm , max_distance ,    direction)	// travel direction of longer, untravelled path
 }
 if( !is_flash_event ) NEXT_CLICK_DIRECTION = -1
  
  filterAllActions( document );
}

function calculate_travel_tag( id, direction )
{
 return id + "-going-" + direction
}

function erase_both_ways( elm )
{
  const max_distance = [0,0];
  start_travel ( elm , max_distance , DIRECTION_SOUTH, MISSION_ERASE )

  elm.setAttribute( "tag1", "dummy" ) // set dummy tag so that next travel does not terminate on already cleared node

  start_travel ( elm , max_distance , DIRECTION_NORTH, MISSION_ERASE )

  console.log( "erasing " + REASONING[DIRECTION_NORTH] + " and " + REASONING[DIRECTION_SOUTH] + " of " + node_name_by_id( elm.id ) )
}

function start_travel_both_ways( elm , max_distance )
{
  start_travel ( elm , max_distance , DIRECTION_SOUTH );
  start_travel ( elm , max_distance , DIRECTION_NORTH );
  console.log( "showing " + REASONING[DIRECTION_NORTH] + " and " + REASONING[DIRECTION_SOUTH] + " of " + node_name_by_id( elm.id ) )
}

function node_name_by_id( id )
{
  let label = getNodeLabelById( id );
  return (label && label != id )  ? ( '"' + label + '" [' + id +']' ) : '"' + id + '"' ;
}

function start_counting( elm , direction )
{
  return start_travel( elm , [0,0],        direction, MISSION_COUNT );
}
function start_travel( elm , max_distance, direction, mission = calculate_travel_tag( elm.id , direction ) )
{
  nodes_visited = 0
  console.debug( "going " + DIRSTRING [ direction ] + " for max " + max_distance[ direction ] + " steps" + ( mission ? (" on mission " + mission ) : "..." )  )

  // reset helper tags that are used for one travel only
  elm.ownerSVGElement.querySelectorAll( "[distance]"  ).forEach(   svgElm => {  svgElm.removeAttribute( "distance" )  }   ) 
  elm.ownerSVGElement.querySelectorAll( ".exit"       ).forEach(   svgElm => {  svgElm.classList.remove( "exit"    )  }   ) 

  enter_node( elm , 0 ,                                                // current_dist
    direction == DIRECTION_SOUTH ? 0 : max_distance[DIRECTION_NORTH] ,  // current_rank
    max_distance[direction]+1 ,                                         // total_ranks
    direction,
    mission
  )

  if( mission == MISSION_COUNT )
    elm.ownerSVGElement.querySelectorAll( "[tag0=COUNT]" ).forEach( svgElm => {  svgElm.removeAttribute( "tag0" )  }   );

  let max_dist_from_tag  = Array.from(elm.ownerSVGElement.querySelectorAll(".node[distance]")).map( n => n.getAttribute("distance")               ).reduce( (a,b) => Math.max(a,b), 0 )

  let logtext = "visited " + nodes_visited + " nodes with max distance of " + max_dist_from_tag + " between";
  switch( mission )
  {
    case MISSION_COUNT:
    case MISSION_ERASE:
      console.debug( logtext );
      break;
    default:
      console.info( logtext );
      console.log( "showing " + REASONING[direction] + " of " + node_name_by_id( elm.id ) )
  }

  return {n_visited:nodes_visited, max_distance_found:max_dist_from_tag};
}

/*
 * recursive coloring travel, node hop
 */
function enter_node( elm , current_dist, current_rank , total_ranks , direction , tag )
{
 if( !elm )
 {
  devdebug( "  entering null node (invisible per DOT?), returning" );
  return;
 }
 //devdebug( "  entering " + elm.id.padEnd(19,' ') + " at d: " + current_dist + ", r: " + current_rank + " of " + total_ranks )
 if(  process_graph_element( elm , current_dist, current_rank , total_ranks , direction , tag )  )
 {
  // recurse and increment color rank IF travelling South (color rank decreases from edge to next node, in positive flow direction)
  let next_edges = elm
    .ownerSVGElement
    .querySelectorAll(  next_edges_selector( elm.id , direction )  );

  if( next_edges.length > 0 )
  {
    elm.classList.add( "exit" ); // required for logic gates to know that they have been exited (after activation), as opposed to just visited
    next_edges.forEach
    (   edge =>
      { 
        travel_edge
        (edge , current_dist, current_rank + 1 - direction , total_ranks , direction , tag );
      }
    )
  }
 }
 devdebug( "  no more edges." );
}

/*
 * recursive coloring travel, edge hop, adding 1 to recursive distance _assuming_ that the folowing node 'counts'
 */
function travel_edge( elm , current_dist, current_rank , total_ranks , direction , tag )
{
  //devdebug( "  entering " + elm.id.padEnd(19,' ') + " at d: " + current_dist + ", r: " + current_rank + " of " + total_ranks )

  if( elm.querySelector( 'path[stroke-dasharray]' ) )
  {
    console.info
    (
      "KTS NOT crossing non-solid edge on travel from " + 
      node_name_by_id( elm.id.split( NODE_SEPARATOR )[ 1-direction ] ) + " to " + 
      node_name_by_id( elm.id.split( NODE_SEPARATOR )[   direction ] )
    );
    return;
  }

  process_graph_element( elm , current_dist, current_rank , total_ranks , direction , tag ) 

  // recurse and decrement color rank IF travelling North (color rank decreases from edge to next node, in positive flow direction)
  enter_node
  (
    elm.ownerSVGElement.querySelector( "#" + elm.id.split( NODE_SEPARATOR )[ direction ]  ),
    1+current_dist, current_rank - direction , total_ranks , direction , tag   
  )
}

/*
 * mark node or edge as visited and return whether recursion should continue from here
 */
function process_graph_element( elm , current_dist, current_rank , total_ranks , direction , tag )
{
  devdebug( " processng " + elm.id.padEnd(19,' ') + " at d: " + current_dist + ", r: " + current_rank + " of " + total_ranks );
  
  if( tag == MISSION_ERASE )
  {
    if( ! elm.hasAttribute( "tag1" ) &&
    ! elm.hasAttribute( "tag2" ) ) return false	// already erased
    // else
    remove_visitor_tags( elm )				// otherwise clear...
    return true						// ... and continue recursion
  }
  
  //
  // mission = tag or COUNT
  //
  
  let exitedBefore = elm.classList.contains( "exit" );
  let isLogicalAndNode = ['∧', '+' ].indexOf(  elm.querySelector( "g a text" )?.innerHTML  )  >  -1  ;
  let isActivated = true // is this node ready to be passed? By default, yes, unless it's a logical AND node with unactivated edges
  if( isLogicalAndNode && direction == DIRECTION_NORTH ) // only check for Logical-And if we're travelling North, because we're checking for incoming edges
  {
    let nIncomingEdges  = elm.ownerSVGElement.querySelectorAll(  next_edges_selector( elm.id , DIRECTION_SOUTH, false )  ).length;
    let nActivatedEdges = elm.ownerSVGElement.querySelectorAll(  next_edges_selector( elm.id , DIRECTION_SOUTH, true  )  ).length;
    devdebug( "  " + elm.id + " has " + nIncomingEdges + " incoming edges, " + nActivatedEdges + " activated; " + (!exitedBefore ? "not" : "") + " exited before" );
    isActivated = nIncomingEdges == nActivatedEdges;
    if( isActivated )
    {
      elm.classList.remove( "hover" );
      devdebug( "  " + elm.id + " is activated" );
    }
    else
    {
      add_class( elm, "hover",  );

      devdebug( "  " + elm.id + " is NOT activated" );
    }
  }
  
  let seenBefore = elm.hasAttribute( "distance"	)	// been here before
  let distance = + elm.getAttribute( "distance"	)	// = 0 if not set

  devdebug( "  seenBefore = " + seenBefore );
  devdebug( "  distance   = " + distance   );

   if( distance > current_dist )
    devdebug( "  seen before at (older, longer) distance " + distance + ", now down to " + current_dist );
   else
    devdebug( "  first time here, or second time on equal-or-longer distance " + current_dist + " than before (" + distance + ")" );
  
  if
  (
    !seenBefore                // first time here
    ||
    distance > current_dist    // previous visit through a longer path than current visit
    ||
    (isLogicalAndNode && direction == DIRECTION_NORTH && !exitedBefore && isActivated )              // been at this logic gate before, but never exited it because it had not been activated
  )	
 {
   if( (! seenBefore) || distance > current_dist )
   {
     devdebug( "  setting distance " + current_dist );
     elm.setAttribute( "distance", current_dist );
   }

   if( ! seenBefore && elm.classList.contains("node") ) ++nodes_visited;

   if( tag == MISSION_COUNT )
   {
      elm.setAttribute( "tag0", "COUNT" );  // just mark as visited so that logic gates can be activated already during the COUNT mission for obtaining the correct path length
   }
   else // MISSION_TAG
   {
     if(  (! elm.hasAttribute( "tag1" )) || distance > current_dist  )
     {
        set_attribute( elm, "tag1", tag, is_flash_event )

        elm.setAttribute( "colorank",
        total_ranks > 9		// largest brewer scheme
        ?
        Math.round( 1.0 * current_rank / total_ranks * 9) + "-9"
        :
                          current_rank                    + "-" + total_ranks )
     }
     else
     {
        set_attribute( elm, "tag2", tag, is_flash_event )
	devdebug( "  setting tag 2" );
        // tag2 (intersection) shall not overwrite the colorrank from tag1
     }

      if( !is_flash_event ) elm.classList.remove( "dim" )

   }
   devdebug( "  " + (isActivated ? "proceed..." : "stop.") );
   return isActivated
 }
 else
  {
    devdebug( "  no need to proceed");  // BUG: a gate which is activated for the first time must be passed now
    return false;  // already been here on shorter or equally long path => no need to recurse
  }
}

function set_attribute( elm, attribute_name, attribute_value, is_flash_event )
{
  if( is_flash_event && !elm.getAttribute( attribute_name ) )
    elm.classList.add(    attribute_name + "_by_flash" );
  else if ( !is_flash_event )
    elm.classList.remove( attribute_name + "_by_flash" );
  
  elm.setAttribute(       attribute_name, attribute_value );
}

function add_class( elm, class_name, is_flash_event )
{
  if( is_flash_event && !elm.classList.contains( class_name ) )
    elm.classList.add(    class_name + "_by_flash" );
  else if ( !is_flash_event )
    elm.classList.remove( class_name + "_by_flash" );

  elm.classList.add(      class_name );
}

function next_edges_selector( id, direction, tagged = false )
{
 if( direction == DIRECTION_NORTH )
 {
   return '.edge[id^="' + id + NODE_SEPARATOR + '"]'  // edge with id starting with node id + NODE_SEPARATOR
 }
 if( direction == DIRECTION_SOUTH )
 {
   let sel =
      '.edge[id$="' + NODE_SEPARATOR + id + '"]' ;  // edge with id ending with NODE_SEPARATOR + node id

   if( tagged )
    sel += '[tag1], ' +
      '.edge[id$="' + NODE_SEPARATOR + id + '"][tag0]' ;  // same edge pattern with tag1 (color) or tag0 (counting)

  return sel
 }
 return "error - unknown direction code"
}


const kts_actions = {

A : { f : () => analyze_graph(),
      s : -1
      ,
      filter : document => all_nodes.length > 0  &&  ! hasSelectionOrIsDimmed( document )
      ,
      text : "[A]nalyze graph (explore one of the longest paths)"
      ,
      post : () => {} // prevent that action text overwrites more interesting console output from explore_graph()
    }
,
B : { f : () =>
      {
        NEXT_CLICK_DIRECTION = DIRECTION_BOTH
      },
      s : 16
      ,
      filter : () => all_nodes.length > 0  &&  NEXT_CLICK_DIRECTION != DIRECTION_BOTH
      ,
      text : "travel [B]oth ways upon next CLICK"
    }
,
d : { text : "[d]im selected nodes (= inverse of [F])",
      f : (document) =>
      {
        document.querySelectorAll( "g[tag1]" ).forEach( (svgElm) => { remove_visitor_tags( svgElm ); svgElm.classList.add( "dim" ) })
      },
      s : 30
      ,
      filter : (document) => hasSelection( document )
      ,
      post : "Selection dimmed."
    }
,
e : { text : "r[e]store all colors",
      f : (document) =>
      {
	      // cleanup tagged nodes
        document.querySelectorAll( "g"  ).forEach( (svgElm) => { remove_visitor_tags( svgElm    ) })
        focussed_node = null;
      },
      s : 31  // with selection
      ,
      filter : (document) => hasSelectionOrIsDimmed( document )
      ,
      post : () =>
      {
        let message = "Restored all color.";
        if( isVisualModeActive() ) message += " You can click on any node to explore the diagram."
        console.log( message );
      }
    }
,
// key 'f' also captures CTRL-F in chrome, so no more find-in-page possible
F : { f : function(document)
      {
        document.querySelectorAll( "g.edge:not([tag1]):not(.hover), g.node:not([tag1]):not(.hover), g.cluster" ).forEach(  svgElm => svgElm.classList.add( "dim" )  )
        document.querySelectorAll( "g[tag1] , .hover"       ).forEach( (svgElm) => { remove_visitor_tags( svgElm ) })
      },
      s : 32  // with selection
      ,
      filter : (document) => hasSelection( document )
      ,
      text : "concentrate on selected nodes (= inverse of [d])"
      ,
      post : "now concentrating on selection"
    }
,
h : { text : "activate [h]yperlink mode (= inverse of [v])", f : (document) => activate_hyperlink_mode(document)
      ,
      s : 10+1
      ,
      filter : () => isVisualModeActive() && document.querySelector( 'g a[*|href]' )
      ,
      post : "Hyperlink mode activated. ( CTRL- ) Click on any node for navigating to its data source."
    }
,
i : { text : "keep [i]ntersecting paths (clear the rest) = inverse of [o]",		f : (document) =>
    {
      const hasTag1 = document.querySelector( "g[tag1]" )
      const hasTag2 = document.querySelector( "g[tag2]" )
      const hasHovr = document.querySelector( "g.node.hover" )
      if( hasTag2 )
      {
       document.querySelectorAll( "g[tag1]:not([tag2])" ).forEach(  svgElm => svgElm.removeAttribute( "tag1" )  )
       console.log( "all but intersecting colors cleared - you can [m]erge to turn them from blue to orange")
      }
      else
      if( !hasTag2 && hasTag1 && hasHovr )
      {
       document.querySelectorAll( "g.node[tag1]:not(.hover)" ).forEach(  svgElm => svgElm.removeAttribute( "tag1" )  )
       console.log( "kept matching types only, cleared the rest")
      }
      else console.log( "currently no intersecting paths")
    }
      ,
      s : 40
      ,
      filter : (document) => hasIntersection( document )
      ,
      post : () => {} // prevent previous console.log from being overwritten
    }
,
j : { text : "concentrate on intersection (= shortcut for [i] + [F] )",		f : function(document)
    {
      execute_kts_action( document, "i" )
      execute_kts_action( document, "F" )
      }
      ,
      s : 41
      ,
      filter : (document) => hasIntersection( document )
      ,
      post : "Concentrating on intersecting paths"
    }
,
m : { text : "[m]erge path intersections", 				f : function(document)
    {
      document.querySelectorAll( "g[tag2]" ).forEach( (svgElm) => { svgElm.removeAttribute( "tag2" ) })
      }
      ,
      s : 42
      ,
      filter : (document) => hasIntersectingColors( document )
      ,
      post : "Selection paths merged with intersection."
    }
,
'M':
  { text : "rotate [M]ouse mode (explore / same / one)",			f : (document) => 
    {
      set_mouse_mode( (MOUSE_MODE+1)%MOUSE_MODE_NAMES.length );
    }
    ,
    s : 10+2  // mode selectors
    ,
    post : () => {} // prevent previous console.log from being overwritten
  }
,
N : { text : "travel [N]orth (forward) direction upon next CLICK (= inverse of [S])", 	f : () => NEXT_CLICK_DIRECTION = DIRECTION_NORTH
      ,
      s : 15
      ,
      filter : () => all_nodes.length > 0  &&  NEXT_CLICK_DIRECTION != DIRECTION_NORTH
    }
,
o : { text : "keep [o]utersection (clear intersection) = inverse of [i]",		f : document =>
      {
        const hasTag1 = document.querySelector( "g[tag1]" )
        const hasTag2 = document.querySelector( "g[tag2]" )
        const hasHovr = document.querySelector( "g.node.hover" )
        if( hasTag2 )
        {
          document.querySelectorAll("g[tag2]").forEach( svgElm => remove_visitor_tags(svgElm) )
          console.log( "intersecting colors cleared")
        }
        else
        if( !hasTag2 && hasTag1 && hasHovr )
        {
          document.querySelectorAll( "g.node.hover[tag1]" ).forEach( svgElm => remove_visitor_tags(svgElm) )
          console.log( "cleared matching types, kept the rest")
        }
        else console.log( "currently no intersecting paths")
      }
      ,
      s : 43 // with intersection
      ,
      filter : (document) => hasIntersection( document )
      ,
      post : () => {} // prevent previous console.log from being overwritten
    }
,
// key 'r' also captures CTRL-R in chrome, so no more page-reload possible
R : { text : "[R]emove (un-select) a single node upon next CLICK"
      ,
      f : () => {}  // handled via NEXT_CLICK_MEMORY
      ,
      s : 18
      ,
      filter : () => hasSelection( document )
    }
,
// key 's' also captures CTRL-S in chrome, so no more save-page possible
S : { text : "travel [S]outh (backward) direction upon next CLICK (= inverse of [N])",	f : () => NEXT_CLICK_DIRECTION = DIRECTION_SOUTH
      ,
      s : 17
      ,
      filter : () => all_nodes.length > 0  &&  NEXT_CLICK_DIRECTION != DIRECTION_SOUTH
    }
,
U : { text : "copy [U]rl of focussed node to clipboard",		f : function(document)
      {
        clipText = document.querySelector( "#" + focussed_node.id + " g a" ).getAttribute( "xlink:href" ); 
        console.info( "focussed.id: " + focussed_node.id + " with url: " + clipText );
        navigator.clipboard.writeText( clipText );
      }
      ,
      s:71
      ,
      filter : () => 
      {
        if( focussed_node )
        {
          let focussed_a_tag = document.querySelector( "#" + focussed_node.id + " g a" );
          if( focussed_a_tag )
            return focussed_a_tag.getAttribute( "xlink:href" );
        }
        return false;
      }
      ,
      post : () => console.log( '"' + clipText + '" is now on system clipboard' )
    }
,
v : { text : "activating [v]isual mode (= inverse of [h])",	f : dom => activate_visual_mode( dom )
      ,
      s : 10
      ,
      filter : dom => isHyperlinkModeActive( dom )
      ,
      post : "Visual mode activated. Click on any node to explore the diagram, if you like."
    }
,
y : { text : "[y]ank (copy) ID of focussed node to clipboard",
      f : function(document)
      {
        console.info( "focussed.id: " + focussed_node.id );
        navigator.clipboard.writeText( focussed_node.id );
      }
      ,
      s:70
      ,
      filter : () => focussed_node != null
      ,
      post : () => console.log( '"' + focussed_node.id + '" is now on system clipboard' )
    }
,
',':{ text : "copy selection to clipboard, separated by [,] (comma)",
      f : (document) => copy_selection_to_clipboard( document, ',' )
      ,
      s : 72 // with selection
      ,
      filter : (document) => hasSelection( document )
      ,
      post : () => console.log( '"' + clipText + '" is now on system clipboard' )
    }
,
' ':{ text : "[SPACE] copy selection to clipboard, separated by [ ] (space)",
      f : (document) => copy_selection_to_clipboard( document, ' ' )
      ,
      s : 71 // with selection
      ,
      filter : (document) => hasSelection( document )
      ,
      post : () => console.log( '"' + clipText + '" is now on system clipboard' )
    }
,
'+':{ s : 1,  text : "zoom in",						        filter : () => all_nodes.length > 0 && panZoomInstance
      ,
      f : () => panZoomInstance.zoomIn() ,          post : () => {}
    }
,
'0':{ s : 2,  text : "reset (center) pan, zoom",  filter : () => all_nodes.length > 0 && panZoomInstance
      ,
      f : () => panZoomInstance.reset() ,           post : () => {}
    }
,
'-':{ s : 3,  text : "zoom out",						      filter : () => all_nodes.length > 0 && panZoomInstance
      ,
      f : () => panZoomInstance.zoomOut() ,         post : () => {}
    }
,
'?':{ text : "show this help window",						f : (document) =>
      {
        /*
        console.debug( "output of keyboardFunctionMap in console (should also appear in browser as SVG / HTML)" )
        for (let key in kts_actions)
        {
          console.info(key + " : " + kts_actions[key]["text"])
        }
        */

        set_actions_display_mode( 2, document);

        /*
        // for HTML (also inside SVG):
        apply_display_style( "ktsKeyboardHelp", 'display: inline-block' )
        document.querySelectorAll("#ktsKeyboardHelp span").forEach( n => n.style = "" )

        try
        {
          // for SVG only, since the display style is not inherited:
          document.getElementById( "fo0").removeAttribute( "display" )
        }
        catch( e ) { }
        console.log( "Click a button to execute a KTS command, or type that key on your keyboard." );
        */
      }
      ,
      s : 90  // help tools
      ,
      filter : (document) => document.querySelector("#ktsKeyboardHelp span").style.display == "none" // current: reduced view
      ,
      post : () => {}
    }
,
'Delete':
    {
      s : 75
      ,
      filter : (document) => focussed_node && document.querySelector( "#" + focussed_node.id + "[tag1]" ) // focussed element is part of selection
      ,
      text : "Delete focussed node from selection."
      ,
      f : (document) => remove_visitor_tags_of_single_node( focussed_node, document )
    }
,
'Escape':
  { text : "1x = shrink, 2x = hide this help window",			f : (document) => 
    {
      set_actions_display_mode( Math.max(0, ACTIONS_DISPLAY_MODE - 1) , document);
    }
    ,
    s : 91  // help tools
    ,
    post : () => {}
  }
}

function set_mouse_mode( mode )
{
  MOUSE_MODE = mode;
  console.log( 'Mouse mode is now: "' + MOUSE_MODE_NAMES[ MOUSE_MODE ] + '"' )
}

function set_actions_display_mode( mode, document )
{
  if( document.getElementById( "ktsKeyboardHelp" ) == null )
  {
    console.warn( "Unable to change mode because #ktsKeyboardHelp not initialized." )
    return;
  }

  if( ! (mode > -1) ) mode = 2;  // session storage value is always a string, null -> "null" -> NaN; NaN equals NOTHING !!

  ACTIONS_DISPLAY_MODE = mode;
  console.debug( "KTS action mode set to " + mode + " (" + ACTIONS_DISPLAY_MODE_NAME[ ACTIONS_DISPLAY_MODE ] + ")" );

  switch( mode )
  {
    case 0 :
      // for HTML (also inside SVG):
      apply_display_style( "ktsKeyboardHelp", 'display: none' )
      document.querySelectorAll("#ktsKeyboardHelp span").forEach( n => n.style = "display:none" )
      
      try
      {
        // for SVG only, since the display style is not inherited:
        document.getElementById( "fo0").setAttribute( "display", "none" )
      }
      catch( e ) { }
      
      document.querySelector( "#ktsConsole" ).onclick = () => set_actions_display_mode(1, document);  // click to show again, important for touch device without keyboard

      console.log( "KTS Keys hidden. Click here or type '?' to display them again." )
      break;

    case 1 :
      apply_display_style( "ktsKeyboardHelp", 'display: inline-block' )
      document.querySelectorAll("#ktsKeyboardHelp span").forEach( n => n.style = "display:none" )

      try
      {
        // for SVG only, since the display style is not inherited:
        document.getElementById( "fo0").removeAttribute( "display" )
      }
      catch( e ) { }

      document.querySelector( "#ktsConsole" ).onclick = null;

      console.log( "KTS Keys reduced. Type 'Esc' once more to fully hide keys or type '?' to display help texts again." )
      break;

    case 2 :
      // for HTML (also inside SVG):
      apply_display_style( "ktsKeyboardHelp", 'display: inline-block' )
      document.querySelectorAll("#ktsKeyboardHelp span").forEach( n => n.style = "" )

      try
      {
        // for SVG only, since the display style is not inherited:
        document.getElementById( "fo0").removeAttribute( "display" )
      }
      catch( e ) { }

      document.querySelector( "#ktsConsole" ).onclick = null;

      console.log( "Click a button to execute a KTS command, or type that key on your keyboard." );
      break;
  }

  window.localStorage.setItem( getStorageKey() , mode );
}

// sessionStorage does not group sessions well because FaaS is served from different hosts
function getStorageKey()
{
  let key = window.location.hostname.split('.').splice(-3).join('.') + ":" + "kts_actions_display_mode"
  devdebug( "storage key: " + key )
  return key;
}

function remove_visitor_tags_of_single_node( elm, document )
{
  remove_visitor_tags( elm );
  document.querySelectorAll(  next_edges_selector( elm.id , DIRECTION_SOUTH, true )  ).forEach( (edge) => remove_visitor_tags( edge ) );
  document.querySelectorAll(  next_edges_selector( elm.id , DIRECTION_NORTH, true )  ).forEach( (edge) => remove_visitor_tags( edge ) );
}

function apply_display_style( docElmId, style )
{
  try
  {
    // for HTML:
    document.getElementById( docElmId ).style = style
  }
  catch( e )
  {
    console.error( "document not prepared for help window - render SVG with KTS later then 2023-01-04" )
  }
}

/*
 * recursive function to find the (transitive) parent graph node for a given SVG element
 */
function  findParentGraphNode( svgElm )
{
  if( svgElm.tagName == "g" && ["node","edge"].some( c => svgElm.classList.contains( c ) ) )
    return svgElm;
  let                          parent = svgElm.parentNode;
  if(                          parent == null )
    return                               null;
  return( findParentGraphNode( parent ) );  // (tail) recursive call
}

function press( key, doc )	// shortcut with optional document parameter
{
  return execute_kts_action( new SubDocument(doc), key )
}

function onpress( document, key )	//convenience of shorter function name for HTML documents
{
  return execute_kts_action( document, key )
}
function execute_kts_action( document, key )
{
  try
  {
    console.debug( "entering execute_kts_action() with document.doctype.nodeName: " + document.doctype.nodeName ); // HTML case
  }
  catch( e )
  {
    console.debug( "entering execute_kts_action() in document.childNodes[0].localName: " + document.childNodes[0].localName ); // SVG case
  }

  let ktsFunction = kts_actions[ key ];
  if( !ktsFunction )
  {
    throw( "wrong command - press '?' for help" )
  }

  devdebug( "[" + key + "] received"  )

      ktsFunction["f"]    (document)                // execute the action
  if( ktsFunction["post"] )
    if( typeof ktsFunction["post"] === "function" )
      ktsFunction["post"] (document)                // execute the postfunction
    else
      console.log
    ( ktsFunction["post"]  )                        // log post-action text
  else
      console.log
    ( ktsFunction["text"]  )                        // log action label text

  //document.querySelectorAll( ".yellow_flash" ).forEach(  (action) => action.classList.remove( "yellow_flash" )  )
  //document.querySelector( "#" + action_css_id( key ) ).classList.add( "yellow_flash" )

  filterAllActions( document );
}

function filterAllActions( document )
{
  for (let key in kts_actions)
  {
    let ktsFunction = kts_actions[ key ];
    if( typeof ktsFunction["filter"] === "function" )
    {
      try
      {
      if( ktsFunction["filter"]( document ) )
      {
        document.querySelector( "#" + action_css_id( key ) ).classList.remove("hidden")
        document.querySelector( "#" + action_css_id( key ) + " button" ).disabled = false
      }
      else
      {
        document.querySelector( "#" + action_css_id( key ) ).classList.add("hidden")
        document.querySelector( "#" + action_css_id( key ) + " button" ).disabled = true
      }
      } catch( e ) { /* OK if called for a subdocument, which never contains an Action Help component */ }
    }
  }
}

function action_css_id( key )
{
  if( key.length == 1 )
    return "action_" + key.charCodeAt(0)
  else
    return "action_" + key
}

/*
 * copy the IDs of all selected nodes to the clipboard,
 * separated by the given separator string
 * (e.g. "," or " ")
 */
function copy_selection_to_clipboard( document, separator )
{
  clipText = Array.from(document.querySelectorAll( "g.node[tag1]" )).reduce( (acc,curr) => {return acc + curr.id + separator},"" ).slice(0,-(separator.length))
  navigator.clipboard.writeText( clipText );
}

/*
 * leave the DOM clean by removing all attributes and classes that were added by KTS
 */
function remove_visitor_tags( svgElm )
{
  svgElm.removeAttribute( "tag1"      )
  svgElm.removeAttribute( "tag2"      )
  svgElm.removeAttribute( "colorank"  )
  svgElm.removeAttribute( "distance"  )
  svgElm.classList.remove( "dim"         )
  svgElm.classList.remove( "hover"       )
  svgElm.classList.remove( "logic_stops" )
}

/*
 * the event.target is a lower-level element (one which has visible parts on the screen),
 * typically not a graph node (which is a group of elements, some of them visible)
 */
function add_mouseover_listeners_to_nodes( document )
{
  document.querySelectorAll( "g.node , g.edge" ).forEach
  ( elm =>
  {
    elm.onmouseenter = event => on_focus( elm, event, document );
    /*
    elm.addEventListener
    ( "mouseenter", event => on_focus( elm, event, document ) ,
      { options : { passive : true } }
    );
    */
    elm.onmouseleave = event => on_blur( elm, event, document );
    /*
    elm.addEventListener
    ( "mouseleave", event => on_blur(  elm, event, document ) ,
      { options : { passive : true } }
    );
    */
  }
  )
}

function explore_same_types( elm, event, document, graph_element_class )
{
  let focussed_types = [];
  let   global_types = [];
  elm.classList.forEach
  ( c =>
  {
    if( c.startsWith( CLASS_PREFIX_TYPE        ) ) focussed_types.push( c );
    if( c.startsWith( CLASS_PREFIX_GLOBAL_TYPE ) )   global_types.push( c );
  }
  )
  focussed_types.forEach
  ( focussed_type =>
    document.querySelectorAll( '.' + graph_element_class + '.' + focussed_type ).forEach( n => present_element_as_same( n, is_flash_event, focussed_type ) )
  );
  global_types.forEach
  ( focussed_type =>
  {
    document.querySelectorAll(                        '.node.' + focussed_type ).forEach( n => present_element_as_same( n, is_flash_event, focussed_type ) );
    document.querySelectorAll(                        '.edge.' + focussed_type ).forEach( n =>{present_element_as_same( n, is_flash_event, focussed_type );
    document.querySelectorAll( "#" + n.id.split( NODE_SEPARATOR )[ DIRECTION_NORTH ]  ).forEach( n => present_element_as_same( n, is_flash_event, focussed_type ) );
    document.querySelectorAll( "#" + n.id.split( NODE_SEPARATOR )[ DIRECTION_SOUTH ]  ).forEach( n => present_element_as_same( n, is_flash_event, focussed_type ) );
    }
    );
  });
  filterAllActions( document );
  if( global_types.length == 1 )
  {
    let nodesOfType = document.querySelectorAll( '.node.' + global_types[0] );
    let edgesOfType = document.querySelectorAll( '.edge.' + global_types[0] );
    if
    ( 
      nodesOfType.length > 0
      &&
      nodesOfType.length < 3 // start and optional future
      &&
      edgesOfType.length > 0
    )
    {
      console.log( "showing Timeline of " + node_name_by_id( global_types[0].split( CLASS_PREFIX_GLOBAL_TYPE )[1] ) );
    }
  }
} // end explore_same_types()


/* shortcut and encapsulating the use of "hover" class */
function present_element_as_same( elm, is_flash_event, focussed_type )
{
  //return add_class( elm, "hover", is_flash_event );
  //return add_class( elm, "same", is_flash_event );

  const tag1 = elm.getAttribute( "tag1" );
  if( tag1 && tag1 !== focussed_type )
    set_attribute( elm, "tag2", focussed_type, is_flash_event );
  else
    set_attribute( elm, "tag1", focussed_type, is_flash_event );
}

function on_focus( elm, event, document )
{
  console.info( node_name_by_id( elm.id ) + " now being explored upon " + event + " ..." );
  
  const event_class_name = event?.constructor?.name;
  const mouseclicks = event.detail; // 1 or more for mouse clicks, 0 for other mouse events, undefined for script calls
  
  if( event && mouseclicks > 0 && event.preventDefault ) event.preventDefault(); // don't follow link in case this was a click on a hyperlinked node
  
  is_flash_event = ( event_class_name == "MouseEvent" && mouseclicks == 0 );
  devdebug( "is_flash_event = " + is_flash_event );

  let graph_element_class;

  if( elm.classList.contains( "node" ) )
  {
    focussed_node = elm;
    graph_element_class = "node";
  }

  if( elm.classList.contains( "edge" ) )
  {
    focussed_edge = elm;
    graph_element_class = "edge";
  }

  devdebug( "on_focus() focussed: " + node_name_by_id( elm.id ) );

  switch( MOUSE_MODE)
  {
    case MOUSE_MODE_CAUSALITY:
      if( graph_element_class == "node" )
      {
        explore_causality( focussed_node, event, document );
      }
      break;

    case MOUSE_MODE_SAME:
      explore_same_types( elm, event, document, graph_element_class );
      break;

    case MOUSE_MODE_ONE:
      // implemented by code before switch
      break;

    default:
      console.error( "unknown MOUSE_MODE: " + MOUSE_MODE );
  }
}
function on_blur( elm, event, document )
{
  switch( MOUSE_MODE )
  {
    case MOUSE_MODE_CAUSALITY:
    case MOUSE_MODE_SAME:
      remove_flashes( document );
      filterAllActions( document );
      break;

    case MOUSE_MODE_ONE:
      // nothing to do in case of blur (memorized focus remains)
      break;
    
    default:
      console.error( "unknown MOUSE_MODE: " + MOUSE_MODE );
  }
  focussed_node = null;
  focussed_edge = null;
}

function remove_flashes( document )
{
  devdebug( "remove_flashes()" );

  ["tag1","tag2"].forEach( t =>
  document.querySelectorAll( '.' + t + '_by_flash' ).forEach
  ( n => 
  {
    n.removeAttribute(  t );
    n.classList.remove( t + "_by_flash" );
  }
  )
  );
  document.querySelectorAll( '.hover_by_flash' ).forEach
  ( n => 
  {
    n.classList.remove( "hover" );  // mind that hover is a class, not an attribute!
    n.classList.remove( "hover_by_flash" );
  }
  )
}
    
function generateKeyboardShortcutButtons( document )
{
  const NSPCE_XHTML = "http://www.w3.org/1999/xhtml"
  let doctype;
  try {
    doctype = document.doctype.nodeName;
  }
  catch( e )
  {
    doctype = document.childNodes[0].localName;
  }
  console.debug( "installing KTS tools for " + doctype + " ..." );
  
  try // let the whole procedure fail forgivingly if it is not possible to install the tools
  {

  let ktstools = document.querySelector( "#ktstools" );
  if(!ktstools )
  {
      ktstools = document.createElement("div"); ktstools.setAttribute( "id", "ktstools" );

    let helpParent;
    switch( doctype )
    {
      case "html":
        helpParent = document.querySelector( ".ktscontainer" );
        break;
      case "svg":
        /*
        // following div is necessary for getting on an HTML namespace track, otherwise the SVG namespace is used
        helpParent = document.createElementNS(NSPCE_XHTML, "div");
        
        foreignObject = document.createElement( 'foreignObject' );
        foreignObject.setAttribute( "width",  "100%");
        foreignObject.setAttribute( "height", "100%");
        foreignObject.height= "100%" ;
        foreignObject.appendChild( helpParent );
        document.getRootNode().children[0].appendChild( foreignObject );
        // however I could not get the namespaces right, so I have above DOM written literally in the SVG postprocessor
        */
        helpParent = document.getElementById( "htmldiv" );
        break;
      default: console.error( "unknown document type " + doctype );
    }

    helpParent.appendChild( ktstools );
  }

  let buttonContainer = document.querySelector( "#ktsKeyboardButtons" );
  if(!buttonContainer)
  {
    switch( doctype )
    {
      case "html":
        buttonContainer	= document.createElement( "div" )
        break;
      case "svg":
        buttonContainer	= document.createElementNS( NSPCE_XHTML, "div" )
        break;
      default: console.error( "unknown document type " + doctype );
    }
    buttonContainer.setAttribute( "id", "ktsKeyboardButtons" );
  }

  let keyboardHelpDiv	= document.querySelector( "#ktsKeyboardHelp" );
  if(!keyboardHelpDiv)
  {
      keyboardHelpDiv	= document.createElement("div")
      keyboardHelpDiv.setAttribute( "id", "ktsKeyboardHelp" );
      keyboardHelpDiv.innerHTML = '<h4><span>KTS Keys and </span>Actions</h4>';

      ktstools.appendChild( keyboardHelpDiv )

      keyboardHelpDiv.appendChild( buttonContainer );
      
      // sort kts_actions by value of s(equence) key 
      let kts_actions_sorted = Object.keys(kts_actions).sort( (a,b) => { return kts_actions[a].s - kts_actions[b].s } );
      
      let previous_action_ordinal = null;
      // iterate over sorted action entries
      for( let i = 0; i < kts_actions_sorted.length; i++ )
      {
        let key = kts_actions_sorted[i];
    
        if ( previous_action_ordinal && kts_actions[key].s - previous_action_ordinal > 1 )
          buttonContainer.innerHTML += '<br/>'
    
        buttonContainer.innerHTML +=
          '<p id="' + action_css_id(key) + '"' +
          '>' +
          //kts_actions[key].s + " " + // visual debugging
          '<button onclick="visco.press( \'' + key + '\' )">' + key +
          '</button><span> ' +
          kts_actions[key].text +
          '</span></p>'
    
        previous_action_ordinal = kts_actions[key].s;
      }
  }

  let htmlConsole = document.querySelector( "#ktsConsole" );
  if(!htmlConsole)
  {
      htmlConsole = document.createElement("div"); htmlConsole.setAttribute( "id", "ktsConsole" );
      ktstools.appendChild( htmlConsole );
      htmlConsole.innerHTML = 'KTS Console here...';
  }

  set_actions_display_mode(   parseInt(  window.localStorage.getItem( getStorageKey() )  ), document   );

  }
  catch( e )
  {
    console.error( e.stack );
    console.error( e );
    console.error( "unexpected error with KTS Tools installation" )
  }
}

/*
 * activate the visual mode = traverse the graph by clicking on nodes
 * implemented via onclick event handler on each graph node
 */
function activate_visual_mode()
{
  document.querySelectorAll( "g.node,g.edge" ).forEach( svgElm => { svgElm.onclick = event => {  on_click( svgElm, event )  }   }    )
}
function activate_hyperlink_mode()
{
  document.querySelectorAll( "g.node,g.edge" ).forEach( svgElm => { svgElm.onclick = "" })
}

function isHyperlinkModeActive()
{
  return all_nodes.length > 0 && all_nodes[0].onclick === null
}
function isVisualModeActive()
{
  return all_nodes.length > 0 && ! isHyperlinkModeActive()
}

function hasSelection( document )
{
  return document.querySelectorAll( "g[tag1] , .hover"         ).length > 0
}
function hasSelectionOrIsDimmed( document )
{
  return document.querySelectorAll( "g[tag1] , .hover , g.dim" ).length > 0
}

function hasIntersectingColors( document )
{
  return document.querySelector( "g.node[tag2]" )
}
function hasIntersectionWithFocus( document )
{
  return document.querySelector( "g.node.hover[tag1]" )
}
function hasIntersection( document )
{
  return hasIntersectingColors( document ) || hasIntersectionWithFocus( document )
}


/*
 * from: https://stackoverflow.com/a/30070207
 */
function getParameterByName(name)
{
  let results = getParametersByName(name);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function getParametersByName(name)
{
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  let regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  return regex.exec(location.search);
}

function add_key_listener ( document )
{
  if( document.querySelectorAll( 'svg' ).length == 1 )
  {
      document.querySelector   ( 'svg' ).addEventListener(  "keydown", event => on_keydown( event, document )  );
      devdebug( "added key listener to svg inside " + document?.selector );
  }
/*  else
  {*/
      window                            .addEventListener(  "keydown", on_keydown  );
      devdebug( "added key listener to window" );
/*  }*/
}

function on_keydown(event, doc = document)
{
  devdebug( "on_keydown, event: " + event + ", document: " + doc );
  devdebug( "key event target: " + event.target );

  if (event.defaultPrevented) return;

  let handled = false;
  if (event.key !== undefined)
  {
    NEXT_CLICK_MEMORY = event.key

    if( event.key in kts_actions )
    {
      handled = true
      try
      {
        execute_kts_action( doc, event.key )
      }
      catch( e )
      {
        if( e == "TypeError: panZoomInstance is undefined" )
          console.info( "panZoomInstance is undefined - handling zoom natively");
        else
          console.error( e )
      }
    }
    else
    {
      devdebug( "[" + event.key + "] not implemented as KTS Action" )
    }
  }

  if (handled) {
    //event.preventDefault();
    event.stopPropagation();
  }
}

function execute_url_commands()
{
  execute_command_sequence (  getParameterByName( "exec" )  );

  const highlight = getParameterByName( "highlight" )
  if(   highlight != "" )
  {
    highlight_node( highlight )
  }
}

function execute_command_sequence( command_sequence )
{
  if( command_sequence == "" ) return;
  command_sequence.split( "," ).forEach( (command) => e( command ) )
}

function analyze_graph()
{
  let distances =     Array.from( all_nodes ).map( elm => { let result = {}; result[elm.id] = start_counting( elm , DIRECTION_NORTH ); return result } )    ;
  distances.push( ... Array.from( all_nodes ).map( elm => { let result = {}; result[elm.id] = start_counting( elm , DIRECTION_SOUTH ); return result } )  ) ;
  let sorted_distances = distances.map( o => Object.entries(o) ).sort
  ( (a,b) =>
  {
    let diff =  b[0][1].max_distance_found - a[0][1].max_distance_found;
    if( diff != 0 ) return diff;
    else
      return    a[0][1].n_visited          - b[0][1].n_visited;
  }
  );
  let maximum_longdistance = sorted_distances[0][0][1].max_distance_found;
  let minimum_visits       = sorted_distances[0][0][1].n_visited;
  console.info( all_nodes.length + " nodes in graph, longest path = " + (maximum_longdistance+1) + " with a minimum of " + minimum_visits + " nodes visited" );
  let fundamental_nodes = distances.filter
  ( o =>
    Object.values(o)[0].max_distance_found == maximum_longdistance
    &&
    Object.values(o)[0].n_visited == minimum_visits 
  );
  console.info( "now exploring a random from " + fundamental_nodes.length + " 'fundamental' nodes ... " );

  explore
  (
    Object.keys
    (
      pick_random_element( fundamental_nodes )
    )
    [0] 
  )
  return all_nodes.length;
}

/*
 * will detect multiple diagrams as svg TAGS in the same document
 * will NOT detect svg OBJECTS or iFrames (as in Jira or Observable)
 */
function multiple_kts_diagrams()
{
  return document.querySelectorAll( ".ktscontainer" ).length > 1;
}

function init_pan_zoom( document = globalThis.document )
{
	if( multiple_kts_diagrams() )
  {
    // because the whole document is more likely meant to be a linear document
    // rather than an explorative graph
		devdebug( "no additional control for pan/zoom because multiple diagrams in this body" );
    return;
  }

  if( typeof svgPanZoom === "undefined" )
  {
    console.warn( "svgPanZoom not available to KTS (not imported within scope of this script)" );
    console.warn( "you can try importing it like this: <script src='https://unpkg.com/svg-pan-zoom/dist/svg-pan-zoom.min.js'></script> or <script src='https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.5.0/dist/svg-pan-zoom.min.js'></script>" );
    return;
  }

  panZoomInstance = svgPanZoom  ( 'svg' ); // trying to resize only SVG creates a conflict between DOT's transform and svgPanZoom's transform attribute
    // the goal was "not to zoom" the keyboard help, which is a child of the SVG element
    // however this is only a problem in the stand-alone diagrams. Those in Jira have a separate HTML element for the keyboard help

  let fitZoom = 1.0 / panZoomInstance.getSizes().realZoom;

  if( fitZoom < 1.0 )
  panZoomInstance.zoom      ( fitZoom );
  
  panZoomInstance.setMaxZoom( fitZoom * 2.0 );+

  window.addEventListener( "resize", () => resize_pan_zoom() );
}
function resize_pan_zoom()
{
  panZoomInstance.resize();
  panZoomInstance.fit();
}

class SubDocument
{
  get childNodes()  { return this.document.childNodes;  }
  get doctype()     { return this.document.doctype;     }

  constructor( dom )
  {
    if( dom?.document )
    {
      this.document = dom.document;
      if( document === dom.document )
        devdebug( "SubDocument: passed document is identical with document in scope" )
      else
        devdebug( "Subdocument: passed document is DIFFERENT from document in scope" )
    }
    else
    {
      this.document = document;
      devdebug( "SubDocument: using document from scope" )
    }

    if( dom?.elmSelector )
    {
      this.selector = dom.elmSelector;
      devdebug( "SubDocument using selector: " + this.selector );
    }
    else
    if( typeof dom === "string" )
    {
      if( document.querySelector( dom )?.getSVGDocument )
      {
        this.document = document.querySelector( dom ).getSVGDocument();
        this.selector = "";
        devdebug( "SubDocument: using SVG document from selector " + dom );
      }
      else
      if( document.querySelector( dom ) )
      {
        this.document = document.querySelector( dom );
        this.selector = "";
        devdebug( "SubDocument: using Dom Element " + this.document + " from selector " + dom + " as new document");
      }
      else
      {
        this.selector = dom;
        devdebug( "SubDocument using selector from string: " + dom );
      }
    }
    else
    {
      this.selector = "";
      devdebug( "SubDocument using empty selector." );
    }
  }

  getElementById( id )
  {
    return this.document.getElementById( id );
  }
  querySelector( selector )
  {
    return this.document.querySelector( this.selector + " " + selector );
  }
  querySelectorAll( selector )
  {
    return this.document.querySelectorAll( this.selector + " " + selector );
  }
}

/*
 * backward compatibility
 */
//export function on_svg_load( dom ) { return on_svg_load( dom ) }

/*
 * entry point for HTML/SVG documents upon loading static SVG
 * OR after creating dynamic SVG inside an HTML document
 * which implies that this function may be called multiple times in the lifetime of one HTML document
 */
function on_svg_load( dom, options = {} )
{
  if( document.URL.startsWith("http://localhost") || document.URL.startsWith("file:") ) KTSDEBUG = true;

  const n_containertags = document.querySelectorAll(".ktscontainer").length;
  const n_svgtags = document.querySelectorAll("svg").length;
  const n_svg_in_containertags = document.querySelectorAll(".ktscontainer svg").length;
  devdebug( "on_svg_load() found total of " + n_containertags        + " .ktscontainer tags (empty or not) on document in scope" );
  devdebug( "on_svg_load() found total of " + n_svgtags              + " SVG tags                 on document in scope" );
  devdebug( "on_svg_load() found total of " + n_svg_in_containertags + " SVG inside .ktscontainer on document in scope" );

  const n_nodes_with_global_type = document.querySelectorAll( ".node[class*=global_type_]").length;
  const n_edges_with_global_type = document.querySelectorAll( ".edge[class*=global_type_]").length;
  devdebug( "on_svg_load() found total of " + n_nodes_with_global_type + " + " + n_edges_with_global_type + " nodes + edges with global_type class" );

  if( options?.consider_fullpage ) // e-g- in case of Jira Dashboardgadget we can see only 1-1-1 in iFrame but dont never fullpage
  {
    if( n_containertags == 1 && n_svg_in_containertags == 1 && n_svgtags == 1 )
    {
      document.querySelector(".ktscontainer").classList.add("fullpage");
    }
    else
    {
      // fix a false positive from a previous call when not all tags were rendered
      document.querySelectorAll(".ktscontainer").forEach(  tag => tag.classList.remove("fullpage")  );
    }
  }

  let sd = new SubDocument( dom );

  if( sd.querySelector( "svg" )  )
  {
    // depends on SVG diagram
    all_nodes = sd.querySelectorAll( "g.node" );
    devdebug( "found here " + all_nodes.length + " nodes" );

    devdebug( "adding listeners" );
    add_key_listener( sd );
    add_mouseover_listeners_to_nodes( sd );

    generateKeyboardShortcutButtons( document ); // inside SVG diagram in case of SVG (vs HTML) document
    if( all_nodes.length == 0 )
    {
      execute_kts_action(document,"Escape");
      execute_kts_action(document,"Escape");
      console.log( "This diagram is empty. Try creating issues in Jira so they show up here." ); return null; 
    }
    activate_visual_mode(); // visual mode = on by default

    if( n_nodes_with_global_type && n_edges_with_global_type )
    {
      set_mouse_mode( MOUSE_MODE_SAME );
    }
    
    if( ! execute_url_commands() && ! multiple_kts_diagrams() )
    {
      //analyze_graph();  // moved to kts_actions, so graph analysis can be triggered by user or by URL parameter
    }

    devdebug( "init_pan_zoom()" );
    init_pan_zoom();

    filterAllActions( document ); // filter as late as possible because init actions may change relevant state

    devdebug( "on_svg_load() done." );
  }
  else
  {
    console.info( "no SVG diagram (yet) - skipping KTS on_svg_load()..." )
  }
}

function highlight_node( id )
{
  let node = document.getElementById( id );
  node.classList.add( "hover" );
  console.log( "highlighted node " + id + " - you can reset that with keyboard command [e]");
}

var    _log = console.log;
console.log = function(logMessage)
{
  try
  {
    //let ktsConsole = document.getElementById( "ktsConsole" );

    //ktsConsole.classList.remove( "yellow_flash" )
    //ktsConsole.classList.add( "no_flash" )
    //ktsConsole.offsetHeight; /* trigger reflow */
    //ktsConsole.style.display = "none";

    printToHtmlConsole( logMessage );

    //ktsConsole.style.display = "block";
    //ktsConsole.classList.remove( "no_flash" )
    //ktsConsole.classList.add( "yellow_flash" )
  } catch(e) { /* KTS Console not ready */ }

  _log.apply(console,arguments);
};

function printToHtmlConsole( message )
{
  try
  {
    const htmlConsole = document.getElementById( "ktsConsole" );
    if( htmlConsole )
      htmlConsole.innerHTML = message;
    else
      console.warn( "printToHtmlConsole() called but no element #ktsConsole found" );
  } catch (e) { console.error( "printToHtmlConsole() failed: " + e ); }
}

/*
 * try to parse the Jira summary from DOT's HTML label
 */ 
function getNodeLabelById( id )
{
  try { return document.querySelector( "#" + id + " > g > a > text:nth-child(3)" ).innerHTML }
  catch (e)
  {
    try { return document.querySelector( "#" + id + " > g > a > text:nth-child(2)" ).innerHTML }
    catch (e)
    {
      try { return document.querySelector( "#" + id + " > text:nth-child(3)" ).innerHTML }  // for nodes without links or tables
      catch (e)
      {
        return null
      }
    }
  } 
}

var current_timer_name = null;
function devdebug( message_object, new_timer_name = null )
{
  if( !KTSDEBUG ) return;

  message_object = "KTS " + message_object;

  let c_t_status = (current_timer_name == null ? "current_timer_null" : "current_timer_set_");
  let n_t_status = (    new_timer_name == null ?     "new_timer_null" :     "new_timer_set" );

  let permutation = c_t_status + "__and__" +  n_t_status;

  switch( permutation )
  {
    case "current_timer_null__and__new_timer_null":
      //console.time( "KTS init" );
      reset_timer( "KTS init" );
    case "current_timer_set___and__new_timer_null":
      //reset_timer( "" + message_object);
      break;
    case "current_timer_set___and__new_timer_set":
    case "current_timer_null__and__new_timer_set":
      reset_timer( new_timer_name );
      break;
  }
  console.debug( message_object );
  //console.timeLog( "KTS init"); // unfortunately, this prints to the "log" level, not "debug"
}
globalThis.devdebug = devdebug; // backward compatibility for many existing scripts

function reset_timer( timer_name )
{
  let result = "";

  if( current_timer_name != null )
  {
    console.timeEnd( current_timer_name );
  }

  current_timer_name = timer_name;
  console.time( current_timer_name );
  return result;
}

function pick_random_element( array )
{
  return array[ Math.floor( Math.random() * array.length ) ];
}

// close to END visco

 return {
    devdebug: devdebug
    ,
    on_svg_load: on_svg_load
    ,
    press: press
    ,
    explore: explore
    ,
    set_mouse_mode: set_mouse_mode
    ,
    e : e
    ,
    execute_command_sequence : execute_command_sequence
 }
})()  // END visco

/*
 * browser lifecycle hook
 * and the only expression in this module that is not a function declaration or global variable
 */
try
{
window.addEventListener
( "load",
  (event) =>
  {
    console.debug( "KTS handling load event in document " + document );
    return visco.on_svg_load( {document:document} );
  }
);
} catch(e) { /* most likely outside Browser environment */ }

if (typeof exports !== "undefined")
{
  exports.on_svg_load     = visco.on_svg_load ;
  exports.explore         = visco.explore ;
  exports.press           = visco.press ;
  exports.node_name_by_id = visco.node_name_by_id ;
  exports.execute_command_sequence = visco.execute_command_sequence ;
  exports.e               = visco.e ;
  exports.visco           = visco ;
  visco.devdebug( "exports set" );
}
else
{
  visco.devdebug( "NO exports" );
}

