# Animation via Visco Selections
  
```js
import{ KTS4Browser         ,
        digraph2svg         ,
        animate_content     ,
        kts_console         } from "@kxfm/browser"

import{ Graphviz           } from "@hpcc-js/wasm/graphviz"
```

<div class="card">

```js
kts_console
```

```js echo
const graph_source = `Brest->Rennes->Paris->München->Salzburg->Wien`
```

```js echo
const diagram = digraph2svg( graph_source )
```

```js
diagram
```

```js echo
const current_content = animate_content
( 
  graph_source.split('->').reduce
  (
    (a, station) => 
      a.concat( [ [ (a.slice(-1)[0]??[null,null])[1], station] ] ) 
    , []
  )
  .filter( pair => pair[0] !== null )
  .map( pair => "e,N,"+pair[0]+",S,"+pair[1]+",j" )
  , 2, visibility 
)
```

```js
diagram
a1()
```

```js 
current_content
```

```js
const a1 = () => visco.execute_command_sequence( current_content )
```
</div>
