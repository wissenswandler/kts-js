# Profiling Renderer Engines

not very insightful: works in Chrome, fails in Firefox (TypeError: m is undefined),
even in Chrome it lists only 3 out of 6 samples and all the samples are equal

```js
const memory = []
const profile = () => memory.push( window.performance.memory )
profile()
```

```js
import {  KTS4Browser,
          create_kts_console  } from "@kxfm/one"

import {  Graphviz            } from "@hpcc-js/wasm/graphviz"

const kts_console = create_kts_console()

profile()
```

<div class="card">

## simple setup including graphviz loading

```js echo
create_kts_console()
```

```js echo
const graphviz = await Graphviz.load()
const transformer = new KTS4Browser( graphviz, {clientwidth:width} )
profile()
```


```js echo
transformer.digraph `cause -> effect [label=power]`
```
```js
profile()
```

</div>

<div class="card">

## redundant setup

```js echo
const graphviz2 = await Graphviz.load()
const transformer2 = new KTS4Browser( graphviz, {clientwidth:width} )
profile()
```


```js echo
transformer2.digraph `cause -> effect [label=morepower]`
```
```js
profile()
```

</div>

```js echo
memory.map( m => m.usedJSHeapSize )
```

```js echo
memory.map( m => m.totalJSHeapSize )
```

```js echo
memory.map( m => m.jsHeapSizeLimit )
```

<link rel="stylesheet" href="./lib/graph.css" />
<script src="./lib/graph.js"></script>
