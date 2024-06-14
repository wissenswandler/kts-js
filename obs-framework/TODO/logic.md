# Logic

 implementation of logical operations
 which handle 'undefined' as an operand
 in a way that preserves uncertainty 
 (e.g. returning `undefined` if the operation does not clearly evaluate to `true` or `false`)
 and also preserves logic

## Lessons Learned

This Notebook has successfully passed its Round-trip from:
1. Observable Notebook ->
2. Framework .md file ->
3. local ESM for Framework ->
4. npm package ->
5. import in Observable Notebook

The trip was not always intuitive. For future such trips I have learned a few lessons of practices that are either strictly required, or recommended to minimize rework.

### Practices for Observable Notebooks

1. Notebook cells that implement functions **shall not use arrow functions** (because an arrow-function needs to be prefixed with a `const` keyword in a Framework .md page)

1. a `return` statement **must be continued on the same line** to return its proper value in an Observable Notebook (weird bug, statement will return bullshit otherwise but not cause a syntax or runtime error, so this type of bug is harder to find)

1. a function in a Notebook shall not depend on other Notebook cells (rather pass the value of such cells as arguments in the function call)

1. if you need a named cell (for reactivity or debugging), assign to it only from a function call (this will result in more code inside functions, which are easier to re-use)

1. avoid complex Classes in Notebooks (IDE does not support class members, so they are best left to local ESM development) 
 
1. library candidates on Observable shall be implemented in the **kxfm** workspace (because of the npmjs workspace of the same name)

### Practices for (local) Ecmascript Modules (ESM)

1. each ESM shall implement **only one script** file (so that the specifier **"@kxfm/module"** can be equivalent in node / Framework / npm / Observable, because on Observable the specifier can evaluate to one "file" only)

1. the implementing ESM script file shall be named index**.mjs** (the extension is important so that http-server reports the right mimetype to a browser during unit testing with a plain HTML/Javascript page)

1. index.mjs needs an **index.js symlinked to it** (so that Framework serves it with the right mimetype, similar issue as with http-server / this requirement will go away once Framework will support node imports off the shelf)

With the last conventions followed, I can develop in a triple-hybrid, local, dev environment:
1. local node package, CLI invocation
1. local http-server, serving the very same node package to a plain HTML / Javascript page
1. local Framework app, serving the very same node package to a .md page

A Notebook may serve as input for the package. It can be fetched via the `npm run observable convert` command (which does not _convert_ a lot, but wraps code from Notebook cells into fenced code blocks and saves a bit of typing. Keywords like `mutable` or `viewof` break the Framework page. Also cells with a code block and `return` statement as RHS expression break in Framework).

## Implementation

```js echo
  /*
   * preserve logic by returning true: if at least one operand is true
   * false: only if all operands are false
   * and undefined: otherwise (combinations of false und undefined, preserving uncertainty)
   *
   * note: works with any number of operands
   */
function or(...operands) // can handle any number of operands
{ return operands.length === 0 ? undefined :
    operands.reduce
    ( (acc,op)  =>
      acc == true || op == true // truthy values accepted
      ? 
      true // if either operand is true (5 cases)
      :
        acc === false && op === false // not falsy values because they include 'undefined'
        ?
        false // only if both operands are false (1 case)
        :
        undefined // 3 remaining cases involving 'undefined, false'
    )
}
```

```js echo
  /*
   * preserve logic by returning true: only if all operands are true
   * false: if at least one operand is false
   * and undefined: otherwise (combinations of true and undefined, preserving uncertainty)
   *
   * note: works with any number of operands
   */
function and(...operands) // can handle any number of operands
{ return operands.length === 0 ? undefined :
    operands.reduce
    ( (acc,op)  =>
      acc == true && op == true // truthy values accepted
      ? 
      true // only if both operands are true (1 case)
      :
        acc === false || op === false // not falsy values because they include 'undefined'
        ?
        false // if either operand is false (5 cases)
        :
        undefined // 3 remaining cases involving 'undefined, true'
    )
}
```

```js echo
function lt( ...operands ) // can handle any number of operands
{
  // wrapping an impl around the recursive implementation prevents Observable from mistaking recursion with circular definition
  function impl( ...operands )
  {
    return operands.length < 2 ? true :  // for the sake of recursion
    operands[0] === undefined || operands[1] === undefined
    ?
    undefined
    :
      operands[0] >= operands[1]
      ?
      false
      :
          impl( ...operands.slice(1)  )  // this comparison stage is true, now check for the remaining chain with tail recursion
  }
  return  impl( ...operands           )
}
```

```js echo
function le(...operands) // can handle any number of operands
{
  // wrapping an impl around the recursive implementation prevents Observable from mistaking recursion with circular definition
  function impl( ...operands )
  {
    return operands.length < 2 ? true :  // every number or string is "less than or equal" to itself 
    operands[0] === undefined || operands[1] === undefined
    ?
    undefined
    :
      operands[0] > operands[1]
      ?
      false
      :
          impl( ...operands.slice(1)  )  // this comparison stage is true, now check for the remaining chain with tail recursion
  }
  return  impl( ...operands           )
}
```

```js echo
function not(operand) // unary operation
{ return operand === undefined
    ?
    undefined
    :
    ! operand
}
```

```js
import {createSuite, expect} from '@tomlarkworthy/testing'
```

```js echo
viewof suite = createSuite()
```

### logical AND (JS vs KTS)

```js
suite.test(` JS
undefined && true
`, () => {
expect
(
undefined && true
).toBe
(
  undefined
)
} )
```

```js
suite.test(` JS
true && undefined
`, () => {
expect
(
true && undefined
).toBe
(
  undefined
)
} )
```

```js
suite.test(` JS
undefined && undefined
`, () => {
expect
(
undefined && undefined
).toBe
(
  undefined
)
} )
```

```js
suite.test(` JS
false && undefined 
=> false (INCONSISTENT yet correct)`, () => {
expect
(
false && undefined 
).toBe
(
  false
)
} )
```

```js
suite.test(` JS
undefined && false
=> undefined (INCONSISTENT and FLAWED)`, () => {
expect
(
undefined && false
).toBe
(
  undefined
)
} )
```

```js
suite.test(`KTS
undefined && false
=> false (FIXED)`, () => {
expect
(
and( undefined, false )
).toBe
(
  false
)
} )
```

```js
suite.test(`KTS
false && undefined 
=> false (CONSISTENT)`, () => {
expect
(
and( false, undefined )
).toBe
(
  false
)
} )
```

```js
suite.test(`KTS
undefined && true
`, () => {
expect
(
and( undefined, true )
).toBe
(
  undefined
)
} )
```

```js
suite.test(`KTS
undefined && undefined
`, () => {
expect
(
and( undefined, undefined )
).toBe
(
  undefined
)
} )
```

#### edge cases (not very useful, just for the sake of completeness)

```js
suite.test(`KTS
and( true )
(only 1 operand) => true`, () => {
expect
(
and( true )
).toBe
(
  true
)
} )
```

```js
suite.test(`KTS
and()
(no operand) => undefined`, () => {
expect
(
and()
).toBe
(
  undefined
)
} )
```

### logical OR (JS vs KTS)

```js
suite.test(` JS
undefined || true
`, () => {
expect
(
undefined || true
).toBe
(
  true
)
} )
```

```js
suite.test(` JS
undefined || undefined
`, () => {
expect
(
undefined || undefined
).toBe
(
  undefined
)
} )
```

```js
suite.test(` JS
undefined || false
=> false (FLAWED)`, () => {
expect
(
undefined || false
).toBe
(
  false
)
} )
```

```js
suite.test(`KTS
undefined || false
=> undefined (FIXED)`, () => {
expect
(
or( undefined, false )
).toBe
(
  undefined
)
} )
```

```js
suite.test(`KTS
undefined || true
`, () => {
expect
(
or( undefined, true )
).toBe
(
  true
)
} )
```

```js
suite.test(`KTS
undefined || undefined
`, () => {
expect
(
or( undefined, undefined )
).toBe
(
  undefined
)
} )
```

#### bonus cases (more than 2 operands)

```js
suite.test(`KTS
or( false, false, true, false )
=> true`, () => {
expect
(
or( false, false, true, false )
).toBe
(
  true
)
} )
```

```js
suite.test(`KTS
or( false, undefined, false, true, false )
=> true`, () => {
expect
(
or( false, undefined, false, true, false )
).toBe
(
  true // even with an undefined mixed in, the result is true if there is at least one true operand
)
} )
```

```js
suite.test(`KTS
or( false, false, false, false )
`, () => {
expect
(
or( false, false, false, false )
).toBe
(
  false
)
} )
```

```js
suite.test(`KTS
or( false, undefined, false, false )
=> undefined`, () => {
expect
(
or( false, undefined, false, false )
).toBe
(
  undefined // with at least one undefined operand within otherwise false operands, the result is undefined
)
} )
```

#### edge cases (not very useful, just for the sake of completeness)

```js
suite.test(`KTS
or( true )
(only 1 operand) => true`, () => {
expect
(
or( true )
).toBe
(
  true
)
} )
```

```js
suite.test(`KTS
or()
(no operand) => undefined`, () => {
expect
(
or()
).toBe
(
  undefined
)
} )
```

### less-than (JS vs KTS)

```js
suite.test(` JS
undefined < 5
:= false (FLAWED)`, () => {
expect
(
undefined < 5
).toBe
(
  false
)
} )
```

```js
suite.test(`KTS
lt( undefined, 5 )
:= undefined (FIXED)`, () => {
expect
(
lt( undefined, 5 )
).toBe
(
  undefined
)
} )
```

```js
suite.test(`KTS
lt( 4, 4 )
`, () => {
expect
(
lt( 4, 4 )
).toBe
(
  false
)
} )
```

```js
suite.test(`KTS
lt( 1, 4 )
`, () => {
expect
(
lt( 1, 4 )
).toBe
(
  true
)
} )
```

```js
suite.test(`KTS
lt( 9, 4 )
`, () => {
expect
(
lt( 9, 4 )
).toBe
(
  false
)
} )
```

### less-than-or-equal (JS vs KTS)

```js
suite.test(` JS
undefined <= 5
:= false (FLAWED)`, () => {
expect
(
undefined <= 5
).toBe
(
  false
)
} )
```

```js
suite.test(`KTS
le( undefined, 5 )
:= undefined (FIXED)`, () => {
expect
(
le( undefined, 5 )
).toBe
(
  undefined
)
} )
```

```js
suite.test(`KTS
le( 5, undefined )
:= undefined`, () => {
expect
(
le( 5, undefined )
).toBe
(
  undefined
)
} )
```

```js
suite.test(`KTS
le( undefined, undefined )
`, () => {
expect
(
le( undefined, undefined )
).toBe
(
  undefined
)
} )
```

```js
suite.test(`KTS
lt( undefined, undefined )
`, () => {
expect
(
lt( undefined, undefined )
).toBe
(
  undefined
)
} )
```

```js
suite.test(`KTS
le( 1, 5 )
`, () => {
expect
(
le( 1, 5 )
).toBe
(
  true
)
} )
```

```js
suite.test(`KTS
le( 4, 4 )
`, () => {
expect
(
le( 4, 4 )
).toBe
(
  true
)
} )
```

```js
suite.test(`KTS
le( 5, 0 )
`, () => {
expect
(
le( 5, 0 )
).toBe
(
  false
)
} )
```

```js
suite.test(`KTS
le( new Date("1900"), new Date("2000") )
`, () => {
expect
(
le( new Date("1900"), new Date("2000") )
).toBe
(
  true
)
} )
```

```js
suite.test(`KTS
le( new Date("2000"), new Date("1900") )
`, () => {
expect
(
le( new Date("2000"), new Date("1900") )
).toBe
(
  false
)
} )
```

```js
suite.test(`KTS
le( new Date("2000"), undefined )
`, () => {
expect
(
le( new Date("2000"), undefined )
).toBe
(
  undefined
)
} )
```

#### bonus cases (more than 2 operands)

```js
suite.test(`KTS
le( 1, 5, 8)
`, () => {
expect
(
le( 1, 5, 8)
).toBe
(
  true
)
} )
```

```js
suite.test(`KTS
le( 1, 8, 5)
`, () => {
expect
(
le( 1, 8, 5)
).toBe
(
  false
)
} )
```

```js
suite.test(`KTS
le( 1, 8, undefined)
`, () => {
expect
(
le( 1, 8, undefined)
).toBe
(
  undefined
)
} )
```

```js
suite.test(`KTS
le( 1, undefined, 5)
`, () => {
expect
(
le( 1, undefined, 5)
).toBe
(
  undefined
)
} )
```

#### edge cases (not very useful, just for the sake of completeness)

```js
suite.test(`KTS
le( 1 )
(one operand)`, () => {
expect
(
le( 1 )
).toBe
(
  true
)
} )
```

```js
suite.test(`KTS
le()
(no operand)`, () => {
expect
(
le()
).toBe
(
  true
)
} )
```

### logical NOT (JS vs KTS)

```js
suite.test(` JS
! undefined
=> true (FLAWED)`, () => {
expect
(
! undefined
).toBe
(
  true
)
} )
```

```js
suite.test(`KTS
! undefined
=> undefined (FIXED)`, () => {
expect
(
not( undefined )
).toBe
(
  undefined
)
} )
```

```js
suite.test(`KTS
! true
`, () => {
expect
(
not( true )
).toBe
(
  false
)
} )
```

```js
suite.test(`KTS
! false
`, () => {
expect
(
not( false )
).toBe
(
  true
)
} )
```
