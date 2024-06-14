```js
title = md`# CV Template`
```

## Curriculum Vitae as a Timeline diagram
- can be filtered by certain skills or customers
- contains tabular view as a bonus

```js
bookmark_current
```

```js
viewof selected_entities = create_grouped_input( entity_timelines, htl.html`select<span class="printonly">ed</span> CV elements, grouped by type...`, keep_types( ["skill"] )  )
```

```js
tab_cv = tabular_view( ["client","skill"], ["Client","Skills"] )
```

```js
diagram = dot2svg(  dot_string, { fit : false }  );
```

```js
kts_console
```

- - -
## Appendix

```js
notes = 
htl.html`<details><summary><h2>How to read a CV Diagram</h2></summary>
${md`
Like street maps, a CV diagram can be **large**. That's why it works best with a larger screen (pc / laptop). The diagram may tell a story of _epic_ dimension, so it takes some time to read.

All **Lines** in this diagram represent a section of the life of an **entity** (person, company, project), as a chain of **events** over **time**. We could call each entity's timeline its _biography_ or _story_. Similar to a novel, a Timeline diagram may contain a single storyline or it may contain several related stories.

_${this_particular_diagram}_

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

Timeline diagrams are automatically generated (in this case by KTS). This is needed for interactive features. Generating the diagram from structured data simplifies editing and extending large diagrams.`
}
`
```

- - -
- - -

### textual definition of story + event details

```js
story = transform_paragraphs_to_lines (`

Boran
Istanbul_1969
GymnasticsCoach_1987
Cybertennis_1996 
ITILServiceManager_2003 ITILv3Expert_2007 QualityClimbingSession1_2011_05
ParaglidingPilot_2013_06  ClimbingInstructor_2014_05  QualityClimbingSession2_2014_08 PassengerPermit_2015_08 ParaglidingInstructor_2017_11 TandemPilot_2020_07
PerpetualTraveller_2022_05 - person

#
# standards + product skills
#

Paragliding
ParaglidingPilot_2013_06 PassengerPermit_2015_08 ParaglidingInstructor_2017_11 TandemPilot_2020_07 - "labelPrefix":"🪂","rdfType":"skill","edge":"style=dotted"

Coaching
GymnasticsCoach_1987 ITILServiceManager_2003 ITILv3Expert_2007 QualityClimbingSession1_2011_05 ClimbingInstructor_2014_05 QualityClimbingSession2_2014_08 ParaglidingInstructor_2017_11 TandemPilot_2020_07 - "edge":"style=dotted","labelPrefix":"🔧","rdfType":"skill"

CDK
Cybertennis_1996 - "rdfDescription":"Cyberspace Developer Kit by Autodesk","edge":"style=dotted","labelPrefix":"🔧","rdfType":"skill"

#
# Clients
#

ADP
QualityClimbingSession1_2011_05 QualityClimbingSession2_2014_08 - "rdfLabel":"Amadeus Data Processing GmbH","labelPrefix":"🏢","rdfType":"OU"

SkyAdventures
TandemPilot_2020_07 - "labelPrefix":"🏢","rdfType":"OU"

Völkl
Cybertennis_1996 - OU
`);
```

```js
events_json = {
return(
  project_json(
    "TandemPilot_2020_07",
    "Tandem Flights",`commercial paragliding flights with guests along the coast of Sweden`
  )
)
}
```

```js
this_particular_diagram = "This particular diagram is the template for a curriculum vitae (CV) with an emphasis on 'professional' events. It has subtle visual variations from other Timeline diagrams (projects' timelines shown with solid lines, entities with dashed lines)."
```

### Initialization

CV diagrams customize the visual style of (more general) Timeline diagrams per `diagram_options`

```js
diagram_options = // custom edge styles which are better suited for the elements of a CV
{
  return { 
    future_pointer_minlen : 2 // more visible future pointers
    ,
    places_edge_style : "" // topics (=projects) should be the most prominent timelines in this diagram
    ,
    entity_edge_style : "dashed" // entities rather dashed (than solid) because they could be "dormant" between projects
  } 
}
```

### Imports

```js
css2xhr
```

```js
import { css2xhr } from "@bogo/css-hide-after-double-hr"
```

```js
import {digraph2svg, dot2svg, visco, kts_console, init, set_input_value} from "@bogo/kxfm"
```

```js
import {create_details_checkboxes, dot_string, keep_types, entity_timelines, transform_paragraphs_to_lines, project_json, tabular_view, get_flavour, create_grouped_input, bookmark_current }

with {this_particular_diagram, story, events_json, diagram_options, selected_entities }

from "@bogo/timelib"
```

```js
{
  init( diagram );

  yield "KTS ready";
}
```
