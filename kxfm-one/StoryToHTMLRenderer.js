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



create_daterange_input ( values_if_not_passed_in_url = ['',''] )
{
  return Inputs.form
  (
    [
      create_date_text_input( "show events ranging from", values_if_not_passed_in_url, 0, this.story.get_date_labels()[0]     )
      ,
      create_date_text_input( "until",                    values_if_not_passed_in_url, 1, this.story.get_date_labels().pop()  )
    ],
    {
      template: inputs => htl.html`
        <details class="date_range screenonly">
          <summary>Date range filter</summary>
          <div>
            ${inputs[0]}
            &nbsp;
            ${inputs[1]}
          </div>
        </details>
        <style>
        
          details.date_range { max-width: 40% }
          
          details.date_range > div > form
          ,
          details.date_range > div > form > label
          { width: unset; max-width: unset; display: inline-block }
          
          details.date_range > div > form > div > input
          { width: 10em; max-width: 10em }
          
          details.date_range > div > form > div > input:invalid
          {background : lightpink }
          
        </style>
      `
    }
    // following references would cause a circular definition
  )

  /*static*/ function create_date_text_input( label, values_if_not_passed_in_url, index, placeholder = "YYYY-MM-DD" )
  { return  Inputs.text
    ( 
      {
        label:label,
        value: ( KTS4HTML.get_url_param('date_range') ?? [undefined,undefined] )[index] ?? values_if_not_passed_in_url[index],
        maxlength:10,
        placeholder,
        pattern:"[0-9]{4}(-[01][0-9](-[0-3][0-9])?)?" 
      }
    )
  }
} // end of create_daterange_input()

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
        value: KTS4HTML.get_url_param( 'details', defaults )
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

} // end of create_grouped_input()

} // end of class StoryToHTMLRenderer
