# Neural Network Animation
  
```js
import {  digraph2svg     ,
          animate_content ,
                          } from "@kxfm/browser"
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
const diagram = digraph2svg( dot_source )
```

<div class="card">

```js
diagram
```

<div id="ktsConsole">KTS loading...</div>

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
diagram.execute_command_sequence( current_content )
```
