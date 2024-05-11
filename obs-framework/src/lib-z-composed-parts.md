# Composed Diagram

Below is the simplest boilerplate code to support composed Value Maps.

A composed diagram has multiple DOT sources. The user decides which of those to include in the final diagram.

```js 
import{ digraph2svg     ,
        kts_console     } from "@kxfm/browser"

import{ FlexibleCheckbox    } from "@kxfm/observablehq"
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
digraph2svg( flixbox.combine_parts( show_parts_view ) )
```
