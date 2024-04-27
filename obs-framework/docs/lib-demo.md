# Static Diagrams

Presenting a Value Map diagram with minimal boilerplate code

```js
import {  KTS4Browser,
          create_kts_console  } from "@kxfm/one"

import {  Graphviz            } from "@hpcc-js/wasm/graphviz"

const kts_console = create_kts_console()
```

<div class="card">

## The simplest possible use of KTS in an Observable project.

```js echo
create_kts_console()
```

```js echo
const graphviz = await Graphviz.load()
const transformer = new KTS4Browser( graphviz, {clientwidth:width} )
const digraph = transformer.digraph
```

```js echo
digraph`cause -> effect [label=value]` // template literal displays immediately
```
</div>

<div class="card">

## bonus: width-responsive diagram

diagrams scales down if needed, on a wide screen it will present 1 to 1 like the small first diagram

```js
digraph `<rather_long_diagram_here> -> <to_demonstrate_the_responsive> -> <nature_of_the_diagram> -> <It_scales_down_if_needed> -> <On_a_wide_screen_it_will_present_1_to_1_like_the_small_first_diagram>`
```
</div>

<link rel="stylesheet" href="./lib/graph.css" />
<script src="./lib/graph.js"></script>

<!-- following two imports are actually working on the dev server, but only with the absolute URL
script src="http://127.0.0.1:3000/_import/kxfm/one/graph.js" type="text/ecmascript" ></script>
<link  href="http://127.0.0.1:3000/_import/kxfm/one/graph.css" rel="stylesheet"      ></link-->

