# Timelines Lib
  
```js
import{  KTS4Browser,
         create_kts_console,
         get_url_param         } from "@kxfm/one"

import{  Graphviz              } from "@hpcc-js/wasm/graphviz"

import{ StoryToDotRenderer, Story,
        show_future_faded,
        highlight_all_timelines_of_event,
        only_shared_events
} from "/lib/timelines2dot.js"

const kts_console = create_kts_console()
```

<div class="card">

## Timelines diagram, observing some switches but not "Entity" and no "Shared" filter yet

```js
const graphviz = await Graphviz.load()
const transformer = new KTS4Browser( graphviz, {clientwidth:width} )
const digraph = transformer.digraph
const diagram_full_story = transformer.dot2svg (  new StoryToDotRenderer( myStory, diagram_toggles, project_lod )  )
```

```js
diagram_full_story
```

⇧ above: full story

</div>

<div class="card">

## controls for diagram content & behavior

```js
const diagram_toggles = view( Inputs.checkbox
(
  [only_shared_events,highlight_all_timelines_of_event], 
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

```js
create_kts_console()
```

```js echo
// definition of this diagram's story
const myStory = new Story( `

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

Boring_Entity - UseCase

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

` )
```

```js
const diagram_styles = htl.html`<style>
${ post_render_toggles.includes(show_future_faded) ? ".type_future, ._future { opacity: 40% }" : "" }
</style>`
display( diagram_styles )
```

<link rel="stylesheet" href="./lib/graph.css" />
<script src="./lib/graph.js"></script>
