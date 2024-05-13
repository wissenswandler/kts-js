# Casablanca Timelines demo
  
```js
import{ timelines } from "@kxfm/browser"

const story_text = await FileAttachment( "/data/casablanca.tmln" ).text()
```

```js
timelines `${ story_text }`
```
