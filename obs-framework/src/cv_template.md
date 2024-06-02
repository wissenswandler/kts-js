---
toc: true
---
# CV Template

## Curriculum Vitae as a Timelines diagram
- can be filtered by certain skills or customers
- contains diagram view and tabular view

```js
import {  
        get_url_param,
        Story               ,
        StoryToDotRenderer  ,
        show_future_faded   ,
        only_shared_events  ,
        ReducedStory        ,
        SharedEventFilter   ,
        DaterangeFilter     ,
                            } from "@kxfm/one"
import { 
        StoryToHTMLRenderer ,
                            } from "./libob/StoryToHTMLRenderer.js"
//                          } from "@kxfm/observablehq"

import{ 
        dot2svg             ,
        timelines           ,
        set_input_value     ,
                            } from "@kxfm/browser"
```

## CV Diagram${ myReducedStory.get_flavour() }

showing ${ myReducedStory.n_topics } out of total ${ myStory.n_topics } topics

```js
const myStory = new Story( story_text )
const storyToHTMLRenderer = 
new   StoryToHTMLRenderer( myStory )
```

```js
const myReducedStory = new ReducedStory
(
  myStory, selected_entities 
)
.addFilter(  new DaterangeFilter  ( date_range                          )  )
.addFilter(  new SharedEventFilter( diagram_toggles, only_shared_events )  )

const reducedStoryRenderer = new StoryToHTMLRenderer( myReducedStory )
```

```js
dot2svg(  new StoryToDotRenderer( myReducedStory, diagram_toggles, project_lod )  )
```

<div id="ktsConsole">KTS loading...</div>


## filtering relevant people, skills, customers or date range

```js
const selected_entities_input = storyToHTMLRenderer.create_grouped_input()
const selected_entities = 
view( selected_entities_input )
```

```js
storyToHTMLRenderer.create_type_buttons( selected_entities_input, selected_entities, 9 )
```

```js
selected_entities_input.none_all_buttons()
```

```js
const date_range_input = storyToHTMLRenderer.create_daterange_input()
const date_range = view( date_range_input )
```

## Tabular CV
plus some of their details and related entities

```js
reducedStoryRenderer.tabular_view( ["client","skill"], ["Client / School","Skills involved"] )
```
- - -

<details><summary><h2>How to read a CV Diagram</h2></summary>

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

</details>

- - -

## advanced authoring tools

```js
const diagram_toggles = view( Inputs.checkbox
(
  [only_shared_events,StoryToDotRenderer.highlight_all_timelines_of_event], 
  {
    value: get_url_param( "only_shared_events", false )[0]==='true' ? [only_shared_events] : []
  } 
) )

const project_lod = view( Inputs.radio(["title only", "full description"], {label: "level of detail", value: "title only"}) )
```

```js
reducedStoryRenderer.create_button_to_apply_visible_entities_as_new_filter( selected_entities_input )
```

```js
htl.html`<p><a class="screenonly" href="?details=${
selected_entities.join(',')
}&date_range=${
date_range.join(',')
}&only_shared_events=${
diagram_toggles.includes( only_shared_events )
}">bookmark current set of details</a></p>`
```



```js
const story_text = `

Boran
Istanbul_1969
GymnasticsCoach_1987
Cybertennis_1996 
ITILServiceManager_2003 ITILv3Expert_2007 QualityClimbingSession1_2011_05
ParaglidingPilot_2013_06  ClimbingInstructor_2014_05  QualityClimbingSession2_2014_08 PassengerPermit_2015_08 ParaglidingInstructor_2017_11 TandemPilot_2020_07
- person

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
QualityClimbingSession1_2011_05 QualityClimbingSession2_2014_08 - rdfLabel: Amadeus Data Processing GmbH, labelPrefix: 🏢, rdfType: OU

SkyAdventures
TandemPilot_2020_07 - OU

Völkl
Cybertennis_1996 - OU

- - -

TandemPilot_2020_07:
- Tandem Flights
- |

  commercial paragliding flights 
  with guests 
  along the coast of Sweden

`
```

```js
const this_particular_diagram = "This particular diagram is the template for a curriculum vitae (CV) with an emphasis on 'professional' events. It has subtle visual variations from other Timeline diagrams (projects' timelines shown with solid lines, entities with dashed lines)."
```

```js
const diagram_options = // custom edge styles which are better suited for the elements of a CV than those of a general Timeline diagram
{
    future_pointer_minlen : 2 // more visible future pointers
    ,
    places_edge_style : "" // topics (=projects) should be the most prominent timelines in this diagram
    ,
    entity_edge_style : "dashed" // entities rather dashed (than solid) because skills are "dormant" between projects
}
```
