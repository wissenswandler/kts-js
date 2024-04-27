# Composed Diagram

Below is the simplest boilerplate code to support composed Value Maps.

A composed diagram has multiple DOT sources. The user decides which of those to include in the final diagram.

```js 
import {  KTS4Browser,
          create_kts_console  } from "@kxfm/one"
import {  FlexibleCheckbox    } from "@kxfm/observablehq"

import {  Graphviz            } from "@hpcc-js/wasm/graphviz"

const kts_console = create_kts_console()
```

```js
const graphviz = await Graphviz.load()
const transformer = new KTS4Browser( graphviz, {clientwidth:width} )
```

## Script

```js echo
const
flixbox = new FlexibleCheckbox()
flixbox.set_part("a","Brest->Rennes->Paris->München [label=TGV]")
flixbox.set_part("b","München->Salzburg->Linz->Wien [label=Railjet]")
// flixbox.parts_meta = "pieces" // you could customize the "parts" term ( => URL...)
```

## Stage

```js
flixbox.permalink_parts( show_parts_view )
```

```js echo
                           // demonstrating a default value 'a'
const show_parts_view = view(  flixbox.create_parts_input( ['a'] )  ) 
view( flixbox.getNoneAllButtons() )
```

```js
show_parts_view;
```

```js 
transformer.digraph2svg( flixbox.combine_parts( show_parts_view ) )
```
<link rel="stylesheet" href="./lib/graph.css" />
<script src="./lib/graph.js"></script>

<style>

  form.inputs-3a86ea
  {display: inline}

</style>
