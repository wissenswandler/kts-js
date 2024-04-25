# Confetti bare / node_modules

Importing `canvas-confetti` with bare specifier, which means that it should come from locally installed node module.

See https://github.com/observablehq/framework/issues/1234

This is SOLVED now in Observable 1.6.0.

```js
import confetti from "canvas-confetti"
```

```js
Inputs.button("Throw confetti! 🎉", {reduce: () => confetti()})
```

see [Confetti npm](./confetti_npm) for the functioning version
