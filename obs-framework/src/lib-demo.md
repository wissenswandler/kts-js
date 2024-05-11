# Static Diagrams

Presenting a Value Map diagram with minimal boilerplate code

```js
import {  digraph,
          kts_console         } from "@kxfm/browser"
```

<div class="card">

## The simplest possible use of KTS in an Observable project.

```js echo
kts_console
```

```js echo
digraph`cause -> effect [label=value]` // template literal displays immediately
```
</div>

<div class="card">

## bonus: width-responsive diagram

diagrams scales down if needed, on a wide screen it will present 1 to 1 like the small first diagram

```js
digraph `<rather_long_diagram_here> -> <to_demonstrate_the_responsive> -> <nature_of_the_diagram> -> <It_scales_down_if_needed> -> <On_a_wide_screen_it_will_present_1_to_1_like_the_small_first_diagram>`
```
</div>
