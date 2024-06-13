---
toc: true
---
# KTS Timelines Library
  
demonstration of all KTS Timelines API features

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
                              } from "@kxfm/observablehq"

import { 
          dot2svg             ,
          timelines2svg       ,
          timelines           ,
          set_input_value     ,
          default_options     ,
                              } from "@kxfm/browser"
```

<div class="card">

## diagram: full story

```js
//timelines`${ story_text }`
timelines2svg( story_text, { fit: true } )
```
</div>

<div class="card">

## controls for diagram content & behavior

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

## controls for diagram looks

implemented via CSS styles, no re-rendering needed 

```js
const post_render_toggles = view( Inputs.checkbox
(
  [show_future_faded], 
  {
    value: [show_future_faded]
  } 
) )
```
</div>

<div class="card">

## controls for entity selection (reduction)

```js
const selected_entities_input = storyToHTMLRenderer.create_grouped_input()
const selected_entities = view( selected_entities_input )
```

```js
storyToHTMLRenderer.create_type_buttons( selected_entities_input, selected_entities, 9 )
```

```js
selected_entities_input.none_all_buttons()
```
</div>

<div class="card">

## controls for selection on event level

```js
const date_range_input = storyToHTMLRenderer.create_daterange_input()
const date_range = view( date_range_input )
```

```js
reducedStoryRenderer.create_button_to_apply_visible_entities_as_new_filter( selected_entities_input )
```
</div>

```js
htl.html`<p><a class="screenonly" href="?details=${
selected_entities.join(',')
}&date_range=${
date_range.join(',')
}&only_shared_events=${
diagram_toggles.includes( only_shared_events )
}">bookmark current set of details</a></p>`
```

<div class="card">

## diagram: reduced story${ myReducedStory.get_flavour() }

showing ${ myReducedStory.n_topics } out of total ${ myStory.n_topics } topics

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
</div>

<div id="ktsConsole">KTS loading...</div>

<div class="card">

## Tabular view of events
plus some of their details and related entities

```js
reducedStoryRenderer.tabular_view( ["person","OU"] )
```
</div>

## Story definition

```js
const myStory = new Story( story_text )
const storyToHTMLRenderer = new StoryToHTMLRenderer( myStory )
```

```js echo
//
// definition of this diagram's story
//

const story_text = `

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

Boring_Entity

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

#ErrorEntity - a: b c: d

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

`
```

## very optional details

```js echo
// demonstration how to manipulate the "future" style
// IF future should not be faded
const diagram_styles = htl.html`<style>
${
  post_render_toggles.includes(show_future_faded) 
  ?
  "" // default per graph.css
  : 
  ".type_future, ._future { opacity: 100% !important }" 
}
</style>`
display( diagram_styles )
```
