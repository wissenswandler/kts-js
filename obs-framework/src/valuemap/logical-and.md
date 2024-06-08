---
toc: true
---
# Logical And

demonstrating the Visco feature of requiring all inputs of a *logical AND node* to be activated before the effect travels through the gate

Flashing nodes indicate logical gates which are partially activated and wait for the remaining inputs to become fully activated.

```js
import { 
          digraph             ,
          digraph2svg         ,
                              } from "@kxfm/browser"
```

## 3 variations

a network where both inputs are required to activate the output

All three different conventions for the AND gate are shown here, for the sake of completeness. In reality you would probably only have one gate between multiple inputs and one output.

<div class="card">

```js echo
digraph2svg
( `
  and1 [label="&"]
  and2 [label="∧"]
  and3 [label="+"]

  {a b} -> {and1 and2 and3} -> out `
)
.then(  d => d.explore( 'a' )  )
```

Input ```a``` is already selected. You can experiment with your mouse or touch on input ```b``` to see the effect on the output.

</div>

<div id="ktsConsole">KTS loading...</div>

<div class="card">

## gate versus pass

adding a regular node ```pass``` which will activate the output unconditionally

```js echo
digraph2svg( `
and1 [label="&"]

{a b} -> {and1 pass} -> out ` )
```
</div>
