# X Layout Tests

```js 
import{ digraph, digraph2svg, visco } from "@kxfm/browser"
```
## a
Leanest case: ${digraph`root -> intermediate -> result ` } inline client-side diagram 

## b
Client-side diagram from fenced code block:
```js
digraph`more[label="more ..."] root -> intermediate -> more -> symptom`
```

## c
Client-side diagram from fenced code block, plus Visco initialization:
```js
digraph2svg( `more[label="..."] root -> intermediate -> more -> result  node[label="side effect"] root->side1 intermediate->side2 `)
.then( d => d
  .explore( 'root' )
  .explore( 'result' )
  .e( 'j' )
 )
```

## d
Here you see a summary diagram of different topolgy types: chain, tree, fork, cycle and two simple networks which fork and join along their paths.

![examples of differenty topologies of causality](/fig/causality-topology.svg)
SVG image from external source, coded as markdown, fully compatible with Leanpub
