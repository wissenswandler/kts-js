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
                            } from "./lib/index.js"
//                          } from "@kxfm/one"

import { 
        StoryToHTMLRenderer ,
        cv                  ,
                            } from "./libob/index.js"
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
      storyToHTMLRenderer.dictionary = 
  {
    "label":"Project / Product / Topic" ,
    "OU": "Client"                      ,
  }
```

```js
const myReducedStory = new ReducedStory
(
  myStory, selected_entities 
)
.addFilter(  new DaterangeFilter  ( date_range                          )  )
.addFilter(  new SharedEventFilter( diagram_toggles, only_shared_events )  )

const reducedStoryRenderer = new StoryToHTMLRenderer( myReducedStory )

const
storyToDotRenderer = new StoryToDotRenderer( myReducedStory, diagram_toggles, project_lod )
storyToDotRenderer.style = // custom edge styles which are better suited for the elements of a CV than those of a general Timeline diagram
{
    future_pointer_minlen : 2 // more visible future pointers
    ,
    places_edge_style : "solid" // topics (=projects) should be the most prominent timelines in this diagram
    ,
    entity_edge_style : "dashed" // entities rather dashed (than solid) because skills are "dormant" between projects
}
```

```js
dot2svg( storyToDotRenderer )
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

## Appendix

```js
cv.how_to_read `_This particular diagram is the template for a curriculum vitae (CV) with an emphasis on 'professional' events. It has subtle visual variations from other Timeline diagrams (projects' timelines shown with solid lines, entities with dashed lines)._`
```

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
Magellan_1993_10
Magellan_1994_03
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

Logitech
Magellan_1993_10
Magellan_1994_03
- OU

SkyAdventures
TandemPilot_2020_07 - OU

Völkl
Cybertennis_1996 - OU

- - -

Magellan_1993_10:
- Magellan suite for AutoCAD
- |

  working with Logitech (USA) to create a toolset
  for intuitive designing and viewing of 3D models
  within the AutoCAD software application

  Boran serves as 3D Consultant + Solution Architect

Magellan_1994_03: finish


TandemPilot_2020_07:
- Tandem Flights
- |

  commercial paragliding flights 
  with guests 
  along the coast of Sweden

`
```
