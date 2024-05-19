---
toc: true
---
# Graphviz Import Attempts
  
.

## via node, subpackage 
(does not work in unpkg)

```js echo
import {  Graphviz            } from "@hpcc-js/wasm/graphviz"

const   graphvizg = await Graphviz.load()

display(graphvizg.dot( "digraph{a->b}" ))
```
## via npm
(does not work in unpkg)

```js echo
import {  Graphviz            } from "npm:@hpcc-js/wasm"

const   graphvizn = await Graphviz.load()

display(graphvizn.dot( "digraph{a->b}" ))
```

## via node, main package
(does not work in unpkg)

```js echo
import {  Graphviz            } from "@hpcc-js/wasm"

const   graphvizw = await Graphviz.load()

display(graphvizw.dot( "digraph{a->b}" ))
```
