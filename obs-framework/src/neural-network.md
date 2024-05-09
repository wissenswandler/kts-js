# Neural Network Animation
  
```js
import {  KTS4Browser,animate_content,
          create_kts_console  } from "@kxfm/one"

import {  Graphviz            } from "@hpcc-js/wasm/graphviz"

const kts_console = create_kts_console()
```

```js
const graphviz = await Graphviz.load()
const transformer = new KTS4Browser( graphviz, {clientwidth:width} )
const digraph = transformer.digraph
```

<div class="card">

## define the size of your neural network

```js
const input_width = view( Inputs.range( [2,8], {value:4, step:1, label:"Input / Output width"} ) )
```
```js
const input_height= view( Inputs.range( [1,9], {value:2, step:1, label:"n hidden layers"} ) )
```
</div>

```js
const hidden_nodes =
Array.from( {length:input_height }, (v,j) => 
Array.from( {length:input_width+1}, (v,i) => "h" + (j+1) + (i+1) )
)
const  input_nodes =
Array.from( {length:input_width  }, (v,i) => "i" + (i+1)         )
const output_nodes = input_nodes.map( node => "o" + node.slice(1) )

let dot_source = `
ranksep=${input_width/8}
{ ${  input_nodes.join(' ') } }
-> 
{ ${ hidden_nodes          [0].join(' ') } }
`

for (let i=1; i<input_height; i++)
{
dot_source +=`
{ ${ hidden_nodes          [i-1].join(' ') } }
-> 
{ ${ hidden_nodes          [i  ].join(' ') } }
`
} // end 'for'

dot_source +=
`{ ${ hidden_nodes.slice(-1)[0].join(' ') } }
-> 
{ ${ output_nodes.join(' ') } }
`
```

```js
const diagram = digraph( [ dot_source ] )
```

<div class="card">

```js
diagram
```

```js
create_kts_console()
```
</div>

```js
const current_content = //""
animate_content
( 
  ["i1","o1","i2","o2"]
  .map( node => "e," + node )
  , 3, visibility 
)
```

```js
diagram
visco.on_svg_load( diagram )
a1()
```

```js
const a1 = () => visco.execute_command_sequence( current_content )
```
