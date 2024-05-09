# YES importing kxfm via bare specifier
  
```js
import { create_kts_console      } from "@kxfm/one"
```

<div class="card">

```js echo
create_kts_console()
```

The point is that Obs Framework does neither resolve globally installed packages nor `npm link`ed packages. It works when I install a local package through the `npm pack` workflow, e.g. per following script:

```sh
npm install $(npm pack ../../kts-js/kxfm-one/ | tail -1)
```

</div>
