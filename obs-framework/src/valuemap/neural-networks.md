# Neural Networks
  
models refined, based on ChatGPT

```js
import {  KTS4Browser,
          create_kts_console  } from "@kxfm/one"

import {  Graphviz            } from "@hpcc-js/wasm/graphviz"

const kts_console = create_kts_console()
const graphviz = await Graphviz.load()
```

```js
const transformer = new KTS4Browser( graphviz, {clientwidth:width} )
```

<div class="card">

## is n-partite (sais ai)

```js 
transformer.dot2svg(
    await FileAttachment( "/data/nn-n-p.dot" ).text()
)
```
</div>

```js
create_kts_console()
```

<div class="card">

## not n-partite (sais ai) - but actually is n-partite

```js 
transformer.dot2svg(
    await FileAttachment( "/data/nn-not-n-p.dot" ).text()
)
```
</div>

<div class="card">

## demo for links with strength attribute

```js 
transformer.dot2svg(
    await FileAttachment( "/data/nn-strength.dot" ).text()
)
```
</div>
