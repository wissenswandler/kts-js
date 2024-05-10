# Munich Underground Map (topology)

complete map of the Munich underground trains (U1 - U8) and their stations, drawn as an interactive Timelines diagram

size comparison to other Knowledge Maps and proof-of-concept for simple route-planning by means of causal analysis

```js
graph_div
```

```js
viewof diagram_toggles = Inputs.checkbox( [only_shared_events,highlight_all_timelines_of_event], {value: [highlight_all_timelines_of_event] } )
```

```js
kts_console
```

screen recording of UI demo at https://youtu.be/RqEoqElPmAo?si=yVDnjgUwDIGfqhLp

This post has also been published on https://www.linkedin.com/posts/boran-goegetap_munich-underground-map-as-a-knowledge-graph-activity-7178223536208023552-9Lu4

see also: traditional diagram of a public transport network (credits: Zeno Heilmaier https://commons.wikimedia.org/wiki/File:Netzplan_U-Bahn_M%C3%BCnchen.svg )

```js
netzplan_uBahn_munchen = FileAttachment("Netzplan_U-Bahn_München.svg").image( {width:"640"} )
```

- - -

```js
viewof fit_width
```

- - -
## Implementation

```js
only_shared_events = "nur Umsteigebahnhöfe"
```

```js
highlight_all_timelines_of_event = "alle direkt erreichbaren Stationen zeigen"
```

```js
bookmark_current
```

```js
viewof selected_entities = myStory.create_grouped_input( )
```

```js
quick_select_buttons = Inputs.button
( 
  [
    [ "none", () => set_input_value( viewof selected_entities, [] ) ]
    ,
    [  "all", () => 
      {
        set_input_value( viewof selected_entities, Object.keys( myStory.entity_timelines ) ) 
        set_input_value( viewof diagram_toggles, [] )
      }
    ]
  ]
)
```

```js
// shows up in the notes cell
this_particular_diagram = "This particular diagram shows the plot of [Pulp Fiction](https://en.wikipedia.org/wiki/Pulp_Fiction#Plot)"
```

```js
// main (and the only mandatory) definition of this diagram's story
myStory = new Story( `

U1
  OlympiaEinkaufszentrum
  GeorgBrauchleRing
  Westfriedhof
  Gern
  Rotkreuzplatz
  Maillingerstraße
  Stiglmaierplatz
  Hauptbahnhof
  SendlingerTor
  Fraunhoferstraße
  Kolumbusplatz
  Candidplatz
  Wettersteinplatz
  StQuirinPlatz
  Mangfallplatz
  U1_

U2
  Feldmoching
  Hasenbergl
  Dülferstraße
  Harthof
  AmHart
  FrankfurterRing
  Milbertshofen
  Scheidplatz
  Hohenzollernplatz
  Josephsplatz
  Theresienstraße
  Königsplatz
  Hauptbahnhof
  SendlingerTor
  Fraunhoferstraße
  Kolumbusplatz
  Silberhornstraße
  Untersbergstraße
  Giesing
  KarlPreisPlatz
  InnsbruckerRing
  Josephsburg
  Kreillerstraße
  Trudering
  Moosfeld
  MessestadtWest
  MessestadtOst
  U2_

U3
  Moosach
  StMartinsplatz
  OlympiaEinkaufszentrum
  Oberwiesenfeld
  Olympiazentrum
  Petuelring
  Scheidplatz
  Bonnerplatz
  MünchnerFreiheit
  Giselastraße
  Universität
  Odeonsplatz
  Marienplatz
  SendlingerTor
  Goetheplatz
  Poccistraße
  Implerstraße
  Brudermühlstraße
  ThalkirchenTierpark
  Obersendling
  Aidenbachstraße
  Machtlfingerstraße
  ForstenriederAllee
  BaslerStraße
  FürstenriedWest
  U3_

U4
  Westendstraße
  Heimeranplatz
  Schwanthalerhöhe
  Theresienwiese
  Hauptbahnhof
  Karlsplatz
  Odeonsplatz
  Lehel
  MaxWeberPlatz
  Prinzregentenplatz
  Böhmerwaldplatz
  RichardStraussStraße
  Arabellapark
  U4_

U5
  LaimerPlatz
  FriedenheimerStraße
  Westendstraße
  Heimeranplatz
  Schwanthalerhöhe
  Theresienwiese
  Hauptbahnhof
  Karlsplatz
  Odeonsplatz
  Lehel
  MaxWeberPlatz
  Ostbahnhof
  InnsbruckerRing
  Michaelibad
  Quiddestraße
  NeuperlachZentrum
  ThereseGiehseAllee
  NeuperlachSüd
  U5_

U6
  GarchingForschungszentrum
  Garching
  GarchingHochbrück
  Fröttmaning
  Kieferngarten
  Freimann
  Studentenstadt
  AlteHeide
  Nordfriedhof
  Dietlindenstraße
  MünchnerFreiheit
  Giselastraße
  Universität
  Odeonsplatz
  Marienplatz
  SendlingerTor
  Goetheplatz
  Poccistraße
  Implerstraße
  Harras
  Partnachplatz
  Westpark
  Holzapfelkreuth
  HadernerStern
  Großhadern
  KlinikumGroßhadern
  U6_

U7
  Westfriedhof
  Gern
  Rotkreuzplatz
  Maillingerstraße
  Stiglmaierplatz
  Hauptbahnhof
  SendlingerTor
  Fraunhoferstraße
  Kolumbusplatz
  Silberhornstraße
  Untersbergstraße
  Giesing
  KarlPreisPlatz
  InnsbruckerRing
  Michaelibad
  Quiddestraße
  NeuperlachZentrum
  U7_

U8
  Olympiazentrum
  Petuelring
  Scheidplatz
  Hohenzollernplatz
  Josephsplatz
  Theresienstraße
  Königsplatz
  Hauptbahnhof
  SendlingerTor
  U8_

` )
```

```js
myEntityReducedStory = new EntityReducedStory( myStory, selected_entities )
```

```js
dot_string = new StoryToDotRenderer( myEntityReducedStory ).toString()
```

```html
<style> /*hide cells for screen recording*/
  
  /*
  */
  body > div > div:has( > hr ) ~ div
  {display:none}
</style>
```

## Imports

```js
style
```

```js
import {style} from "@bogo/css-for-print"
```

```js
hpcc_js_wasm_version = '@2.8.0'
```

```js
import {get_initial_details, viewof fit_width, digraph2svg, dot2svg, kts_console, visco, init, set_input_value}
with {selected_entities, hpcc_js_wasm_version}
from "@bogo/kxfm"
```

```js
diagram_options = 
{
  return {
    places_edge_style : "dotted"

    , entryArrowtail : ""
    
    , showExit : false // a river e.g. never extends beyond its estuary

    , render_terminal_event_boxed : true
  }
}
```

```js
import { graph_div, paint } 
with { dot_string }
from "@bogo/ani-dot"
```

```js
import { render_maximap_div } from "@bogo/maximap"
```

```js
import { yaml, YAML } from "@bogo/yaml"
```

```js
import { bookmark_current, StoryToDotRenderer, Story, EntityReducedStory, notes } 
with { selected_entities, diagram_toggles, myStory, myEntityReducedStory, this_particular_diagram, diagram_options, only_shared_events, highlight_all_timelines_of_event }
from "@bogo/timelib3"
```

## Initialization

```js
paint
```

screen recording of UI demo at https://youtu.be/RqEoqElPmAo?si=yVDnjgUwDIGfqhLp

screen recording of UI demo at https://youtu.be/RqEoqElPmAo?si=yVDnjgUwDIGfqhLp
