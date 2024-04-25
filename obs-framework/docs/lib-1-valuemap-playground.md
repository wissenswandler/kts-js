# Value Map Playground
  
Below you can edit DOT source which will immediate translate into a diagram.

Because every single keystroke is translated, there will be occasional errors in the diagram. Perfectly normal and nothing to worry about.

```js
import {  KTS4Browser,
          create_kts_console  } from "@kxfm/one"

import {  Graphviz            } from "@hpcc-js/wasm/graphviz"

const kts_console = create_kts_console()
```

```js
const graphviz    = await Graphviz.load()
const transformer = new KTS4Browser( graphviz, {clientwidth:width} )
```

<div class="card">

```js
display( transformer.digraph2svg( dot_source ) )
```

```js
const dot_source = view( Inputs.textarea(
      {
        label: "DOT source" ,
        value: `cause -> effect`,
        spellcheck: false,
        required: true,
        monospace: true,
        resize: true,

        //
        // this will prevent invalid diagrams but also hide the error,
        // which is highly unintuitive for the user so we don't do it.
        //
        // validate: (text) => !transformer.digraph2svg( text.value ).classList.contains('transformer_error')
      }
    ) )
```

```js 
kts_console
```

</div>

<link rel="stylesheet" href="./lib/graph.css" />
<script src="./lib/graph.js"></script>
