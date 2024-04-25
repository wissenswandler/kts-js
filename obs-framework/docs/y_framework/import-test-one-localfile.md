# YES importing kxfm via local path
  
```js
import { create_kts_console      } from "/kxfm/one/index.js"
```

NOTE: this used to work as long as the local path /kxfm/one/... had been linked.

The linked path, which had been an early attempt for importing @kxfm, is now removed from the server.

@kxfm imports nicely via the bare import specifier.

<div class="card">

```js echo
create_kts_console()
```

</div>
