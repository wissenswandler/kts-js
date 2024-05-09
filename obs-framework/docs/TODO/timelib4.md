```js
title = md`# Timelines Library v 4`
```

This is the main implementation of the Timelines system as an Observable Notebook (npm to come).

For an introduction to the method see [the User Guide](https://observablehq.com/@bogo/timelines-user-guide).

For a collection of examples see [Timelines Demos](https://observablehq.com/collection/@bogo/kts-timeline-demos).

```js
// shows up in the notes cell
this_particular_diagram = "This particular diagram has examples and testcases for the Timelines Library. Customize this italic paragraph in cell <code>this_particular_diagram</code>"
```
```js
notes = htl.html`<details><summary>How to read this Timeline diagram</summary>
${md`
## Timelines

> a Timelines diagram shows the chains of **events** in the lives of **entities** over **time**

For a detailed introduction see[the User Guide](https://observablehq.com/@bogo/timelines-user-guide).

*${this_particular_diagram}*

Colored lines represent so-called entities. An entity can be a person, a thing or any-thing that exists over time.

An entity's timeline chains one or more events in chronological order. Time flows bottom-up.

Each event can be shared by other entities. When people share an event, we can say that the meet or interact during this event.

### Interaction

Timeline diagrams are **interactive**. You can hover with your mouse cursor (on a pc) over any **_entity name_**, **_future arrow_**, **_connecting lines_** or some **_events_** (no mouse-click needed). Hovering will highlight exactly this one entity's timeline. The console box (usually at the lower left corner) will show the entity's name.

In addition, you can click on the active elements to make the highlight more permanent. This way, you can click on more than one entity and explore those events which are shared by these entities.

_Hovering is not available on touch devices (lacking a pointing device such as a mouse), but you can always click (brief touch) on those devices`}
</details>`
```

```js
viewof type_buttons = myStory.create_type_buttons( viewof selected_entities, selected_entities, 9 )
```

```js
create_button_to_apply_visible_entities_as_new_filter( viewof selected_entities, myReducedStory )
```

```js
create_button_to_apply_visible_entities_as_new_filter = (input, story) => Inputs.button( "apply visible entities as new filter", {reduce: () => set_input_value(input, story.visible_entity_keys) } )
```

⇩ below: tabular view of events, some of their details and related entities

```js
topics_count = md`showing ${ myReducedStory.n_topics } out of total ${ myStory.n_topics } topics`
```

```js
timeline_tabular = myReducedStory/*myStory*/.tabular_view( ["person","OU"] )
```

### (String) constants

```js
symbol_major_incident = '⚠️' // '💀' // '💥'
```

### functions


```js
/*static*/ function has_date_part( event ) // datepart of event = all tokens starting at the 2nd, if any
{
  const tokenized_event = typeof event === "string" ? event.split('_') : event
  return ! isNaN(  Date.parse( tokenized_event.slice(1).join("-") )  ) // joining "-" for valid date format
}
```

## Imports

```js
import { set_input_value}
from "@bogo/kxfm"
```
