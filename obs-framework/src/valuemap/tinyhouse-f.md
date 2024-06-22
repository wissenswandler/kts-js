---
index:true
---
# Fanny's Tinyhouse installation

schematic diagram

```js 
import{ digraph } from "@kxfm/browser"
```

```js
digraph`

{node [style="dotted, rounded"] inverter loads_out  }

loads [label="12V loads"]

sun -> {panel1 panel2} -> SmartSolar75 -> batteries -> shunt -> loads -> {lights amplifier inverter}

SmartSolar75 -> smartphone -> VictronApp -> {read_batt_v configure read_solar_history}

SmartSolar75 -> loads_out

shunt -> BMV700 -> {read_batt_v read_batt_pct read_load_pwr beep}
`
```

<div id="ktsConsole">KTS loading...</div>

