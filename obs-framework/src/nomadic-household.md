---
no toc
---
# Nomadic Sustainable Life

How Nature is Serving my Needs

### Patches of Knowledge creating a holistic Knowledge Map

```js 
import {  KTS4Browser,
          create_kts_console  } from "@kxfm/one"
import {  FlexibleCheckbox    } from "@kxfm/observablehq"

import { Graphviz             } from "@hpcc-js/wasm/graphviz"

const kts_console = create_kts_console()
```

```js
const graphviz = await Graphviz.load()
const transformer = new KTS4Browser( graphviz, {clientwidth:width} )
```

```js
const flixbox = new FlexibleCheckbox()
const set_part = flixbox.set_part

set_part( '1 my needs', `

me [shape=circle width=0.3 fixedsize=true ]

{ breathing drinking sleeping eating communicating } -> me
{ mobility navigating tanning joy } -> me [minlen=2]
{ washing working } -> me [minlen=3]

# navigating -> mobility        # correct but visually more complicated
# working -> { eating -> joy }  # correct but visually more complicated

` )

set_part( "2 kitchen", `
#
# kitchen related
#

{ node [style="" class=type_equipment]
  pan 
  sprouting_jar [label="Sprouting Jar"]
  thermos [label=Thermos tooltip="1 liter thermos for conserving hot water during day/night"]
  insulating_cup [label="insulating cup"]
  # espresso_cup [label="espresso cup"]
  solar_fusion [label="Sun / Hybrid Stove"]
  handpresso
  coffee_grinder [label="coffee grinder"]
}

thermos -> hot_water

#{ hot_water sprouts }          -> instant_soup -> eating
#{ instant_soup_mix olive_oil } -> instant_soup [minlen=3]

{ hot_water insulating_cup } -> belboula_soup -> eating
{ barley_meal olive_oil }    -> belboula_soup -> eating [minlen=2]

{ sprouts olive_oil vinegar  } -> sprout_salad -> eating
# { soy_sauce }                -> sprout_salad

{ hot_water } -> porridge -> eating
{  oatmeal  } -> porridge [minlen=2]

{ solar_fusion }    -> risotto -> eating
{ rice vegetables } -> risotto [minlen=2]

{ pan sprouts }          -> spanish_tortilla -> { eating } # joy }
{ potatoes onions eggs } -> spanish_tortilla [minlen=2]

#{ pan }         -> omelette -> { eating }
#{ onions eggs } -> omelette [minlen=2]

_12_Volts -> solar_fusion [minlen=2]
sunlight  -> solar_fusion
{ solar_fusion } -> cooked_potatoes
{ potatoes }     -> cooked_potatoes
#{ cooked_potatoes onions pan } -> fried_potatoes
#fried_potatoes 
-> eating [minlen=2]

{ coffee_grinder }       -> ground_coffee
{ roasted_coffee_beans } -> ground_coffee [minlen=2]

{ hot_water ground_coffee handpresso } -> espresso -> { drinking joy }
{ ground_coffee  }                     -> espresso # [minlen=2]
# espresso_cup                         -> espresso # let's save space

# { hot_water insulating_cup } -> instant_coffee -> drinking
# { instant_coffee_powder }    -> instant_coffee [minlen=2]

{ water sprouting_jar mung_beans } -> sprouts

` )

set_part( "3 hot water (detail)", `

{ node [style="" class=type_equipment]

  solar_go [label="Solar Stove" tooltip="smaller solar stove to boil 0.4 liters of water or to cook small meals; favourite tool for heating water"]

  immersion_heater

  primus_lite [label="gas stove" tooltip="small and efficient gas stove to boil 0.5 liters of water; last resort for hot water (2024 still using the gas container that I bought in 2020)"] 
}

{ water solar_go } -> sun_boiled_water -> thermos -> hot_water
sunlight -> solar_go

{ water primus_lite } -> gas_boiled_water
gas_boiled_water -> thermos [minlen=2]
camping_gas -> primus_lite 

{ water immersion_heater } -> electric_boiled_water -> thermos
_12_Volts -> immersion_heater

` )


set_part( "4 natural resources", `

nature [label=Nature shape=circle]

{ node [shape=none class=type_indirect]
  growing barley olives oat coffee_beans
  # soy
  breeding chicken
  environment
}

nature -> environment -> { fossils }
nature -> environment -> { sunlight water air } [minlen=2]

nature -> growing -> farmers -> { banana dates oranges tangerines }

nature -> breeding -> chicken -> eggs

farmers -> { potatoes vegetables onions }
farmers -> { rice oat barley olives grapes } [minlen=2]
farmers -> { mung_beans coffee_beans } [minlen=3]
# farmers -> soy 

` )

set_part( "5 processed", `

olives -> olive_oil

coffee_beans -> { roasted_coffee_beans } # instant_coffee_powder }

oat -> oatmeal
barley -> barley_meal

# soy -> soy_sauce

# vegetables -> instant_soup_mix

grapes -> wine -> vinegar

` )

set_part( "6 energy / tech", `

{ node [style="" class=type_equipment]
  solar_panel car roof_tent solar_charge_controller
  ac_charger [label="mobile wallbox" tooltip="for charging EV from various 'household' plugs"]
  _12_V_charger [label="12 V charger" tooltip="charger for 12 V batteries; doubles as 12 V power supply"]
}

{ node [style="" penwidth=2 class=type_infrastructure]
  household_plug supercharger
}

{ node [style="" penwidth=2 class="type_infrastructure type_less"]
  node [ color=grey fontcolor=grey ]
  houses
}

{ node [shape=none class=type_indirect]
  renewable_energy fossils energy_mix
}

sunlight -> solar_panel -> solar_charge_controller
sunlight -> renewable_energy

{ solar_charge_controller car _12_V_charger } -> _12_Volts

{ supercharger ac_charger } -> ev_charging -> car -> roof_tent -> sleeping

car -> mobility;

household_plug -> { _12_V_charger ac_charger }

fossils -> { camping_gas energy_mix }

renewable_energy -> supercharger

renewable_energy -> energy_mix -> houses -> household_plug

` )

set_part( 'social', `

friends [shape=circle fixedsize=true width=0.6]

  friends -> meeting -> joy
` )

set_part( "work", `
#
# work / technology
#

{ node [style="" class=type_equipment]
  phone tablets notebook large_screen table
}

_12_Volts -> { phone tablets notebook large_screen }

{ phone tablets } -> communicating

{ tablets } -> navigating

{ tablets notebook large_screen } -> working

table -> large_screen

` )

set_part( "y choices", `

air -> breathing

water -> { washing drinking }

sunlight -> tanning

{ banana tangerines } -> eating
{ } -> eating [minlen=2]
{ dates  }   -> eating   [minlen=3]
{ oranges }  -> drinking [minlen=3]

` )

set_part( "z less", `

{ node [class=type_less color=grey fontcolor=grey ]
  edge [class=type_less color=grey ]

fossils -> { camping_gas energy_mix kerosene petrol }

kerosene -> airplanes

petrol -> petrol_cars

}

` )
```

```js
flixbox.permalink_parts( show_parts_view )
```

```js
const show_parts_view = view(  flixbox.create_parts_input( "2 kitchen,4 natural resources,5 processed,y choices".split(',') )  ) 
view( flixbox.getNoneAllButtons() )
```

```js
show_parts_view;
```

```js 
transformer.digraph2svg( flixbox.combine_parts( show_parts_view ) )
```

```js
kts_console
```

<link rel="stylesheet" href="./lib/graph.css" />
<script src="./lib/graph.js"></script>
