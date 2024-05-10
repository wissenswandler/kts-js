```js
title = md`# Rainbow Warrior`
```

```js
notes
```

```js
viewof date_range = create_daterange_input( ["","1985-07-11"] )
```

```js
quick_select_buttons = Inputs.button
( 
  [
    [   "1.", () => {
        set_input_value(  viewof selected_entities, "Greenpeace,Rainbow_Warrior".split(',')  )
        set_input_value(  viewof date_range, ["","1985-07-09"] )
      }
    ] ,
    [   "2.", () => {
        set_input_value(  viewof selected_entities, ["Pereira"], '+'  )
        set_input_value(  viewof date_range, ["","1985-07-10"] )
      }
    ] ,
    [   "+bomb", () => {
                        set_input_value(  viewof selected_entities, "bombs", '+'  ) 
                        set_input_value(  viewof date_range, ["","1985-07-12"] )
      }
    ] ,
    [   "3.", () => set_input_value(  viewof selected_entities, ["Import_Crew" ], '+'  ) ] ,
    [   "4.", () => set_input_value(  viewof selected_entities, ["AdmPierreLacoste","FrançoisMitterrand"], '+'  ) ] ,
    [  "all", () => {
        set_input_value( viewof selected_entities,  myStory.entity_keys ) 
        set_input_value(  viewof date_range, ["",""] )
      }
    ]
  ]
  ,
  { label: "tell the story..." }
)
```

```js
diagram = 
  renderer_choice === "KTS-Dot" 
  ?
  dot2svg(  dot_string  )
  :
  graph_div
```

```js
kts_console
```

```js
viewof diagram_toggles
```

```js
viewof selected_entities = myStory.create_grouped_input( htl.html`select<span class="printonly">ed</span> elements`, "Greenpeace,Rainbow_Warrior,Pereira".split(',')  )
```

```js
myStory.create_type_buttons( viewof selected_entities, selected_entities, 9 )
```

```js
create_button_to_apply_visible_entities_as_new_filter( viewof selected_entities, myReducedStory )
```

```js
bookmark_current
```

```js
viewof project_lod = Inputs.radio(["title only", "full description"], {label: "level of detail", value: "full description"})
```

```js
viewof renderer_choice = Inputs.radio( ["KTS-Dot", "Ani-Dot"], {value:"Ani-Dot", label:"Layout Engine"} )
```

- - -
## Appendix

Sources:
* https://en.wikipedia.org/wiki/Sinking_of_the_Rainbow_Warrior
* https://en.wikipedia.org/wiki/Fernando_Pereira
* https://en.wikipedia.org/wiki/Rainbow_Warrior_(1955)
* https://en.wikipedia.org/wiki/Ouv%C3%A9a_(ship)
* https://en.wikipedia.org/wiki/Pierre_Lacoste
* https://en.wikipedia.org/wiki/Laurent_Fabius
* https://en.wikipedia.org/wiki/Dominique_Prieur
* https://en.wikipedia.org/wiki/Alain_Mafart
* https://web.archive.org/web/20230501094238/https://www.nytimes.com/2005/07/10/world/europe/report-says-mitterrand-approved-sinking-of-greenpeace-ship.html

- - -
- - -

### textual definition of story + event details

```js
myStory = new Story( `

France
Authorization_1985_05_15
FrenchDenial_1985_07_12 
FrenchConfession_1985_09_22
Mururoa_1985_10_24
MafartReturnsToParis_1987_12_14
PrieurReturnsToFrance_1988_05_06 
- country

FrenchPresident
Authorization_1985_05_15
- rdfType: role, rdfLabel: President

FrançoisMitterrand
Authorization_1985_05_15
MitterrandDies_1995_05_17
- rdfType: person, showExit: false, rdfLabel: François Mitterrand

DGSE
Authorization_1985_05_15
LacosteAuthorizing_1985_06
- rdfType: OU, rdfDescription: General Directorate for External Security = the French foreign intelligence agency

AdmPierreLacoste
Authorization_1985_05_15
LacosteAuthorizing_1985_06
LacosteDies_2020_01_13
- rdfType: person, showExit: false, rdfLabel: P Lacoste, rdfDescription: Admiral Pierre Lacoste, former head of France's General Directorate for External Security

FrenchPrimeMinister 
FrenchDenial_1985_07_12 
FrenchConfession_1985_09_22
- rdfType: role, rdfLabel: Prime Minister

Fabius
FrenchDenial_1985_07_12 
FrenchConfession_1985_09_22
- rdfType: person, rdfLabel: Laurent Fabius

PrisonSentence
sentenced_1985_11_22
transferred_1986_07
theoreticalEnd_1995_11
- showExit: false

NewZealand
Auckland_1985_07_07
Auckland_1985_07_10
Auckland_1985_07_10_a
Auckland_1985_07_10_b 
arrested_1985_07_12
NavalHarbour_1985_08_21
sentenced_1985_11_22
MatauriBay_1987_12_12
- country

Greenpeace RainbowWarriorAcquired_1977 
RWvarious
PereiraJoinsGreenpeace_1982 Norfolk_1985
RongelapAtoll
Auckland_1985_07_07
Auckland_1985_07_10 
Auckland_1985_07_10_a
- OU

JeanCamas
handover2 Auckland_1985_07_07_plus
escape_A
- rdfType: person, rdfLabel: J Camas, rdfDescription: Jean Camas (frogman)

Provence 
OuvéaScuttled_1985_07_12
escape_B
- boat

Import_Crew
LacosteAuthorizing_1985_06
importingBombs
handover1
NorfolkIsland OuvéaScuttled_1985_07_12
escape_B
- rdfType: person, rdfLabel: 3x Import Crew, dfDescription: "Roland Verge, Jean Michel Bartelo, Gérard Andries"

Ouvéa 
importingBombs
handover1
NorfolkIsland
# after 'arrest' (1985-07-12)
OuvéaScuttled_1985_07_12 
- rdfType: boat, showExit: false

JeanLucKister
handover2 Auckland_1985_07_07_plus
SouthIsland
# "about 10 days later"
escape_C
- rdfType: person, rdfLabel: JL Kister, rdfDescription: Jean-Luc Kister (frogman)

Hao
Hao_1986_07
Hao_1986_07_b
Hao_1986_07_c_pregnant
Hao_1987_12_14
Hao_1988_05_06 
- place

JoelPrieur 
Hao_1986_07_b
Hao_1986_07_c_pregnant
Hao_1987_12_14
Hao_1988_05_06 
PrieurReturnsToFrance_1988_05_06 
- person

DominiquePrieur
handover1 handover2 arrested_1985_07_12 chargedWithMurder pleadsGuilty sentenced_1985_11_22
transferred_1986_07
Hao_1986_07
Hao_1986_07_c_pregnant
Hao_1987_12_14
Hao_1988_05_06 
PrieurReturnsToFrance_1988_05_06 
- rdfType: person, rdfLabel: D. Prieur, rdfDescription: Dominique Prieur

Mafart
handover1 handover2 arrested_1985_07_12 chargedWithMurder pleadsGuilty sentenced_1985_11_22 
transferred_1986_07
Hao_1986_07
Hao_1987_12_14
MafartReturnsToParis_1987_12_14
- person

bombs
importingBombs
handover1
handover2
Auckland_1985_07_07_plus
Auckland_1985_07_10
- labelPrefix: 💣, showExit: false

Rainbow_Warrior RainbowWarriorAcquired_1977
RWvarious
Norfolk_1985
RongelapAtoll
Auckland_1985_07_07
Auckland_1985_07_07_plus
Auckland_1985_07_10
Auckland_1985_07_10_a
Auckland_1985_07_10_b
NavalHarbour_1985_08_21
MatauriBay_1987_12_12
- rdfType: boat,
showExit: FALSE

Pereira PereiraJoinsGreenpeace_1982 Norfolk_1985
RongelapAtoll
Auckland_1985_07_07
Auckland_1985_07_10
Auckland_1985_07_10_a
Auckland_1985_07_10_b 
- rdfType: person, rdfLabel: Fernando Pereira, showExit: FALSE

- - -

RongelapAtoll:
- Rongelap Atoll
- |
  "After relocating 
  300 Marshall Islanders from Rongelap Atoll, 
  which had been polluted by radioactive
  fallout by past American nuclear tests,
  Rainbow Warrior travelled to New Zealand"

Authorization_1985_05_15:
- Mitterrand authorizing
- |

  "Adm. Pierre Lacoste, 
  the former head of France's 
  General Directorate for External Security 
  said  in a 1986 report that he
  personally obtained approval to sink the ship 
  from the late president François Mitterrand."

FrenchConfession_1985_09_22:
- confession
- | 
  "The truth is cruel," [...] 
  "Agents of the French secret service sank this boat.
  They were acting on orders."

Mururoa_1985_10_24:
- Héro test
- |
  nuclear test Héro was conducted
  at Mururoa on 24 October 1985 
  with a yield of 2 kilotonnes of TNT; 
  France conducted 54 more nuclear tests 
  until the end of nuclear testing in 1996

FrenchDenial_1985_07_12:
- denial
- |
  "In no way is France involved [...] 
  The French Government doesn't deal
  with its opponents in such ways."

Auckland_1985_07_07_plus: bombs attached

RWvarious:
- various campaigns
- |
  a number of anti-whaling, 
  anti-seal hunting, anti-nuclear testing
  and anti-nuclear waste dumping campaigns

RainbowWarriorAcquired_1977: acquires

Auckland_1985_07_10_b:
- ✝
- Pereiro dies on board of Rainbow Warrior

Auckland_1985_07_10_a: sinking

Auckland_1985_07_10: Explosion

PereiraJoinsGreenpeace_1982: joining

GacquiresS_1981: acquires

PereiraBoardsRW: boards

LacosteDies_2020_01_13: ✝

MitterrandDies_1995_05_17: ✝

` )
```

```js
dot_string = new StoryToDotRenderer( myReducedStory ).toString()
```

## Imports

```js
this_particular_diagram = `This particular diagram is a description of events before and after the bombing of Rainbow Warrior`
```

```js
css2xhr
```

```js
import { css2xhr } from "@bogo/css-hide-after-double-hr"
```

```js
import { dot2svg, get_initial_url_param, get_initial_details, get_initial_exec, kts_console, init, visco, set_input_value } from "@bogo/kxfm"
```

```js
import { create_daterange_input, bookmark_current, viewof diagram_toggles, create_button_to_apply_visible_entities_as_new_filter, StoryToDotRenderer, Story, myReducedStory, notes }
with { selected_entities, date_range, myStory, viewof project_lod, this_particular_diagram }
from "@bogo/timelib4"
```

```js
import { graph_div, paint } 
with { dot_string }
from "@bogo/ani-dot"
```

```js
{
  if( renderer_choice === "KTS-Dot" )
  {
    diagram;
    init()
  }

  if( renderer_choice === "Ani-Dot" )
  {
    paint
  }

  diagram;
    if( false && !get_initial_details() && !get_initial_exec() )
      visco.explore( "Boran" )
  
  yield "KTS ready"
}
```
