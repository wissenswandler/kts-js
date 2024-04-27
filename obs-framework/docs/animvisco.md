# Animation via Visco Selections
  
```js
import {  KTS4Browser,
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
```

```js echo
const diagram = digraph`Brest->Rennes->Paris->München->Salzburg->Wien`
```

```js echo
diagram
```

```js echo
view(  Inputs.button( "1", {reduce: ()=>a1() } )  )
```

```js
const a1 = () => visco.execute_command_sequence( "e,N,Brest,S,Rennes,j" )
```
</div>

<link rel="stylesheet" href="./lib/graph.css" />
<script src="./lib/graph.js"></script>

<!-- following two imports are actually working on the dev server, but only with the absolute URL
script src="http://127.0.0.1:3000/_import/kxfm/one/graph.js" type="text/ecmascript" ></script>
<link  href="http://127.0.0.1:3000/_import/kxfm/one/graph.css" rel="stylesheet"      ></link-->

