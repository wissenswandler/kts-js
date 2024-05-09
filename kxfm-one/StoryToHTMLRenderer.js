import  * as Inputs from "@observablehq/inputs"
import  * as htl    from "htl";
import  * as UID    from "./uid.js";
import  * as Text   from './Text.js'
import{ KTS4HTML }  from "./KTS4HTML.js";

//import {  Story } from "./Story.js";

export
class StoryToHTMLRenderer
{

  dictionary = 
  {
      "OU"    : "Organization"            ,
      "begin" : "Start"                   ,
      "label" : "Place / Topic / Project" ,
  }

  constructor( story )
  {
    this.story = story;
  }

create_grouped_input( label = htl.html`<span>select<span class="printonly">ed</span> elements, grouped by type</span>`, values_if_not_passed_in_url )
{
  const groups = new Set;
  const format = (d) => 
  {
    const group = d[1].options.rdfType
    const name =  d[0]
    const label = htl.html`<span>${name}</span>`;
    (groups[group] || (groups[group] = [])).push(label);
    return label;
  };

  function create_input( subjects, defaults = Object.keys(subjects) )
  {
    return Inputs.checkbox
    (
      Object.entries( subjects), 
      {
        value: KTS4HTML.get_url_param( 'detail', defaults )
        ,
        valueof: ([a]) => a 
        ,
        format
      }
    )
  }  
  
  const input = create_input( this.story.entity_timelines, values_if_not_passed_in_url )
  const parent = input.lastElementChild;
  const scope = UID.uid().id;
  input.classList.add(`${scope}-input`);
  const style = htl.html`<style>
.${scope}-head {
  font:13px/1.2 var(--sans-serif);
  margin-bottom: 1em;
  display: block;
}
.${scope}-body {
  padding-left: 1em;
}
.${scope}-input {
  max-width: none;
}
.${scope}-group {
  display: flex;
}
.${scope}-group > strong {
  display: block;
  padding-bottom: .5em;
  width: 9ch;
  flex-shrink: 0;
}
.${scope}-group + .${scope}-group {
  border-top: 1px solid #eee;
  margin-top: 5px;
  padding-top: 5px;
}
.${scope}-group label {
  margin-bottom: .5em;
}
`

  for( const [name, nodes] of Object.entries(groups) )
  {
    const wrap = htl.html`<div>`;
    wrap.append( ...nodes.map( (n) => n.parentElement) );
    const g = htl.html`<div class="${scope}-group type_${name}">`
    g.append
    (
      htl.html`
      <span class="screenonly">show</span>${
        Object.entries(groups).length>1 
        && 
        name != 'undefined' 
        ?
        htl.html`&nbsp;<strong>${
          Text.translate( name, this.dictionary, Text.capitalize(name) ) 
        }</strong>`
        :
        '' 
      }
      ` 
    )
    //g.append( Inputs.button("+") ) // can't get this button to set the inputvalue of surrounding cell because of circular definition by Observable means -- also can't manipulate via HTML DOM ('checked' attribute) because d3 does not reflect such a change in the value of the input: value remains unchanged even with checkbox being visibly checked or unchecked
    g.append( wrap )
    parent.appendChild(g);
  }
  
  const widget = htl.html`<div>
    <span class="${scope}-head">${label}</span>
    <div class="${scope}-body">${input}</div>
    ${style}
  `;
  return Object.defineProperty(widget, "value", {
    get: () => input.value,
    set: (v) => {
      input.value = v;
    }
  });
} // end of create_grouped_input
} // end of class StoryToHTMLRenderer
