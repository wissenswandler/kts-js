# KTS Library

### Observable wrappers for KTS npm packages

```js
intro_for_kts_lib
```

The [KTS Library Guide](/@bogo/kxfm-library-guide) has more examples and explains how Observable authors use the library.

- - -

```js
viewof include_types = create_types_filter( issues )
```

```js
valuemap = jira2svg( issues, {domId:"valuemap",fit:'auto'} )
```

```js
visco_buttons_Fe = Inputs.button
(
  [
    [ "focus",  () => visco.press("F") ],
    [ "restore color",  () => visco.press("e") ] ,
  ]
  , {label: "visual controls" }
)
```

### Diagram above: Jira example.

```js
kts_console = htl.html`<div id="ktsConsole" >KTS loading...</div>`
```

### Diagram below: Importer example

```js
importmap = importer
```

- - -

### Constant Fragment Example 

```js echo
dot_fragment_example = svg_from_dot_fragment()
```

### Computed Fragment Example

```js
viewof show_parts = create_parts_input()
```

```js
permalink_parts = {
  
  return htl.html`${
are_equal( show_parts, get_initial_url_param('parts') )
?
  "(selected parts coming from permalink)"
:
  htl.html`
  <a href='?parts=${show_parts.join(',')}'>permalink with current set of visible parts</a>
  ${ 
      get_initial_url_param('parts')
    ?
      Inputs.button
      ( [
        [
          "restore parts from permalink",
          () => set_input_value( viewof show_parts, get_initial_url_param('parts') )
        ]
      ] ) 
    :
      ""
  }
`}
${ Inputs.button( [ ["none", ()=>set_input_value(viewof show_parts,[]) ],[ "all", ()=>set_input_value( viewof show_parts, mutable parts.keys() ) ] ] ) }
`
  
function are_equal(array1, array2)
{
  if
  (
    array1 === undefined
    ||
    array2 === undefined
  ) return false
     
  return array1.length === array2.length && array1.every(element => array2.includes(element));
}
  
}
```

```js
viewof fit_width_layout_option = Inputs.select
(
  [false, 'auto', true], 
  {
    label: "fit width", 
    value:  {"false":false,"":default_dot_options.fit,"auto":'auto',"true":true}[ get_initial_url_param( "fit", [default_dot_options.fit] )[0] ]
    , 
    format: v => { return {false:'never fit (always 1:1)','auto':'auto (scale down if needed)', true:'always fit (scale up or down)'}[v] }  
  } 
)
```

```js echo
computed_fragment_example = digraph2svg( computed_dot_fragment, {fit : fit_width_layout_option} )
```

```js echo
set_part( "1", "Brest -> Paris;" )  // delete this cell if you define your dot_fragment literally (without computation)
```

```js echo
set_part( "2", "Paris -> München" )  // delete this cell if you define your dot_fragment literally (without computation)
```

```js
computed_dot_fragment = compute_dot_fragment()
```

```js echo
compute_dot_fragment = () => new Array( ...parts ).map( e => show_parts.includes(e[0]) ? e[1] : "" ).join(" ")  // you can define your dot_fragment also literally in this cell
```

### invalid-DOT-source Example

```js
digraph2svg( `a --> b`, {fit : fit_width_layout_option} )
```

## Implementation

```js echo
maximap = maximap_div
```

```js
create_parts_input = (default_values = mutable parts.keys()) => Inputs.checkbox
(
  mutable parts.keys(), 
  {
    label: "show parts", 
    value: new Array
    (
      ...(parts.keys())).includes( "0) base" ) 
      ?
      ["0) base"] 
      :
      get_initial_url_param( 'parts', default_values 
    ) 
  }  
)
```

```js
function integrate_kts_css()
{
  if( !document.getElementById('kts-stylesheet') )
       document.head.appendChild
       (
         html`<link id="kts-stylesheet" rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@kxfm/visco@1.4.33/graph.css">`
       );
}
```

```js
mutable parts = new Map()
```

```js
/* wrapping a dot fragment with the obligatory "digraph { ... } block, and injecting an optional < options.title > tag */
dot_fragment_2_dot_string = (fragment,options) => `strict digraph ${options?.title ? ("<" + options.title + ">") : ""} { ${fragment} }`
```

```js
graphviz = {
  const GraphvizModule = await import ( 'https://unpkg.com/@hpcc-js/wasm' + hpcc_js_wasm_version + '/dist/graphviz?module' );
  return GraphvizModule.Graphviz.load();
}
```

```js
transformer = {
  let Tdot2svgStrings = await import( "https://cdn.skypack.dev/@kxfm/dot2svg/Tdot2svgStrings.js")
  return new Tdot2svgStrings.Tdot2svgStrings( graphviz )
}
```

```js
Tjira2dot = (await import( "https://cdn.skypack.dev/@kxfm/jira2dot")).Tjira2dot
```

```js echo
visco = (await import( "https://cdn.skypack.dev/@kxfm/visco@1.4.34" )).visco
```

```js echo
issues = await FileAttachment("WORK.json").json()
```

```js
insert_dom_inspector = () => {
  const div = html`<div id="abc">X</div>`;
  const observer = new IntersectionObserver
  ( entries =>
  {
    const entry = entries.pop();
    div.textContent = [... d3.select(div)
          .node()           // "this" div
          .parentNode       // this cell
          .previousSibling  // previous cell
          .childNodes[0]    // first (only?) child - a DIV or P
          .childNodes].map
    ( n =>  
      n.nodeType === 3
      ?
      'text'
      :
      `<${n.tagName ?? "-"}${(n.tagName ? n.getAttributeNames() : []).map( a=> ` ${a} = ${n.getAttribute(a)}` )}>`
    )
  } )

  observer.observe ( div ); //
    
  invalidation.then(() => observer.disconnect());
  
  return div;
}
```

```js
//issues = cepdi_issues.slice(0,10)
```

## Deprecated

```js
css = "Importing KTS CSS separately is not necessary any more. CSS will be set automatically by the rendering methods (dot2svg ...)"
```

```js
/*
 * DEPRECATED
 *
 * use instead: {fit : fit_width_layout_option}
 */
viewof fit_width = Inputs.checkbox( ["fit width"], {value: get_initial_url_param("fit",false) == false ? [] : ["fit width"] } );
```

```js
/*
 * DEPRECATED
 *
 * use instead: {fit : fit_width_layout_option}
 */
viewof layout_options = 
{ 
  const layout_option_fit_width = "fit width"
  const layout_options = [ layout_option_fit_width ]
  const input = Inputs.checkbox
    (
      layout_options, 
      {
        label: "layout options" } 
        ,
        //value: get_initial_url_param("fit",false) == false ? [] : layout_options
    )
  return input
}
```

## Exports

```js
// installing a Promise to animate 
// an existing SVG node inside dom_node 
// with a new SVG, rendered from dot_string
animate_this_inside = ( dot_string, dom_node, duration = 0.5 ) => 
{
  const adjustWidthHeight = (d) =>
  {
    if (d.tag == "svg") 
    {
      try 
      { 
        const svg_width_in_px = d.attributes.width.match( /(\d+)pt/ )[1] * 4 / 3
        if(   svg_width_in_px > width )
        {
          d.attributes.width = null
          d.attributes.height = null
        }    
      } 
      catch (error) {
        // can't parse the width attribute
      }
    }
  }
  
  const transitionFactory = () => d3.transition("magjacT").duration(duration*1000);

  // create the Graphviz renderer instance on the passed-in element
  const graphviz_init = d3.select( dom_node ).graphviz( true )
  graphviz_init
  .zoom( false )
  .tweenPaths(false)
  .attributer( adjustWidthHeight )
  .transition( transitionFactory )
  .keyMode("id")  
  
  return new Promise
  ( (resolve, reject) =>
  { 
    graphviz_init.renderDot
    (
      KTS4Dot.preprocess( dot_string ), 
      () => resolve(this)
    )
  }
  ).then( () => init( dom_node ) )

}
```

```js
// DONE: migrated
function set_input_value(input, value, add_or_remove = undefined ) 
{
  if( add_or_remove === undefined )
    input.value = value
  else
  {
    switch( add_or_remove )
    {
      case '+':
        input.value = input.value.concat( Array.isArray(value) ? value : [value] )
        break
      case '-':
        input.value = input.value.filter( e => e != value )
        break
      default:
        throw new Error( `only operations '+' and '-' are defined (reading "${add_or_remove}")` )
    }
  }
  
  input.dispatchEvent(new Event("input", {bubbles: true}));
}
```

```js
params = Object.fromEntries(
  [...new URL(document.baseURI).searchParams].map(([k, v]) => {
    try { v = JSON.parse(v) }
    catch(e) {}
    return [k, v];
  })
)
```

```js
 /*
  * helper to read URL parameters
  * returns the "default" (second) function parameter (or 'undefined') if URL parameter is absent
  * otherwise
  * returns an array, which is the result of parsing the parameter's value as comma-separated list
  * special case: array with one element "" in case that URL parameter is present but no value defined ("param=" )
  */
function get_initial_url_param( param_name, default_if_no_url_parameter ) {
  const  values = new URLSearchParams(location.search).get( param_name )?.split(",");
  return values ?? default_if_no_url_parameter;
}
```

```js
function get_initial_details( default_if_no_url_parameter ) {
  return get_initial_url_param( "details", default_if_no_url_parameter )
}
```

```js
function get_initial_exec( default_if_no_url_parameter ) {
  return get_initial_url_param( "exec", default_if_no_url_parameter )
}
```

try it in the https://observablehq.com/@bogo/notebook-printer?id=${html`<a href>`.href}

```js
function set_part( key, value )
{
  mutable parts.set( key, value )
  mutable parts = new Map([...mutable parts.entries()].sort())
  return key
}
```

```js
function create_types_filter( all_issues ) 
{
  const issuetypes = Array.from(   new Set(  all_issues.map( i => i.fields.issuetype.name )  )   ).sort()
  return Inputs.checkbox( issuetypes, { label:"filter by type", value: issuetypes } )
}
```

```js
default_dot_options = { return { fit : 'auto' } }
```

```js
/*
 * the core rendering function, interacting with NPM libs 
 */
function dot2svg( dot_string_generator, options = default_dot_options )
{
  const dot_string = typeof dot_string_generator === String ? dot_string_generator : ""+dot_string_generator // triggering toString()
  let svg_string = transformer.dot2svg( dot_string );

  let transformer_error = svg_string.includes( "error caught in KTS" )

  let remove_width_attribute = false
  
  if
  (
    options.remove_width_height 
    || 
    options.fit && options.fit != "auto"
  )
    remove_width_attribute = true

  let svg_width_in_px = undefined
  try 
  { 
      svg_width_in_px = svg_string.match( /<svg width="(\d+)pt"/ )[1] * 4 / 3
  } 
  catch (error) {
    // can't parse the width attribute
  }
  
  if( options.fit == "auto" )
  {
    if( svg_width_in_px > width )
      remove_width_attribute = true
  }

  if( remove_width_attribute )
  {
    svg_string = svg_string.replace( /<svg( (width|height)="\d+.{0,2}"){0,2}/g, '<svg' )
  }

  if( transformer_error )
  {
    svg_string = svg_string
      .replace( /"0.1em"/g, '"5em"' )
      .replace( /<svg( (width|height)="\d+.{0,2}"){0,2}/g, '<svg width="100%" height="25"' );
  }
  
  svg_string = svg_string.slice( svg_string.indexOf( "<svg" ) );

  const dom_node =
    d3.create("span")
      .classed( "ktscontainer", true )
      .classed( "transformer_error", transformer_error )
      .attr( "id", options.domId )
      .html( svg_string )
      .node();

  //
  // following initialization works fine when calling digraph2svg()
  // but has no visible effect in digraph (template literal) ???
  //
  visco.on_svg_load( {document:dom_node} )
  integrate_kts_css()

  return dom_node;
}
```

```js
/*
 * shorthand for dot2svg, wrapping a "digraph { ... }" block around DOT source
 */
function digraph2svg( inside_digraph_block, options = default_dot_options )
{
  return dot2svg( dot_fragment_2_dot_string(inside_digraph_block, options ), options )
}
```

```js
dot_fragment_2_svg = ( ... params ) => digraph2svg( ... params )  // more intuitive function name
```

```js
/*
 * tag function,
 * turning the template literal into a DOT string 
 * with some KTS default styles and attributes
 * accepts a dot fragment (digraph content)
 */
function dig( strings, ... keys )
{
  return dot_fragment_2_dot_string
  (
    strings.reduce(  (a, c) => a + keys.shift() + c )
    , default_dot_options
  )
}
```

```js
/*
 * tag function,
 * turning the template literal into a KTS Value Map
 * accepts a dot fragment (digraph content)
 */
function digraph( strings, ... keys )
{
  return digraph2svg(  strings.reduce( (a, c) => a + keys.shift() + c ), default_dot_options  )
}
```

```js
jira2svg = 
(issues, options = default_dot_options ) => 
dot2svg
(
  Tjira2dot.jiraIssueArray2dotString
  (
    structuredClone(issues) // deep clone because jiraIssueArray2dotString seems to mutate the input array
    .filter
    ( i => 
      include_types.includes( i.fields.issuetype.name )  
    )
  )
  ,
  options
)
```

```js
function svg_from_dot( options = default_dot_options )
{
  return dot2svg( dot_string, options )
}
```

```js
function svg_from_digraph( options = default_dot_options )
{
  return digraph2svg( digraph_string, options )
}
```

```js
function svg_from_dot_fragment( options = default_dot_options )
{
  return digraph2svg( dot_fragment, options )
}
```

```js
function svg_from_jira_issues( options = default_dot_options )
{
  return jira2svg( issues, options )
}
```

```js
init = dependencies => 
{
  globalThis.visco = visco; // required by ktsActions (and...?)
  globalThis.press = visco.press;
  visco.on_svg_load( dependencies );
  
  integrate_kts_css()
  
  return "KTS ready";
}
```

## with { ... }

```js
/* pinning the graphviz library to a known bug-free one - may be overridden { with } import */
hpcc_js_wasm_version = '@2.15.1'
```

### Template data -- *replace this with your own strings in your `import with` statements*

```js echo
dot_string = 'digraph <the logic of cause and effect> { cause -> effect [label="via dot_string"] }'
```

```js
digraph_string = 'cause -> effect [label="via digraph_string"]'
```

```js
dot_fragment = 'cause -> effect [label="via dot_fragment"]'
```

## Imports

```js
KTS4Dot = import("https://cdn.skypack.dev/@kxfm/dot").then( mod => mod.KTS4Dot )
```

```js
import { maximap_div } from "@bogo/maximap"
```

```js
import {intro_for_kts_lib} from "@bogo/kts-glossary"
```

```js echo
import {graphic as importer, moduleUrl} with {url} from "@bogo/notebook-import-visualizer"
```

```js
url = moduleUrl("@bogo/kxfm")
```

## local init (not for export)

```js
/* intialization only for this library, not for re-use */
local_init = {
  maximap;
  valuemap;
  importmap;
  dot_fragment_example;
  computed_fragment_example;
  return init() ;
}
```
