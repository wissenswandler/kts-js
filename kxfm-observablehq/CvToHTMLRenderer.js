import {  html                } from "htl"
import {  StoryToHTMLRenderer
                              } from "./StoryToHTMLRenderer.js"

import                  markdownit  from "markdown-it"
const markdowner = new  markdownit( {html: true} );


export
class CvToHTMLRenderer extends StoryToHTMLRenderer
{

constructor(  story, diagram_toggles, project_lod )
{
  super(      story, diagram_toggles, project_lod )

  super.dictionary = 
  {
    "OU"    : "Client"                    ,
    "begin" : "Start"                     ,
    "label" :"Project / Product / Topic"  ,
  }
}

/* tag function for customizing the note */
static how_to_read( strings, ... keys )
{
  return how_to_read_note(  strings.reduce( (a, c) => a + keys.shift() + c )  )
}

static get style ()
{
  return html`
<style>

  /* limit the summary card to the width of the photo and give remaining width to the main content */
  div:has( div img ) { grid-template-columns: auto min-content!important }
               img   { width: 210px }

  /* let the content selection buttons use all width, then wrap */
  details form 
  {
    flex-wrap: wrap !important ;
    --input-width: 100% !important ;
  }

</style>
`
}

} // end of class StoryToHTMLRenderer


function md(        strings, ... keys  )
{
  return markdown(  strings.reduce( (a, c) => a + keys.shift() + c )  )   }
function markdown(  string  )
{
  const 
  template = document.createElement( 'template' )
  template.innerHTML = markdowner.render(  string )
  return template.content.cloneNode( true )
}

const how_to_read_note = (this_particular_diagram = "") => md`<details><summary>How to read this CV Diagram</summary>

Like street maps, a CV diagram can be **large**. That's why it works best with a larger screen (pc / laptop). The diagram may tell a story of _epic_ dimension, so it takes some time to read.

All **Lines** in this diagram represent a section of the life of an **entity** (person, company, project), as a chain of **events** over **time**. We could call each entity's timeline its _biography_ or _story_. Similar to a novel, a Timeline diagram may contain a single storyline or it may contain several related stories.

${this_particular_diagram}

**Time** flows from bottom to top. On the diagram's left edge there is a rough indicator of calendar time. Not all events in the diagram are precisely aligned with a calendar date, and the time axis is certainly not proportional.

An entity's timeline typically begins with the **_entity's name_** and ends in a dotted line with an **_ending arrow_**. People's timelines always begin with the name in a rounded box. Other entities may carry a type icon in front of their name (like 🇩🇰 for the country of Denmark or ⛵ for a sailing vessel).

A CV diagram shows 4 different types of information:

* People
* Client Organizations and Schools (with an office building icon 🏢 in front)
* Skills (be it in methods or products, may have specific icons like 🔧 , ☕ ... in front of them)
* Projects

**People** and **Organizations** (clients, schools) are shown as dashed timelines, with **Events** along their way.

**Skills** are shown as dotted timelines (because they can be dormant between events of activiation / use).

**Projects** are presented as a textbox (description) near the start date, and a solid dark-grey line leading to a finish-flag 🏁, near the end date. If the project was relatively short (a month or less) then it may have no separate end date. It will only show up with its descriptive text box.

Project descriptions can be shortened to the project title with the "☑ summary only" checkbox. This is useful to get an overview in complex CVs.

Entity timelines are assigned random colors. Each timeline is interactive: clicking on it will highlight the whole timeline and each event on its path.

### Events

An event is always part of at least one Timeline. It may intersect several Timelines. This happens when people meet people, people join organizations (perhaps temporarily), when people or organizations initiate or terminate a project, when people apply skills (because projects require skills).

An event may happen at a specific or unspecified time. If the the event has a specific date, then this date will be part of the vertical timescale (right-hand side of the diagram). Clicking an event will also display its date. Vice versa: clicking a date in the timescale will display all events that occur on this date. 

Underlined events show a "tooltip" with more explanation when hovering with your mouse _(not available on smartphones or other touch devices without a mouse)_.

### Interaction

Timeline diagrams are **interactive** (unless you are looking at a PDF version, which is mostly static). You can hover with your mouse cursor (on a pc) over any **_entity name_**, **_ending arrow_**, **_connecting lines_** or some **_events_** (no mouse-click needed). Hovering will highlight exactly this one entity's timeline. The console box (typically in the diagram's lower left corner, or detached) will show the entity's name.

In addition, you can click on the active elements to make the highlight more permanent. This way, you can click on more than one entity and explore those events which are shared by these entities.

_Hovering is not available on touch devices (lacking a pointing device such as a mouse), but you can always click (brief touch) on those devices._

Another form of interaction is to reduce or extend the CV diagram by selecting less or more (skills / products / organizations) in the ***Show Entities (lines)*** section. Chances are that you have received a link (or PDF) which already contained an initial selection of entities. From there, you can further customize the CV to show more or less details (except in PDF). Some potentially interesting presets are listed on top of the diagram, in the sections ***visual styles*** and ***skill-based profiles***.

### Generative

Timeline diagrams are automatically generated (in this case by KTS). This is needed for interactive features. Generating the diagram from structured data simplifies editing and extending large diagrams.

</details>`
