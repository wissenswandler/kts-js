```js
title = md`# Timelines User Guide`
```

This document shall guide you as a user / reader of Timeline diagrams. Even though you can guess most of Timelines' meaning intuitively, here is some theory and many small examples for Timelines' fundamental concepts and visual details.

Futher, this guide shall give Timeline authors a good impression of what they can produce with the system. This guide does _not_ cover the syntax of Timeline stories in plain text. A starting point for writing Timelines would be this [simple Timelines template](/@bogo/timelines-v4-simplest-template) which you can fork into your own Timeline story.

And of course you can browse through the [Timeline Demos](/collection/@bogo/kts-timeline-demos) to get more ideas about usage scenarios.

```js
timelines_diagram = timelines`
Rick Paris Casablanca_1941

Ilsa Paris Casablanca_1941 Lisboa

Sam        Casablanca_1941
`
```

## Basic Concepts
${timelines`Rick Paris Casablanca`}

> a **Timelines diagram** shows the chains of **events** in the lives of **entities** over **time**

The _KTS Timelines_ module is a method and a toolsuite to create interactive stories from plain text with little effort.

## Entities

Each line in a Timeline diagram represents (a section of) the life of an entity.

An **entity** can be any person, subject or thing which experiences **events** over **time**. We could call each entity's **timeline** its _biography_ or _storyline_ or _lifeline_.

## Events

An **event** is anything significant (a change of state) in the life of at least one entity. 

In KTS Timelines, an event cannot exist without an entity timeline. [1]

### Connection
${ timelines`
Rick Casablanca

Ilsa Casablanca` }
Timelines can cross each other at any of their **events**. Technically they "share" such an event. On the semantic level we can say that two (or more) entities experience _the same_ event. This is how a Timelines diagram expresses connections or interaction between entities. Examples are: when people meet or separate, when people arrive at places or leave places.

Similar to a novel, a Timeline diagram typically contains several related lines that touch each other at certain events. 
In the fictional movie, for example, Rick and Ilsa meet.

### Events in space

An event is *always* located at some **place** (or more generally, has a **topic**). Technically the topic is one of two dimensions of the event. _More on topics below..._

An event may be expressed just by its topic (and nothing more about it). Referring to such an event is like saying *"Remember, Casablanca?"*

${ timelines`
Rick Casablanca

Ilsa Casablanca
- - -
Casablanca: meet` }
Events may alternatively be _presented_ by some expressive text (like _birth_ or _meeting_), or show an icon in addition or in stead of their text title. This is to say **what** is happening, instead **where** [2].

For authors: Either way, the technical dimensions of _place_ and _time_, such as "Casablanca 1940", are the most natural way to _define_ the event. During the development of a story it is always easy to change the visible title of an event.

### Events in time

${timelines`Rick Casablanca_1941`}

An event *always* happens at a point along a time axis. Technically, its date/time is the event's second dimension.

An event's point in time may be stated explicitly as a date value (such as the year 1941).

If an event is designated by a place (Casablanca) **and** a time (1941), then it is like saying *"Remember, Casablanca 1941?"*

${timelines` Rick America Ethiopia_1935 SpanishCivilWar Paris_1940 Casablanca_1941
- - -
SpanishCivilWar: Spanish Civil War`}
Or the event's exact time can be unknown (an _undated_ event). That sounds incomplete but it is perfectly OK.

In such a case, the event (E) is still time-bound in the context of preceding event (A) and following event (Z) on the same timeline. In Rick's example, we hear that he had fought in the Spanish Civil War (E) between his time in Ethiopia (A, 1935) and Paris (Z, 1940). We can still draw an unambiguous, straight timeline for Rick. [3]

Actually, in stories or memories of our real lives, we are often calculating a plausible date from known events before or after an event with an unknown date. Timeline stories can handle a mix of precisely known dates and unknown dates of events, like our brains can handle it. [4]

_Personally I (Boran) find it much easier to reconstruct a date and remember an event when I can look at a visual timeline._

### visual style of Time

In KTS Timeline diagrams, time flows from bottom to top. And you have noticed on the diagram's right-hand side there is a timescale, indicating calendar time.

${timelines`Person young_2010 wise_2080`}
In Timelines, the time axis is certainly not proportional. It lists exactly the time labels which are present in the story, and packs everything together as tightly as possible. There are only few layout rules:
1. time flows bottom-up (from bottom to top) [5]
2. events which happen at the same time, will always be shown at the same vertical height [6]

### visual style of Future
An entity's timeline typically ends in a slightly less saturated (more pale) line and a **_future arrow_**. This is to indicate that after the last known event for that entity, the entity probably continues to exist into the future. If an entity's life is known to end within the story (i.e. at a certain event) then there is no future arrow shown.

${timelines`Person meal continues

food meal - showExit: false`}
Actually, every visual detail that certainly happens in the future is displayed less saturated. [7]
In the example here, that's the case for the event "wise" and its date label "2080", in addition to the usual future arrows.

**No Future**

Here is an example for an entity -the food- with "no future". After a Person is having a meal, her life continues into the future. The food however has no future after the meal. The meal is the last known event for the food.

${timelines`
Salmon creek_0 river_1 ocean maturing_2 river_3 creek_3x
`}
## Topics

To repeat from the Event definition: 

> An event is always located at some place (or more generally, has a topic). Technically the topic is one of two dimensions of the event.

For illustration, consider the lifecycle of a salmon. A salmon hatches in a small river or a creek, starts growing (for a year) in a relatively protected river, then proceeds into the open ocean and continues maturing there. At age 3 the salmon returns to the **same river** of its youth, finally arriving at the **same creek** of its birth.

Now the event of the salmons _birth_ and its _return_ to the place of birth are clearly distinct events. However, they share the same place (_creek_ in this case). The common topic _creek_ is shown as a dotted line. Also this timeline is interactive (it is just harder to hit the dots in that line): hovering or clicking highlights exactly the events which share this topic.

Same applies to the topic _river_.

- - -

### a word on diagram size
${bogoTimelinesSweden1EpisodeTitleOnly_320}
Don't let diagram size scare you. After all, it is just a document. If books don't scare you, and street maps don't scare you, then you have all the mindset necessary for looking into Timelines diagrams, too.

Like street maps, a [Timeline diagram can be large](https://observablehq.com/@bogo/tesla-model-s-logbook?collection=@bogo/kts-timeline-demos). Those diagrams are best viewed a larger screen (pc / laptop) or even in print. Also, a story of _epic_ dimension would take some time and attention to read. Don't expect to look at it and "understand" everything within seconds.

Consider this example of a traditional map of public transportation. 
${netzplan_uBahn_munchen}
In principle it is not so different from larger KTS Timeline Diagrams. In real life, nobody reads the whole underground map just for fun. And you don't get your route sorted within seconds, either. 

Instead, you locate two stations that interest you most (start and destination), and you create a travel schedule from the stations in between "by hand".

Large Timeline diagrams are similar in the sense that you typically focus on limited details, like one or two people, or a few places, or a limited date range. 

Unlike fixed diagrams, the Timelines framework is offering online controls in order to limit the visible information from a larger body of facts.

Working with rather large and complex stories is actually the strength of KTS Timelines. If other digital tools (or the brain) fail to get a grip on a complex story, then KTS Timelines can be the solution. Digital **interaction** and **generative visualization** are the keys for readers to engage with **story mining**.

- - -

### some visual details
${timelines`
Car driving - car

Boat sailing - boat

Person explaining 
- - -
explaining:
- =
- a longer explanation inside the note
`}
An entity's timeline typically begins with the **_entity's name_** .
People's timelines begin with the name in a rounded box. Other entities may carry a type icon in front of their name.

An event may have a longer description, in addition to its title text. Those events are shown with a boxed "note" shape and typically with an underline (as with hyperlinks). During hover (mouse-over), a tooltip shows the longer description _(not available on touch devices)_. 

For an 'online' version of a Timeline diagram, the user interface may offer a switch to show the full descriptions instead of only the titles. You can test it right here:

```js
viewof project_lod
```

### visual style of Lines
${timelines`
Person PlaceA PlaceB_2010 PlaceB_2020

car    PlaceA PlaceB_2010 - car
`}
Peoples' timelines are shown with a solid line (because life is continuous).

Topics' (places) lines are shown dotted (because they are secondary, inferred entities and because places only travel in time - never in space). 

The travel path of a vehicle is typically shown as a dashed line (because a vehicle is rather passive, as opposed to a rather active person).

_All these line styles are defaults and can be customized for individual diagrams or entities._

Entities and their timelines are assigned random colors _(authors may assign fixed, customized colors per entity)_.

In the example to the right, we see a person who takes a car to go from PlaceA to PlaceB (2010). In 2020, the same person returning to the same PlaceB (without the car in this case). Visiting "PlaceB" twice makes it a **topic**. The 2 events on this topic's dimension are connected with a dotted line. 

```js
viewof date_range
```

${casablanca_diagram}
## Interaction

Timeline diagrams are **interactive** in multiple ways. You can hover with your mouse cursor over any **_entity name_**, **_future arrow_**, **_connecting lines_** or some **_events_** (no mouse-click needed). [8][9] 

Hovering will highlight exactly this one entity's timeline. The console box (usually at the lower left corner, not shown throughout this guide due to the larger number of small diagrams) will show the entity's name. Events on the path of a highlighted timeline are shown with a yellow background.

Hovering on an event with an explicit date will also highlight the corresponding date label on the timescale. Vice versa, hovering on a date on the timescale will highlight all events which happen at exactly this date.

In addition, you can click on the active elements to make the highlight more permanent. This way, you can click on more than one entity and explore those events which are shared by these entities. Shared events are highlighted with a blue background.

Highlighting is especially useful in large Timeline diagrams, because it helps readers to focus at one individual timeline at a time.

The intersection feature (one click and one hover, or two clicks) can quickly show how any two entities meet or interact in the story, especially in a large Timeline diagram.

```js
viewof diagram_toggles
```

## Generative

Timeline diagrams are automatically generated from structured text files. This generative nature has multiple implications and advantages:

1. Timeline authors can easily modify the story's text definition and receives an updated diagram immediately
2. Timeline readers can instantly filter a large story e.g. by time range or by selecting a subset of entities, making the filtered story much easier to digest
3. Filtering time ranges and "cast of characters" is another layer of interaction and supports more intuitive "story mining"
4. Readers can bookmark their filter criteria so that they can later repeat or continue their exploration (_story mining_)
5. Authors can prepare one large story and multiple smaller "special editions". Each _edition_ will be totally consistent with the larger story and with overlapping other editions.

## License and Professional Services
 
I have released Timelines (and all of KTS) under an AGPL license. Have fun. Other license options available on demand: please [contact me](mailto:koordinator@goegetap.name).

Also I am happy to support your project as a Knowledge Engineer, by structuring and transforming all the relevant data and information.

- - -
## Footnotes

1. You could say that without an observer (the experiencing entity), it is like the event has never happened.
1. To be consistent, such description shall be equally meaningful for all entities which share that event. For example, mother and child share the rather significant _birth_ event. Neither "giving birth" nor "being born" would be a good title for this event, because either title would represent only one entity's involvement in the event. The slightly more neutral title "birth" matches both perspectives.
1. In mathematics this is called a _total order relation_ for all events along one entity's timeline.
1. Technically you could override the bottom-up layout rule. For visual and semantic consistency, I (Boran) deem it important to present Value Maps and Timeline diagrams always in the bottom-up style.
1. Technically you could override the bottom-up layout rule. For visual and semantic consistency, I (Boran) deem it important to present Value Maps and Timeline diagrams always in the bottom-up style.
1. the opposite is not necessarily true: not all events on the same height necessarily happen at the same time, because _undated_ events could be packed into the same vertical height
1. the timescale's label "Time" is also shown pale so that it does not distract from real entities, which is a methodical contradiction but the best visual solution that I (Boran) could find so far
1. Hovering is not available on touch devices, such as smart phones or tablet (lacking a pointing device such as a mouse), but you can always click (brief touch) on those devices instead.
1. Hovering a _shared_ event does typically not generate a highlight of all sharing entities, because such extensive highlight is typically more confusing than helpful. If the UI offers it, then the reader can check the option **${highlight_all_timelines_of_event}**, and the UI will do exactly that.

- - -

- - -
- - -

```js
kts_console
```

```html
<style>

/*
  {
    right: 0;
    width: 300px;
    position: absolute;
    margin-top: -1.5em;
  }

  div:has( .ktscontainer )
    {display: inline; float:left}

  .ktscontainer ,
*/

  /* KTS diagrams float right inside the cell 
  */
  body > div > div details  ,
  body > div > div form:has( input[type="checkbox"] )  ,
  body > div > div form:has( input[type="radio"] )  ,
  body > div > div > * img      ,
  body > div > div > * .ktscontainer
    {float:right}
  
  /* anything else inside a cell, which has a KTS diagram, floats left inside that cell
  */
  body > div > div:has( .ktscontainer img )   
    {float:left}
  
  body > div > div:has( > style )   ,
  body > div > div:has( > hr )      ,
  body > div > div:not( :has( img )  )  ,
  body > div > div:not( :has( .ktscontainer )  )
    {clear: both}
  /*
  
  div > p > span.ktscontainer:only-child  
    {float:none}
  
  */

  img {width: 320px}

  li { margin-bottom: 0.5em }
  
  
</style>
```

## Imports

```js
css2xhr
```

```js
import { css2xhr } from "@bogo/css-hide-after-double-hr"
```

```js
import { kts_console, visco, init } from "@bogo/kxfm"
```

```js
diagram_styles
```

```js
import { timelines, notes, diagram_styles, viewof project_lod, highlight_all_timelines_of_event }
from "@bogo/timelib4"
```

```js
import { bogoTimelinesSweden1EpisodeTitleOnly_320 } from "@bogo/timelines"
```

```js
import { netzplan_uBahn_munchen } from "@bogo/munich-underground-map"
```

```js
import { diagram as casablanca_diagram, viewof diagram_toggles, viewof date_range } from "@bogo/casablanca"
```

## Initialization

```js
{
  timelines_diagram
  casablanca_diagram
  init()

  yield "KTS ready"
}
```
