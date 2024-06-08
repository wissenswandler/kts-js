# Animation via Visco Selections
  
```js
import { 
          digraph2svg         ,
          animate_content     ,
                              } from "@kxfm/browser"
```

<div class="card">

<div id="ktsConsole">KTS loading...</div>

```js echo
const graph_source = `Brest->Rennes->Paris->München->Salzburg->Wien`
```

```js echo
const diagram = digraph2svg( graph_source )
```

```js
diagram
```

```js echo
const current_content = animate_content
( 
  graph_source.split('->').reduce
  (
    (a, station) => 
      a.concat( [ [ (a.slice(-1)[0]??[null,null])[1], station] ] ) 
    , []
  )
  .filter( pair => pair[0] !== null )
  .map( pair => "e,N,"+pair[0]+",S,"+pair[1]+",j" )
  , 2, visibility 
)
```

```js
diagram.execute_command_sequence( current_content );
```

```js 
current_content
```
</div>
