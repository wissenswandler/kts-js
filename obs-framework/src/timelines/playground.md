---
keywords: interactive, casablanca
---
# Timelines Playground
  
```js
import {  
          get_url_param ,
                        } from "@kxfm/one"
import {  timelines     ,
                        } from "@kxfm/browser"
```

<div id="ktsConsole">KTS loading...</div>

```js
timelines `${ story_source }`
```
  
```js
const story_source = view( Inputs.textarea(
      {
        spellcheck: false,
        required: true,
        monospace: true,
        rows: 20,
        resize: true,
        value: get_url_param( 'story' )?.[0] ?? `Rick Paris Casablanca_1941

Ilsa Paris Casablanca_1941 Lisboa

Sam        Casablanca_1941`
      }
    ) )
```

Above you can edit the story which will immediate translate into a diagram.

Because every single keystroke is translated, there will be occasional errors in the diagram. Perfectly normal and nothing to worry about.

Below you can generate a bookmark for the current diagram. The story is contained in the URL.

```js
htl.html`<p><a class="screenonly" href="?story=${
encodeURIComponent( shorten( story_source ) )
}">bookmark current diagram</a></p>`
```

```js
const shorten = text => text
  .replaceAll(  /\[ \t]+/g         , ' '  )
  .replaceAll(  /\s?(->)\s?/g      , '$1' ) 
  .replaceAll(  /\s?([[{}\]])\s?/g , '$1' ) 
```
