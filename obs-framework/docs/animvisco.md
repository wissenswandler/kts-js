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
      a.length 
      ? 
      a.concat( [ "e,"+station ] ) 
      : [station]
    , []
  )
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

<link rel="stylesheet" href="./lib/graph.css" />
<script src="./lib/graph.js"></script>

<!-- following two imports are actually working on the dev server, but only with the absolute URL
script src="http://127.0.0.1:3000/_import/kxfm/one/graph.js" type="text/ecmascript" ></script>
<link  href="http://127.0.0.1:3000/_import/kxfm/one/graph.css" rel="stylesheet"      ></link-->

