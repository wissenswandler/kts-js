# Casablanca Timelines demo
  
```js
import{ timelines } from "/libbr/timelines4browser.js"

const story_text = await FileAttachment( "/data/casablanca.tmln" ).text()
```

```js
timelines `${ story_text }`
```
