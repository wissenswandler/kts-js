---
index: true
---
# BoGo Books content draft

```js 
import{ digraph } from "@kxfm/browser"
```

<div class="card">

```js
digraph`

subgraph cluster_books { label=books
node [shape=note]
sailing_book [label="Sailing\nSweden\nto France\nfor\nbeginners"]
energy_book [label="Sustainable\nEnergy\nfor your\nHouse or\nVehicle"]
paragliding_book [label="Para-\ngliding:\nsimpler,\nsafer and\nhappier"]

}

{ # timeline style
SUP_2020 -> WingSUP_2021 -> Volker_2021 -> Dotterbart_2021 -> Maru_2021 -> engine_conversion -> Fehmarn_to_Simris -> sustainableConversion_2022 -> Simris_to_Hanstholm -> majorConversion -> Hanstholm_to_Camaret -> sailing_book
}

{ edge [color=black penwidth=1] # content style
{ engine_conversion sustainableConversion_2022 majorConversion TinyHouse SaintNic CrossAlps EV_Nomad car_nomad } -> energy_book
}
`
```
</div>
<div id="ktsConsole">KTS loading...</div>
