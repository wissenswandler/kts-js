---
toc: true
---
# Timelines and Yaml

What would a story look like, if it was written in pure YAML?
  
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

import{ digraph2svg         ,
        digraph             ,
        dot2svg             ,
        animate_content     ,
        KTS4Browser         ,
        timelines           ,
        set_input_value     ,
        kts_console         ,
                            } from "@kxfm/browser"
import * as yaml from "js-yaml";
```

<div class="card">

## diagram: full story

```js
timelines`${story_text}`
```
</div>

```js
myStory
```

```js
kts_console
```
<div class="card">

## yaml: full story impossible (object: Map), now here is a single entity

```js
yaml.dump( myStory.entities_map.get( "Boat" ) )
```
YAML syntax would require each event to be indented and prefixed with a dash.
'Abbreviated' syntax does not require linebreaks but quotes around the event name and commas as separators.

Therefore, the custom "Timelines" syntax is still the easiest way to write (and read?) a story.

</div>

## Story definition

```js
const myStory = new Story( story_text )
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
