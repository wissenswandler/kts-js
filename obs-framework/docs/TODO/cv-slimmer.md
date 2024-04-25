```js
title = md`# Slimmer CV`
```

```js echo
cv_slimmer = timelines`

Boran Istanbul_1969 Gymnast_1980 GymCoach Climbing_1989 
TUM CAD3D 
#SpaceMouse 
California_1994 MagicMotion_1995 Cybertennis_1996 Cancer BMW_1998 FoundInSpace_1999 
Vivien_2002
ITIL
ITLExpert_2007 
QClimbing SAP_2011
Paragliding_2012
Lenggries_2013
ClimbingCoach_2014
EAM AlpsXing TandemPilot_2015 
#Norway_2016
FlightInstructor_2017
AlpsX3
#Sicily_2018
ValueMaps_2019 Sweden Sailing_2022
#Bretagne
Timelines Morocco_2024
- - -
Sailing_2022: Sailing\\nSE↣FR
ValueMaps_2019: Value-\\nMaps
AlpsX3: Alps\\nXing\\nTridem
FlightInstructor_2017: Flight\\nInstructor
TandemPilot_2015: Tandem\\nPilot
AlpsXing: Alps\\nXing\\nVolBiv
Paragliding_2012: Para-\\ngliding
SAP_2011: Knowl.-\\nManager\\n@ SAP
QClimbing: Quality\\nClimbing
ClimbingCoach_2014: Climbing\\nCoach
ITLExpert_2007: ITIL\\nExpert
FoundInSpace_1999: Found\\nin\\nSpace\\n3D Viewer
BMW_1998: SW PM\\n@ BMW
Cybertennis_1996: Cyber-\\ntennis
MagicMotion_1995: Magic\\nMotion\\n3D movies
California_1994: Logitech\\nCA USA
SpaceMouse: Space Mouse
CAD3D: 3D CAD
TUM: Computer\\nScience\\n@ TUM
GymCoach: Gymnastics\\nCoach

`
```

```js
kts_console
```

```js
notes
```

- - -
- - -

## Implementation

```js
this_particular_diagram = `This particular diagram is a shorter and more linear version of Boran's CV`
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
import { timelines, notes, diagram_styles }
with { this_particular_diagram }
from "@bogo/timelib4"
```

## Initialization

```js
{
  init( timelines_diagram );

  yield "KTS ready"
}
```
