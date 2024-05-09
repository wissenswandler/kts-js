# Animation via Visco Selections
  
```js
import {  KTS4Browser,animate_content,
          create_kts_console  } from "@kxfm/one"

import {  Graphviz            } from "@hpcc-js/wasm/graphviz"

const kts_console = create_kts_console()
```

<div class="card">

```js echo
create_kts_console()
```

```js echo
const graphviz = await Graphviz.load()
const transformer = new KTS4Browser( graphviz, {clientwidth:width} )
const digraph = transformer.digraph
const chain = `Brest->Rennes->Paris->München->Salzburg->Wien`.split('->')
```

```js echo
const diagram = digraph( [ chain.join('->') ] )
```

```js
diagram
```

```js echo
const current_content = animate_content
( 
  chain.reduce
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
