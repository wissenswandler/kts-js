# Value Map Playground
  
Below you can edit DOT source which will immediate translate into a diagram.

Because every single keystroke is translated, there will be occasional errors in the diagram. Perfectly normal and nothing to worry about.

```js
import {  
          get_url_param ,
                        } from "@kxfm/one"
import {  digraph2svg   ,
                        } from "@kxfm/browser"


```

<div class="card">

<div id="ktsConsole">KTS loading...</div>

```js
digraph2svg( dot_source )
```

```js
const dot_source = view( Inputs.textarea(
      {
        // label: "DOT source" ,
        spellcheck: false,
        required: true,
        monospace: true,
        rows: 20,
        resize: true,
        value: get_url_param( 'dot' )?.[0] ?? `cause -> effect`

        //
        // this will prevent invalid diagrams but also hide the error,
        // which is highly unintuitive for the user so we don't do it.
        //
        // validate: (text) => !transformer.digraph2svg( text.value ).classList.contains('transformer_error')
      }
    ) )
```

</div>

```js
htl.html`<p><a class="screenonly" href="?dot=${
encodeURIComponent( dot_source )
}">bookmark current diagram</a></p>`
```
