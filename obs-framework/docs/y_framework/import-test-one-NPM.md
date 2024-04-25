# NO importing kxfm via npm specifier
  
```js
import { create_kts_console      } from  "npm:@kxfm/one"
```

<div class="card">

```js echo
create_kts_console()
```

I have no idea why this fails. The same technique (npm: import specifier) works for canvas-confetti.

The same package works with local import specifier ("./kxfm...") and bare ("@kxfm/one") specifiers.

</div>

