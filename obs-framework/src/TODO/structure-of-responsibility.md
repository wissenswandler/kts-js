# Structure of Responsibility

## Push-Responsibility

```js echo
push_case = digraph` 
subject -> decision -> action -> effect -> {benefits violates} -> values`
```

## Pull-Responsibility

```js echo
pull_case = digraph` 

decision -> need -> subject -> holds -> values

subject -> need -> decision -> { product_a product_b } [label=pull color=black arrowhead=vee constraint=false]

producer_a -> action_a -> product_a -> decision
producer_b -> bction_b -> product_b -> decision

product_a -> side_effect_a -> violates -> values
product_b -> side_effect_b -> benefits -> values


`
```

- - -
- - -

```js
kts_console
```

## Imports

```js
import { digraph, kts_console, init, visco } from "@bogo/kxfm"
```

```js
{
  push_case;
  pull_case;
  /*
   * initialization of interactive features or pre-selections
   * delete this cell if you don't want to make the Value Map interactive, 
   * e.g. for small pieces of documentation
   */
  init()

  /*
   * initial markup in the diagram
   */
  visco.press( 'e' )
  visco.e( 'Brest' )

  yield "KTS ready"
}
```
