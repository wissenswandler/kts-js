# KTS Library (full migration attempt)


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
const parts = Mutable( new Map() )
```

```js
/* wrapping a dot fragment with the obligatory "digraph { ... } block, and injecting an optional < options.title > tag */
const dot_fragment_2_dot_string = (fragment,options) => `strict digraph ${options?.title ? ("<" + options.title + ">") : ""} { ${fragment} }`
```

```js
/* pinning the graphviz library to a known bug-free one - may be overridden { with } import */
const hpcc_js_wasm_version = '@2.15.1'
const GraphvizModule = await import ( 'https://unpkg.com/@hpcc-js/wasm' + hpcc_js_wasm_version + '/dist/graphviz?module' );
const graphviz = GraphvizModule.Graphviz.load();
```

```js
const Tdot2svgStrings = await import( "https://cdn.skypack.dev/@kxfm/dot2svg/Tdot2svgStrings.js")
const transformer = new Tdot2svgStrings.Tdot2svgStrings( graphviz )
```

```js
// import Tjira2dot from "npm:kxfm/jira2dot" // = (await import( "https://cdn.skypack.dev/@kxfm/jira2dot")).Tjira2dot
const Tjira2dot = (await import( "https://cdn.skypack.dev/@kxfm/jira2dot")).Tjira2dot
```

```js 
//import visco from "npm:kxfm/visco@1.4.33" // = (await import( "https://cdn.skypack.dev/@kxfm/visco@1.4.33" )).visco
const visco = (await import( "https://cdn.skypack.dev/@kxfm/visco@1.4.33" )).visco
```

```js
const insert_dom_inspector = () => {
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
const params = Object.fromEntries(
  [...new URL(document.baseURI).searchParams].map(([k, v]) => {
    try { v = JSON.parse(v) }
    catch(e) {}
    return [k, v];
  })
)
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
const dot_fragment_2_svg = ( ... params ) => digraph2svg( ... params )  // more intuitive function name
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
const jira2svg = 
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
function svg_from_jira_issues( options = default_dot_options )
{
  return jira2svg( issues, options )
}
```

```js
const init = dependencies => 
{
  globalThis.visco = visco; // required by ktsActions (and...?)
  globalThis.press = visco.press;
  visco.on_svg_load( dependencies );
  
  integrate_kts_css()
  
  return "KTS ready";
}
```

```js 
const dot_string     = 'digraph <the logic of cause and effect> { cause -> effect [label="via dot_string"] }'


```
