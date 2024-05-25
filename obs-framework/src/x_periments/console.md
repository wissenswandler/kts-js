# KTS Console as part of the diagram

does not work as expected 
because the first log message replaces SVG tags with "innerText" and renders the diagram node invisible

```js 
import{ digraph } from "@kxfm/browser"
```

<div class="card">

```js echo
digraph`cause -> effect [label=value] ktsConsole`
```
</div>
