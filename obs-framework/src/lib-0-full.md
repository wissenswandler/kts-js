---
toc: true
---
# KTS Value Maps Library
  
```js
import { 
          digraph2svg       ,
          digraph           ,
          dot2svg           ,
          animate_content   , //TODO: include API demo
          default_options   ,
                            } from "@kxfm/browser"
import {  
          KTS4HTML          ,
          Tjira2dot         } from "@kxfm/one"

import {  FlexibleCheckbox  } from "@kxfm/observablehq"
```

<div class="card">

## Simplest Example

```js echo
digraph`cause -> effect [label=value]`
```
</div>

<div class="card">

## Composition Example

```js 
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
digraph2svg(  flixbox.combine_parts( show_parts_view ), { fit:'auto' , width }  )
```
</div>

<div id="ktsConsole">KTS loading...</div>

<div class="card">

## Jira Issues Example 

A few Jira issues from an attached JSON array. Type filter is generated dynamically.

```js 
const include_types = view(  create_types_filter( issues )  )
```

```js 
const valuemap = dot2svg
(
  Tjira2dot.jiraIssueArray2dotString
  (
    issues.filter
    ( i => 
      include_types.includes( i.fields.issuetype.name )  
    )
  )
  ,
  { domId:"valuemap" , fit:'auto' , width } 
)
```

```js 
valuemap
```
</div>

<div class="card">

## Zoom/Fit Control

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
      "" : default_options.fit,
      "auto" : 'auto',
      "true" : true
    }[ KTS4HTML.get_url_param( "fit", [ default_options.fit] )[0] ]
    , 
    format: v => { return {false:'never fit (always 1:1)','auto':'auto (scale down if needed)', true:'always fit (scale up or down)'}[v] }  
  } 
)
)
```

```js
digraph2svg(  `A->B->C->D->E`, { fit:fit_width_layout_option , width }  )
```
</div>

<div class="card">

## Visco controls

```js
const visco_buttons_Fe = view( Inputs.button
(
  [
    [ "focus"        ,  () => visco.press("F") ],
    [ "restore color",  () => visco.press("e") ] ,
  ]
  , {label: "visual controls (use after clicks in diagram)" }
) )
```
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
