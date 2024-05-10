```js
title = md`# Casablanca (movie) Storylines`
```

rather simple Timelines diagram with interactive date filter, mainly used in the [Timelines User Guide](/@bogo/timelines-user-guide)

```js
viewof date_range = create_daterange_input()
```

```js
viewof diagram_toggles
```

```js
// here we are filtering by date and by "shared" switch, but not by entities
diagram = dot2svg
( 
  new StoryToDotRenderer
  ( new ReducedStory
    (
      myStory, 
      myStory.entity_keys, 
      [
        SharedEventFilter.filter
        ,
        new DaterangeFilter( date_range ).filter
      ] 
    ) 
  ).toString() 
)
```

```js
kts_console
```

source: https://en.wikipedia.org/wiki/Casablanca_%28film%29

```js
notes
```

- - -
- - -

```js
myStory = new Story( `

Rick
America
Ethiopia_1935
SpanishCivilWar
Paris_1940
Casablanca_1941
airport

Ilsa
married separated
Paris_1940
nursing
Casablanca_1941
airport
airplane Lisboa

Strasser
Paris Casablanca_1941
airport 
StrasserDead
- |

Victor
married separated
camp escape assumedDead alive
nursing
Casablanca_1941
airport
airplane Lisboa
- - -
assumedDead: assumed dead
alive: alive but wounded
StrasserDead : death
SpanishCivilWar: Spanish Civil War
married: ⚭
`
)
```

## Implementation

```js
this_particular_diagram = `This particular diagram shows a few characters and events from the fictional movie Casablanca.`
```

## Imports

```js
css2xhr
```

```js
import { css2xhr } from "@bogo/css-hide-after-double-hr"
```

```js
import { dot2svg, kts_console, visco, init } from "@bogo/kxfm"
```

```js
import { timelines, StoryToDotRenderer, ReducedStory, Story, SharedEventFilter, DaterangeFilter, create_daterange_input, notes, viewof diagram_toggles }
with { this_particular_diagram, date_range, myStory }
from "@bogo/timelib4"
```

## Initialization

```js
{
  diagram
  init()

  yield "KTS ready"
}
```
