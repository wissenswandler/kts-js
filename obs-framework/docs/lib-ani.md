# Animated Diagrams

smooth transitions for changes in the diagram, thanks to [Magnus Jacobsson](https://observablehq.com/@magjac) and his ingenious library https://observablehq.com/@magjac/demo-of-d3-graphviz-animations

```js 
import {  KTS4Browser, KTS4Dot, animate_content,  
          create_kts_console  } from "@kxfm/one"

const transformer = KTS4Browser.animinit()

const error_diagram = html`<div class="ktscontainer" style="width: ${width}px"></div>`
const       diagram = html`<div class="ktscontainer" style="width: ${width}px"></div>`
```

<div class="card">

## author's lounge

```js 
const digraphs = 
  [
    "cause",
    "cause -> effect",
    "cause -> effect [label=value]",
  ]
```

```js
const content_store_view = view( Inputs.textarea( {value: digraphs.join('\n') } ) )
```

```js
const duration = view( Inputs.range([0.1, 2], {label: "animation duration in seconds", step: 0.1, value: 1.2 }) )
```
</div>

<div class="card">

## the screen

```js 
// you could also skip the author's textarea and just define a fixed array of strings here
const contents = content_store_view.split('\n')
```

```js echo
const current_content = animate_content( contents, duration, visibility )
```

```js 
diagram
```

```js echo
transformer.render2( KTS4Dot.dig([current_content]), diagram, duration  );
```
</div>

<div class="card">

## bonus material

```js echo
current_content
// presenting the DOT source here is the only reason for variabe 'current_content'
// otherwise we could just call the generator function directly in the call to 'animate_this_inside'
```

```js echo
create_kts_console() 
// not really used in this example, but kept as a template for other,
// slowly (manually) animating diagrams that you want to explore via VisCo
```
</div>

<link rel="stylesheet" href="./lib/graph.css" />
<script src="./lib/graph.js"></script>
