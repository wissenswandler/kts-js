# Cover

Draft text and figures

```js
digraph2svg( `

c1 [label="Chapter 1" URL="/1"]
c2 [label="Chapter 2" URL="/2"]

c1 -> c2

`)
.then( d => d
  .e( 'M' )
  .e( 'h' )
 )
```

![examples of differenty topologies of causality](/fig/causality-topology.svg)

```js 
import{ digraph, digraph2svg, visco } from "@kxfm/browser"
```
