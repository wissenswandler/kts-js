# YES Logic Import Test via npm
.
## Import

```js echo
import {or} from "npm:@kxfm/logic"
```

## Test

```js echo
or( true, false )
```

```js echo
or( false, false )
```

```js echo
or( false, undefined )
```

```js echo
or( true, undefined )
```

```js echo
or( undefined, undefined )
```
