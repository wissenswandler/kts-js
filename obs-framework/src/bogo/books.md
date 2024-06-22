---
index   : true
sidebar : false
---
# BoGo Books content draft

```js
digraph`

subgraph cluster_books { label=books node [shape=note]

sailing_book     [label="Sailing\nGermany\nto Sweden\nto France\nfor\nbeginners"]

energy_book      [label="Sustainable\nEnergy\nfor your\nHouse or\nVehicle"]

paragliding_book [label="Para-\ngliding:\nsimpler,\nsafer and\nhappier"]

eco_travel_book  [label="eco travel\non foot,\nby car\nor boat,\nlow budget"]
causality_book   [label="Causality:\na Tool for\nStructured\nThinking"]
cb_config_book   [label="Causality-\nBased\nConfiguration\nManagement\nand\nEnterprise\nArchitecture"]

} # END cluster books

subgraph cluster_journeys { edge [arrowhead=none] # timeline style

CrossAlps_2014 -> CrossAlps_2017

${ sailing_journey.join('->') }

} # END cluster journeys


subgraph cluster_scenarios { label=scenarios

EV_Nomad 
car_nomad 
sailboat
TinyHouse [label="Tinyhouse\n(offgrid)"]
House

} # END cluster scenarios


subgraph cluster_case_studies{ label="case studies"

{ Sweden_2020 Sweden_2021 Morocco_2024 Spain_2024 
} -> EV_Nomad

{ MARU ART Malala } -> sailboat
{ SaintJulien Labyrinth } -> TinyHouse
{
Poulouguen 
SaintNic 
Sharaf 
Bertilstorp 
Sagbach 
} -> House

} # END cluster case studies

{ engine_conversion sustainableConversion_2022_details majorConversion } -> MARU

{ node [style=filled] # abstract style

subgraph cluster_resources { label="renewable resources" labelloc=B node [shape=ellipse]
Wind Sun Wood Water }

Water -> Rain -> collect -> { SaintNic SaintJulien Malala }
Water -> Well -> { Bertilstorp Poulouguen Morocco_2024 }
Water -> Source -> { Spain_2024 Sagbach Morocco_2024 }

Sun -> { SolarCooking SolarToConsume SolarToBattery }
SolarCooking -> { Sweden_2020 Sweden_2021 Sharaf ART }
SolarToConsume -> { SaintNic CrossAlps_2014 CrossAlps_2017 }
SolarToBattery -> { Sweden_2021 sustainableConversion_2022 Labyrinth SaintJulien ART Sharaf }

Wind -> { WindToBattery WindForPropulsion }
WindToBattery     -> { sustainableConversion_2022 Labyrinth }
WindForPropulsion -> { WingSUP_2021 Volker_2021 Maru_2021 ART }

Wood -> portable_stove -> WoodToCookO -> Sweden_2020
Wood -> residential_stove -> { WoodToHeat WoodToCookI }
WoodToHeat  -> { SaintJulien Bertilstorp Poulouguen }
WoodToCookI -> { Bertilstorp Poulouguen }

CompostingToilet -> { SaintNic Poulouguen }

} # END abstract style


{ edge [color=black penwidth=1] # book content style

{ node [label=details]
sustainableConversion_2022 -> sustainableConversion_2022_details 
}
{ node [label=mention]
#sustainableConversion_2022 -> sustainableConversion_2022_mention 
}

${ 
//sailing_narration
//replace_array_entries_with( sailing_journey, 'sb' )
//.join('->') 
['Ouessant_to_Camaret']
}
-> sailing_book

{ TinyHouse House EV_Nomad car_nomad sailboat }
-> energy_book

{ CrossAlps_2014 CrossAlps_2017 }
-> paragliding_book

{ WindForPropulsion } -> eco_travel_book


} # END book content

{ edge [style=invis]
Bertilstorp -> Poulouguen
}

`
```

```js
const sailing_journey = `
SUP_2020 
WingSUP_2021 Volker_2021 Dotterbart_2021 Maru_2021 engine_conversion Fehmarn_to_Simris sustainableConversion_2022 Simris_to_Hanstholm majorConversion Hanstholm_to_Guernsey Ouessant Ouessant_to_Camaret`
.split(' ')
```


```js
const sailing_narration = replace_array_entry_with_mention
(     sailing_journey, 'sustainableConversion_2022' )
```

```js
//
// helper functions
//
const replace_array_entry_with_mention = (array, entry) =>
{
  const result = Array.from( array )
  result[
  result.indexOf( entry )
  ] = entry + '_mention'
  return result
}

const replace_array_entries_with = (array, suffix ) =>
array.map( entry => entry + '_' + suffix )
```

<div id="ktsConsole">KTS loading...</div>

```js 
import{ digraph } from "@kxfm/browser"
```
