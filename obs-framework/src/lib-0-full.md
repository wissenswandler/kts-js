---
toc: true
---
# KTS Library (WIP migration from Obs)
  
```js
import {  KTS4Browser, KTS4HTML, Tjira2dot,
          create_kts_console  } from "@kxfm/one"
import {  FlexibleCheckbox    } from "@kxfm/observablehq"

import {  Graphviz            } from "@hpcc-js/wasm/graphviz"

const kts_console = create_kts_console()
```

```js
const graphviz    = await Graphviz.load()
const transformer = new KTS4Browser( graphviz, {clientwidth:width} )
const digraph     = transformer.digraph
```

<div class="card">

## Simplest Example

digraph fragment in template literal

```js echo
digraph`cause -> effect [label=value]`
```
</div>

<div class="card">

## Composition Example

```js echo
const
flixbox = new FlexibleCheckbox()
flixbox.set_part("a","Brest->Rennes->Paris")
flixbox.set_part("b","Paris->München->Linz->Wien")
```

```js
flixbox.permalink_parts( show_parts_view )
```

```js
const show_parts_view = view(  flixbox.create_parts_input(  )  ) 
view( flixbox.getNoneAllButtons() )
```

```js 
show_parts_view;
```

```js
digraph` ${composed} `
```

```js
const composed = flixbox.combine_parts( show_parts_view )
display( composed )
```
</div>

```js 
kts_console
```

<div class="card">

## Jira Issues Example 

A few Jira issues from an attached JSON array. Issues can be filtered by type. Type filter is generated dynamically.

```js 
const include_types = view(  create_types_filter( issues )  )
```

```js 
const valuemap = transformer.dot2svg
(
  Tjira2dot.jiraIssueArray2dotString
  (
    issues.filter
    ( i => 
      include_types.includes( i.fields.issuetype.name )  
    )
  )
  ,
  {domId:"valuemap",fit:'auto'} 
)

display( valuemap )
```
</div>

<div class="card">

## Zoom/Fit Control and Visco controls

Fit Control reads initial value from URL parameter `fit` (false/auto/true), defaults to 'auto'

```js
const fit_width_layout_option = view( Inputs.select
(
  [false, 'auto', true], 
  {
    label: "fit width", 
    value:  
    {
      "false" : false,
      "" : KTS4Browser.default_options.fit,
      "auto" : 'auto',
      "true" : true
    }[ KTS4HTML.get_url_param( "fit", [ KTS4Browser.default_options.fit] )[0] ]
    , 
    format: v => { return {false:'never fit (always 1:1)','auto':'auto (scale down if needed)', true:'always fit (scale up or down)'}[v] }  
  } 
)
)
```

```js
const    diagram3 = transformer.digraph2svg( `A -> B -> C -> D`, {fit:fit_width_layout_option} )
display( diagram3 )

const visco_buttons_Fe = view( Inputs.button
(
  [
    [ "focus"        ,  () => visco.press("F") ],
    [ "restore color",  () => visco.press("e") ] ,
  ]
  , {label: "visual controls" }
) )
```
Visco controls are useful after clicking the diagram.
</div>

## Props...

```js echo
const issues = await FileAttachment("/data/WORK.json").json()
```

```js
function create_types_filter( all_issues ) 
{
  const issuetypes = Array.from(   new Set(  all_issues.map( i => i.fields.issuetype.name )  )   ).sort()
  return Inputs.checkbox( issuetypes, { label:"filter by type", value: issuetypes } )
}
```
