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
const NODE_SEPARATOR	= "___"

const DIRECTION_NORTH	= 1	// constant to indicate direction of travel, going "up" or "North"
const DIRECTION_SOUTH	= 0	// constant to indicate direction of travel, going "down" or "South"
const DIRECTION_BOTH  = 2	// constant to indicate direction of travel, going "both" ways

const DIRSTRING		= ['South', 'North']	// textual representation of direction
const REASONING		= ['Dependency', 'Impact']	// textual representation of direction

const MISSION_ERASE	= "MISSION_ERASE"
const MISSION_COUNT = "MISSION_COUNT"

const ACTIONS_DISPLAY_MODE_NAME = ["collapsed", "reduced", "full"]
var   ACTIONS_DISPLAY_MODE = ACTIONS_DISPLAY_MODE_NAME.length - 1;

var NEXT_CLICK_MEMORY		= false
var NEXT_CLICK_DIRECTION	= -1

var id
var visited
var focussed
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
    click( elm );
    return;
  }

  throw( "don't know how to execute statement ==>" + symbol + "<==" );
}

/*
 * shortcut function for conclick
 */
function click( elm ) { return onclick( document, elm, null ) }

/*
 * KTS response on a click: traverse the graph and present that path by coloring the nodes and edges
 *
 * count max distances from clicked node both ways (north and south),
 * then travel the longer path because that is more interesting
 */
function onclick( document, elm, event )
{
 console.debug( "entering via click event in document.doctype.nodeName: " + document.doctype.nodeName );

  if( typeof elm === 'string' )
  {
    id = elm;
    console.debug( "converting ID " + id + " string to document element" )
    elm = document.getElementById( id )
    if( !elm )
    {
      console.error( "cannot find element with id " + id ); 
      return
    }
  }
  id = elm.id
  focussed = elm

 console.info( node_name_by_id( id ) );

 if( event ) event.preventDefault()

 if( NEXT_CLICK_MEMORY == 'R' )
 {
  remove_visitor_tags_of_single_node( elm, document ) 
  NEXT_CLICK_MEMORY = false; return
 }

 var myTags = [	calculate_travel_tag( id, DIRECTION_SOUTH ) ,
 		calculate_travel_tag( id, DIRECTION_NORTH ) ]

 let max_distance = Array.from(  [0,1], dir => start_travel( document, elm , [0,0], dir, MISSION_COUNT )  )

 if( max_distance[0] + max_distance[1] == 0 ) { console.info("no neighbors"); return }

 var visitorTags = [ elm.getAttribute( "tag1" ), elm.getAttribute( "tag2" )]

 if( NEXT_CLICK_DIRECTION > -1 )		// explicit wish
 {
  if( NEXT_CLICK_DIRECTION == DIRECTION_BOTH )
  {
    start_travel_both_ways ( document, elm , max_distance );
  }
  else
    start_travel ( document, elm , max_distance , NEXT_CLICK_DIRECTION )
 }
 else
 if( max_distance[0] == max_distance[1] )
 {
  console.info( "equal path lengths North and South" )
  if( visitorTags.includes( myTags[ 0 ] )  	// been there
   && visitorTags.includes( myTags[ 1 ] ) ) 	// been the other way, too
  {
    console.info( "cleaning up" )
    erase_both_ways( document, elm , max_distance )
  }
  else //follow both
  {
    start_travel_both_ways ( document, elm , max_distance );
  }
 }
 else // paths are not equally long
 {
    let direction = max_distance[0] > max_distance[1] ? 0 : 1	// direction of the longer path

    if(   visitorTags.includes( myTags[    direction ] )  )	// been there
    {
      if( visitorTags.includes( myTags[ 1- direction ] )  	// been the other way, too ...
	  ||
	  max_distance[ 1- direction ] == 0			// no reverse path
       )
        erase_both_ways( document, elm, max_distance )			// ... reverse not an option
      else
        start_travel ( document, elm , max_distance , 1- direction)	// travel reversed direction
    }
    else
        start_travel ( document, elm , max_distance ,    direction)	// travel direction of longer, untravelled path
 }
 NEXT_CLICK_DIRECTION = -1
  
  filterAllActions( document );
}

function calculate_travel_tag( id, direction )
{
 return id + "-going-" + direction
}

function erase_both_ways( document, elm , max_distance )
{
  start_travel ( document, elm , max_distance , DIRECTION_SOUTH, MISSION_ERASE )

  elm.setAttribute( "tag1", "dummy" ) // set dummy tag so that next travel does not terminate on already cleared node

  start_travel ( document, elm , max_distance , DIRECTION_NORTH, MISSION_ERASE )

  console.log( "erasing " + REASONING[DIRECTION_NORTH] + " and " + REASONING[DIRECTION_SOUTH] + " of " + node_name_by_id( elm.id ) )
}

function start_travel_both_ways( document, elm , max_distance )
{
  start_travel ( document, elm , max_distance , DIRECTION_SOUTH );
  start_travel ( document, elm , max_distance , DIRECTION_NORTH );
  console.log( "showing " + REASONING[DIRECTION_NORTH] + " and " + REASONING[DIRECTION_SOUTH] + " of " + node_name_by_id( elm.id ) )
}

function node_name_by_id( id )
{
  let label = getNodeLabelById( id );
  return (label && label != id )  ? ( '"' + label + '" [' + id +']' ) : '"' + id + '"' ;
}


function start_travel( document, elm , max_distance, direction, mission = calculate_travel_tag( id , direction ) )
{
  visited = 0
  console.debug( "going " + DIRSTRING [ direction ] + " for max " + max_distance[ direction ] + " steps" + ( mission ? (" on mission " + mission ) : "..." )  )

  document.querySelectorAll( "[distance]"  ).forEach(   (svgElm) => {  svgElm.removeAttribute( "distance" )  }   ) 

  let dist = travel_node( document,	elm , 0 ,
    direction == DIRECTION_SOUTH ? 0 : max_distance[DIRECTION_NORTH] ,
    max_distance[direction]+1 ,
    direction,
    mission
  ) 

  let logtext = "visited " + visited + " nodes with max distance of " + dist + " between";
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

  return dist
}

/*
 * recursive coloring travel, node hop
 */
function travel_node( document, elm , current_dist, current_rank , total_ranks , direction , tag )
{
 ++visited; // console.log( "  entering n " + elm.id + " at d: " + current_dist + ", r: " + current_rank + " of " + total_ranks )
 if(  set_visitor_tags( elm , current_dist, current_rank , total_ranks , direction , tag )  )
 {
  let edges = document.querySelectorAll(  next_edges_selector( elm.id , direction )  )
  if( edges.length == 0 ) return 0 // terminate recursion and 'count' this node
  else
  // recurse and increment color rank IF travelling South (color rank decreases from edge to next node, in positive flow direction)
  return Math.max(   ... Array.from(  edges, edge => travel_edge( document, edge , current_dist, current_rank + 1 - direction , total_ranks , direction , tag )
  )   )
 }
 else return -1 // terminate recursion and undo count of this node (it gets added by the previous travel_edge on call stack)
}

/*
 * recursive coloring travel, edge hop, adding 1 to recursive distance _assuming_ that the folowing node 'counts'
 */
function travel_edge( document, elm , current_dist, current_rank , total_ranks , direction , tag )
{
 // console.log( "  entering e " + elm.id + " at d: " + current_dist + ", r: " + current_rank + " of " + total_ranks )

 if( document.querySelector( '[id^="' + elm.id + '"] > g > a > path[stroke-dasharray]' ) ) return 0

 set_visitor_tags( elm , current_dist, current_rank , total_ranks , direction , tag ) 

 // recurse and decrement color rank IF travelling North (color rank decreases from edge to next node, in positive flow direction)
 return 1 + travel_node(   document,
                       document.getElementById(  elm.id.split( NODE_SEPARATOR )[ direction ]  ),
                       1+current_dist, current_rank - direction , total_ranks , direction , tag   )
}

/*
 * mark node as visited and return whether recursion should continue from here
 */
function set_visitor_tags( elm , current_dist, current_rank , total_ranks , direction , tag )
{
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
 
 let g_a_text = elm.querySelector( "g a text" )
 let isLogicalAndNode =
     g_a_text &&
     g_a_text.innerHTML == "∧"

 let isActivated = true

 if( isLogicalAndNode )
 {
  let nIncomingEdges  = document.querySelectorAll(  next_edges_selector( elm.id , DIRECTION_SOUTH, false )  ).length
  let nActivatedEdges = document.querySelectorAll(  next_edges_selector( elm.id , DIRECTION_SOUTH, true  )  ).length
  isActivated = nIncomingEdges == nActivatedEdges
 }

 let seenBefore = elm.hasAttribute( "distance"	)	// been here before

 let distance = + elm.getAttribute( "distance"	)

 if( distance > current_dist				// previous visit through a longer path than current visit
     ||							// OR
     ! seenBefore				)	// first time here
 {
   elm.setAttribute( "distance", current_dist );

   if( tag != MISSION_COUNT )				// tagging, not counting
   {
     if(  ! elm.hasAttribute( "tag1" ) || distance > current_dist  )
            elm.setAttribute( "tag1", tag )
     else
         elm.setAttribute( "tag2", tag )

         elm.classList.remove( "dim" )

         elm.setAttribute( "colorank",
			    total_ranks > 9		// largest brewer scheme
			    ?
			    Math.round( 1.0 * current_rank / total_ranks * 9) + "-9"
			    :
			                      current_rank                    + "-" + total_ranks )
   }
   return isActivated
 }
 //console.info( "   terminating travel at current d = " + current_dist )
 return false
}

function next_edges_selector( id, direction, tagged = false )
{
 if( direction == DIRECTION_NORTH )
 {
   return '[id^="' +                  id + NODE_SEPARATOR +
   '"]' 
 }
 if( direction == DIRECTION_SOUTH )
 {
   return '[id$="' + NODE_SEPARATOR + id +
   '"]' + (tagged ? '[tag1]' : '') + ':not( [id^="a_"] )'
 }
 return "error - unknown direction code"
}


const kts_actions = {

B : { f : () =>
      {
        NEXT_CLICK_DIRECTION = DIRECTION_BOTH
      },
      s : 16
      ,
      filter : () => all_nodes.length > 0
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
e : { text : "[e]rase all color markup",
      f : (document) =>
      {
	// cleanup tagged nodes
        document.querySelectorAll( "g"  ).forEach( (svgElm) => { remove_visitor_tags( svgElm    ) })
	// also un-dim dimmed nodes
        document.querySelectorAll( "g"    ).forEach( (svgElm) => { svgElm.classList.remove( "dim","hover","underline" ) })
      },
      s : 31  // with selection
      ,
      filter : (document) => hasSelection( document )
      ,
      post : () =>
      {
        let message = "Erased all color markup.";
        if( isVisualModeActive() ) message += " Click on any node to explore the diagram, if you like."
        console.log( message );
      }
    }
,
// key 'f' also captures CTRL-F in chrome, so no more find-in-page possible
F : { f : function(document)
      {
        document.querySelectorAll( "g.edge:not([tag1]), g.node:not([tag1]), g.cluster" ).forEach( (svgElm) => { svgElm.classList.add( "dim" ) })
        document.querySelectorAll( "g[tag1]"       ).forEach( (svgElm) => { remove_visitor_tags( svgElm ) })
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
      s : 11
      ,
      filter : () => isVisualModeActive()
      ,
      post : "Hyperlink mode activated. ( CTRL- ) Click on any node for navigating to its data source."
    }
,
i : { text : "keep [i]ntersecting paths (clear the rest) = inverse of [o]",		f : (document) =>
    {
      var intersection = document.querySelectorAll( "g[tag2]" )
      if( intersection.length > 0 )
      {
       document.querySelectorAll( "g[tag1]:not([tag2])" ).forEach( (svgElm) => { svgElm.removeAttribute( "tag1" ) })
       console.log( " all but intersection cleared - you can [m]erge to turn the former intersection from blue to orange")
      }
      else console.log( " currently no intersecting paths")
    }
      ,
      s : 40
      ,
      filter : (document) => hasIntersection( document )
      ,
      post : "keeping intersecting paths"
    }
,
j : { text : "concentrate on intersection (= shortcut for [i] + [F] )",		f : function(document)
    {
      execute_keyboard_function( document, "i" )
      execute_keyboard_function( document, "F" )
      }
      ,
      s : 41
      ,
      filter : (document) => hasIntersection( document )
      ,
      post : "Concentrating on intersecting paths"
    }
,
l : { text : "[l]ist of selected nodes (use [,] and [ ] to put on clipboard)",
      f : document => document.querySelectorAll( "g.node[tag1]" ).forEach( (svgElm) => { console.log( svgElm.id ) })
      ,
      s : 33
      ,
      filter : (document) => hasSelection( document )
      ,
      post : () => {} // prevent previous console.log from being overwritten
    }
,
m : { text : "[m]erge path intersections", 				f : function(document)
    {
      document.querySelectorAll( "g[tag2]" ).forEach( (svgElm) => { svgElm.removeAttribute( "tag2" ) })
      }
      ,
      s : 42
      ,
      filter : (document) => hasIntersection( document )
      ,
      post : "Selection paths merged with intersection."
    }
,
N : { text : "travel [N]orth (forward) direction upon next CLICK (= inverse of [S])", 	f : () => NEXT_CLICK_DIRECTION = DIRECTION_NORTH
      ,
      s : 15
      ,
      filter : () => all_nodes.length > 0
    }
,
o : { text : "keep [o]utersection (clear intersection) = inverse of [i]",		f : (document) =>
        document.querySelectorAll("g[tag2]").forEach((svgElm) => { remove_visitor_tags(svgElm) })
      ,
      s : 43 // with intersection
      ,
      filter : (document) => hasIntersection( document )
      ,
      post : "Intersection removed from selection."
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
      filter : () => all_nodes.length > 0
    }
,
U : { text : "copy [U]rl of focussed node to clipboard",		f : function(document)
      {
        clipText = document.querySelector( "#" + focussed.id + " g a" ).getAttribute( "xlink:href" ); 
        console.info( "focussed.id: " + focussed.id + " with url: " + clipText );
        navigator.clipboard.writeText( clipText );
      }
      ,
      s:71
      ,
      filter : () => focussed && document.querySelector( "#" + focussed.id + " g a" ).getAttribute( "xlink:href" )
      ,
      post : () => console.log( '"' + clipText + '" is now on system clipboard' )
    }
,
v : { text : "activating [v]isual mode (= inverse of [h])",	f : (document) => activate_visual_mode(document)
      ,
      s : 10
      ,
      filter : () => isHyperlinkModeActive()
      ,
      post : "Visual mode activated. Click on any node to explore the diagram, if you like."
    }
,
y : { text : "[y]ank (copy) ID of focussed node to clipboard",
      f : function(document)
      {
        console.info( "focussed.id: " + focussed.id );
        navigator.clipboard.writeText( focussed.id );
      }
      ,
      s:70
      ,
      filter : () => focussed != null
      ,
      post : () => console.log( '"' + focussed.id + '" is now on system clipboard' )
    }
,
',':{ text : "copy selection to clipboard, separated by [,] (comma)",
      f : (document) => copy_selection_to_clipboard( document, ',' )
      ,
      s : 25 // with selection
      ,
      filter : (document) => hasSelection( document )
      ,
      post : () => console.log( '"' + clipText + '" is now on system clipboard' )
    }
,
' ':{ text : "[SPACE] copy selection to clipboard, separated by [ ] (space)",
      f : (document) => copy_selection_to_clipboard( document, ' ' )
      ,
      s : 26 // with selection
      ,
      filter : (document) => hasSelection( document )
      ,
      post : () => console.log( '"' + clipText + '" is now on system clipboard' )
    }
,
'+':{ text : "zoom in",						f : () => panZoomInstance.zoomIn(), s : 1, post : () => {}
      ,
      filter : () => all_nodes.length > 0 && panZoomInstance
    }
,
'0':{ text : "reset (center) pan, zoom",
      filter : () => all_nodes.length > 0 && panZoomInstance
      ,
      f : () => panZoomInstance.reset()
      ,
      s : 2
      ,
      post : () => console.log( "diagram is now centered and scaled to fit" )
    }
,
'-':{ text : "zoom out",						f : () => panZoomInstance.zoomOut(), s : 3, post : () => {}
      ,
      filter : () => all_nodes.length > 0 && panZoomInstance
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
      filter : (document) => focussed && document.querySelector( "#" + focussed.id + "[tag1]" ) // focussed element is part of selection
      ,
      text : "Delete focussed node from selection."
      ,
      f : (document) => remove_visitor_tags_of_single_node( focussed, document )
    }
,
'Escape':
  { text : "1x = shrink, 2x = hide this help window",			f : (document) => 
    {
      set_actions_display_mode( (ACTIONS_DISPLAY_MODE_NAME.length + ACTIONS_DISPLAY_MODE - 1) % ACTIONS_DISPLAY_MODE_NAME.length , document);
    }
    ,
    s : 91  // help tools
    ,
    post : () => {}
  }
}

function set_actions_display_mode( mode, document )
{
  if( document.getElementById( "ktsKeyboardHelp" ) == null )
  {
    console.debug( "Unable to change mode because KTS Keys not initialized." )
    return;
  }

  console.log( "mode: " + mode )
  if( ! (mode > -1) ) mode = 2;  // session storage value is always a string, null -> "null" -> NaN; NaN equals NOTHING !!

  ACTIONS_DISPLAY_MODE = mode;
  console.log( "KTS action mode set to " + mode + " (" + ACTIONS_DISPLAY_MODE_NAME[ ACTIONS_DISPLAY_MODE ] + ")" );

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
      
      console.log( "KTS Keys hidden. Type '?' to display them again." )
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
function findParentGraphNode( svgElm )
{
  if( svgElm.tagName == "g" && svgElm.classList.contains( "node" ) )
  {
    return svgElm;
  }
  return( findParentGraphNode( svgElm.parentNode ) );
}

function press( key )	// shortcut without document parameter
{
  return execute_keyboard_function( document, key )
}

function onpress( document, key )	//convenience of shorter function name for HTML documents
{
  return execute_keyboard_function( document, key )
}
function execute_keyboard_function( document, key )
{
  try{
    console.debug( "entering via keyboard event in document.doctype.nodeName: " + document.doctype.nodeName );
  }
  catch( e )
  {
    console.debug( "entering via keyboard event in document.childNodes[0].localName: " + document.childNodes[0].localName );
  }

  let ktsFunction = kts_actions[ key ];
  if( !ktsFunction )
  {
    throw( "wrong command - press '?' for help" )
  }

  devdebug( key )

      ktsFunction["f"]    (document)
  if( ktsFunction["post"] )
    if( typeof ktsFunction["post"] === "function" )
      ktsFunction["post"] (document)
    else
      console.log
      ( ktsFunction["post"]  )
  else
      console.log
      ( ktsFunction["text"]  )

  //document.querySelectorAll( ".yellow_flash" ).forEach(  (action) => action.classList.remove( "yellow_flash" )  )
  //document.querySelector( "#" + action_css_id( key ) ).classList.add( "yellow_flash" )

  filterAllActions( document );
}

function filterAllActions( document )
{
  devdebug( "filterAllActions()" )
  //console.debug( "KTS stack: " + new Error("dummy").stack );

  for (let key in kts_actions)
  {
    let ktsFunction = kts_actions[ key ];
    if( typeof ktsFunction["filter"] === "function" )
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
    }
  }
  devdebug( "filterAllActions() done." )
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
  svgElm.removeAttribute( "tag1"		)
  svgElm.removeAttribute( "tag2"		)
  svgElm.removeAttribute( "colorank"	)
  svgElm.removeAttribute( "distance"	)
  svgElm.classList.remove( "dim"		)
}

/*
 * the event.target is a lower-level element (one which has visible parts on the screen),
 * typically not a graph node (which is a group of elements, some of them visible)
 */
function add_mouseover_listeners_to_nodes( document )
{
  document.querySelectorAll( "g.node" ).forEach
  ( (e) =>
  {
    e.addEventListener
    ( "mouseover", (event) => on_node_focus( event ) ),
    { options : { passive : true } }
  }
  )
}

function on_node_focus( event )
{
  focussed = findParentGraphNode( event.target ) ;
  console.debug( "focussed.id: " + focussed.id );
  filterAllActions( document );
}
    
function generateKeyboardShortcutButtons( document )
{
  if( document.querySelector( "#ktstools" ) ) return; // already generated, potentially from a previous SVG

  const NSPCE_XHTML = "http://www.w3.org/1999/xhtml"
  let doctype;
  try {
    doctype = document.doctype.nodeName;
  }
  catch( e )
  {
    doctype = document.childNodes[0].localName;
  }

  console.debug( "generating KeyboardShortcutButtons for " + doctype + " ..." );

  let helpParent;
  let buttonContainer;
  switch( doctype )
  {
  case "html":
    helpParent = document.querySelector( ".ktscontainer" );
    buttonContainer	= document.createElement( "div" )
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
    // however I could not get the namespaces right, so I have above DOM written in the SVG postprocessor
    */
    helpParent = document.getElementById( "htmldiv" );
    buttonContainer	= document.createElementNS( NSPCE_XHTML, "div" )
    break;
  }
      
  let ktsDiv	        		= document.createElement("div")
  let keyboardHelpDiv			= document.createElement("div")

  try
  {
    helpParent.appendChild( ktsDiv )
    ktsDiv.setAttribute( "id", "ktstools" );
    ktsDiv.appendChild( keyboardHelpDiv )
    keyboardHelpDiv.setAttribute( "id", "ktsKeyboardHelp" );
    keyboardHelpDiv.innerHTML = '<h4><span>KTS Keys and </span>Actions</h4>';
    keyboardHelpDiv.appendChild( buttonContainer );

    buttonContainer.setAttribute( "id", "ktsKeyboardButtons" );

    // sort kts_actions by value of s(equence) key 
    let kts_actions_sorted = Object.keys(kts_actions).sort( (a,b) => { return kts_actions[a].s > kts_actions[b].s } );

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
        '<button onclick="press( \'' + key + '\' )">' + key +
        '</button><span> ' +
        kts_actions[key].text +
        '</span></p>'

      previous_action_ordinal = kts_actions[key].s;
    }

    let htmlConsole = document.createElement("div");
    ktsDiv.appendChild( htmlConsole );
    htmlConsole.setAttribute( "id", "ktsConsole" );
    htmlConsole.innerHTML = 'KTS Console here...';

    set_actions_display_mode(   parseInt(  window.localStorage.getItem( getStorageKey() )  ), document   );
  }
  catch( e )
  {
    console.error( e.stack );
    console.error( "document not prepared for help window - render SVG with KTS later then 2023-01-04" )
  }
}

/*
 * activate the visual mode = traverse the graph by clicking on nodes
 * implemented via onclick event handler on each graph node
 */
function activate_visual_mode(document)
{
 document.querySelectorAll( "g.node" ).forEach(    (svgElm) => {   svgElm.onclick = (event) => { onclick(document, svgElm, event) }   }    )
}

function activate_hyperlink_mode(document)
{
  document.querySelectorAll( "g.node" ).forEach( (svgElm) => { svgElm.onclick = "" })
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
  return document.querySelectorAll( "g.node[tag1]" ).length > 0
}

function hasIntersection( document )
{
  return document.querySelectorAll( "g.node[tag2]" ).length > 0
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

function add_key_listener ()
{
//  document.querySelector( 'svg' ).
  window.
  addEventListener("keydown", on_keydown, true);
}

function on_keydown(event)
{
  if (event.defaultPrevented) {
    return; // Should do nothing if the default action has been cancelled
  }

  let handled = false;
  if (event.key !== undefined)
  {
    NEXT_CLICK_MEMORY = event.key

    if( event.key in kts_actions )
    {
      execute_keyboard_function( document, event.key )
      handled = true
    }
    else
    {
      console.debug( event.key )
    }
  }

  if (handled) {
    // Suppress "double action" if event handled
    event.preventDefault();
  }
}

function execute_url_command()
{
  let auto_execute_command  = getParameterByName( "exec" )
  if( auto_execute_command == "" ) return false;

      auto_execute_command.split( "," ).forEach( (command) => e( command ) )

  const highlight = getParameterByName( "highlight" )
  if(   highlight != "" )
  {
    highlight_node( highlight )
  }
  return true;
}

function analyze_graph()
{
  let distances =     Array.from( all_nodes ).map( (elm) => { let result = {}; result[elm.id] = start_travel( document, elm , [0,0], DIRECTION_NORTH, MISSION_COUNT); return result } )    ;
  distances.push( ... Array.from( all_nodes ).map( (elm) => { let result = {}; result[elm.id] = start_travel( document, elm , [0,0], DIRECTION_SOUTH, MISSION_COUNT); return result } )  ) ;
  let sorted_distances = distances.map( (o) => Object.entries(o) ).sort( (a,b) => b[0][1] - a[0][1] );
  let maximum_longdistance = sorted_distances[0][0][1];
  console.info( distances.length + " nodes in graph, longest path = " + (maximum_longdistance+1) );
  console.info( "now highlighting a random 'fundamental' node ... " );
  let fundamental_nodes = distances.filter( (o) => Object.values(o)[0] == maximum_longdistance )

  // select a random element from the fundamental nodes [Copilot]
  if( true )
    click
    (
      Object.keys
      (
        fundamental_nodes[ Math.floor( Math.random() * fundamental_nodes.length ) ] 
      )
      [0] 
    )
  else // highlighting all longest paths tends to be too much for most diagrams (majority of nodes colored, which is the opposite of the highlighting what we want to achieve) fundamental_nodes.forEach
  ( (o) => 
    {
      click 
      ( 
        Object.keys 
        (
          o
        )
        [0] 
      )
    }
  );
  return all_nodes.length;
}

function multiple_kts_diagrams()
{
  return document.querySelectorAll( ".ktscontainer" ).length > 1;
}

function init_pan_zoom( document )
{
	if( multiple_kts_diagrams() )
  {
    // because the whole document is more likely meant to be a linear document
    // rather than an explorative graph
		devdebug( "no additional control for pan/zoom because multiple diagrams in this body" );
    return;
  }

  panZoomInstance = svgPanZoom  ( 'svg' ); // tryping to resize only SVG creates a conflict between DOT's transform and svgPanZoom's transform attribute
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

function on_svg_load ()
{
  if( document.querySelector( 'svg' ) )
  {
    // depends on SVG diagram
    all_nodes = document.querySelectorAll( "g.node" );

    devdebug( "adding listeners" );
    add_key_listener();
    add_mouseover_listeners_to_nodes( document );

    generateKeyboardShortcutButtons( document ); // inside SVG diagram in case of SVG (vs HTML) document
    if( all_nodes.length == 0 )
    {
      execute_keyboard_function(document,"Escape");
      execute_keyboard_function(document,"Escape");
      console.log( "This diagram is empty. Try creating issues in Jira so they show up here." ); return null; 
    }
    execute_keyboard_function( document, "v" );  // visual mode = on by default

    if( ! execute_url_command() && ! multiple_kts_diagrams() )
    {
      devdebug( "analyzing graph" );
      analyze_graph();
    }

    devdebug( "init_pan_zoom()" );
    init_pan_zoom();

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

/*
 * browser lifecycle actions
 */

window.addEventListener(  "load", (event) => on_svg_load( event )  );

var _log = console.log;
var _error = console.error;
var _warning = console.warning;

console.error = function(errMessage){
  _error.apply(console,arguments);
};

console.log = function(logMessage)
{
  try
  {
    let ktsConsole = document.getElementById( "ktsConsole" );

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

console.warning = function(warnMessage){
  _warning.apply(console,arguments);
};

function printToHtmlConsole( message )
{
  try
  {
    htmlConsole = document.getElementById( "ktsConsole" );
    htmlConsole.innerHTML = message;
  } catch (e) {}
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
    catch (e) { return null }
  } 
}

var current_timer_name = null;
function devdebug( message_object, new_timer_name = null )
{
  message_object = "KTS " + message_object;

  let c_t_status = (current_timer_name == null ? "current_timer_null" : "current_timer_set_");
  let n_t_status = (    new_timer_name == null ?     "new_timer_null" :     "new_timer_set" );

  let permutation = c_t_status + "__and__" +  n_t_status;

  switch( permutation )
  {
    case "current_timer_null__and__new_timer_null":
      console.time( "KTS init" );
    case "current_timer_set___and__new_timer_null":
      reset_timer( "" + message_object);
      break;
    case "current_timer_set___and__new_timer_set":
    case "current_timer_null__and__new_timer_set":
      reset_timer( new_timer_name );
      break;
  }
  console.debug( message_object );
  console.timeLog( "KTS init"); // unfortunately, this prints to the "log" level, not "debug"
}

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