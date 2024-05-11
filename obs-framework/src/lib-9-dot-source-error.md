# invalid-DOT-source Example
  
Errors in DOT source can always happen - especially if coded by hand.

Below you can edit DOT source which initially contains a syntax error (double hyphen). The error is caught and presented in dark red text. Once correct, you will see the intended diagram.

*This is the same demo as the playground, except that the initial DOT source is invalid.*

```js
import{ digraph2svg     ,
        kts_console     } from "@kxfm/browser"
```

<div class="card">

```js
// for the protocol...

console.error( "↓ this syntax error in line 30 near '--' is triggered as an EXAMPLE - it is NOT a technical error" )

display( digraph2svg( dot_source ) )
```

```js
const dot_source = view( Inputs.textarea(
      {
        label: "DOT source" ,
        value: `cause --> effect`, // mind the extra hyphen
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
