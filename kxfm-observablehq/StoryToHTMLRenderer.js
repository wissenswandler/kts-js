import    * as Inputs           from "@observablehq/inputs"
import    * as d3               from "d3"
import {  html                } from "htl"

import {  
          Text                ,
          KTS4HTML            ,
          StoryToDotRenderer  ,
          only_shared_events  ,
                              } from '@kxfm/one'
import {
          set_input_value     ,
                              } from "@kxfm/browser"

import    * as UID            from "./uid.js";

export
class StoryToHTMLRenderer extends StoryToDotRenderer
{

constructor( story, diagram_toggles, project_lod )
{
  super( story, diagram_toggles, project_lod )

  this.dictionary = 
  {
      "OU"    : "Organization"            ,
      "begin" : "Start"                   ,
      "label" : "Place / Topic / Project" ,
  }
  this.story = story // TODO: extract to base class
}

add_dictionary( dict ) {  this.dictionary = Object.assign( this.dictionary, dict )  }

translate = ( name, fallback = Text.capitalize(name) ) =>
Text.translate( name, this.dictionary, fallback )

html_link_bookmark( selected_entities, date_range, diagram_toggles, project_lod )
{
  return html`<p><a class="screenonly" href="?${
  this.html_urlparameters_bookmark( selected_entities, date_range, diagram_toggles, project_lod )
}">bookmark current set of details</a></p>`
}

html_urlparameters_bookmark( selected_entities, date_range, diagram_toggles, project_lod )
{
  return `details=${
selected_entities.join(',')
}&date_range=${
date_range.join(',')
}&only_shared_events=${
diagram_toggles.includes( only_shared_events )
}&lod=${ project_lod == StoryToDotRenderer.lod_options[0] ? 0 : 1 }`
}

/*
 * deprecated "custom" table,
 * TODO: replace (or complement) with D3 table
 */
tabular_view = ( column_names = [], title_names = [] ) => {
  return d3.create('table').attr( "style", "max-width:100%" ).classed( "timeline_tabular_view", true )
    .call(table => {
      table.append('thead').append('tr').classed('header', true).call(headerline => {
        if( column_names[0] )
          headerline.append('th').text( title_names[0] ?? this.translate(column_names[0]) )

        if( this.story.all_topicdetails_keys.has( "begin" ) )
          headerline.append('th').text(  this.translate( "begin" )  )
        
        if( this.story.all_topicdetails_keys.has( "end" ) )
          headerline.append('th').text('End').style( 'text-align','right')
        
          headerline.append('th').text(  this.translate( "label" )  )
        
        if( this.story.all_topicdetails_keys.has( "description" ) )
          headerline.append('th').text('Description').style("width","70%")
        
        if( column_names[1] )
          headerline.append('th').text( title_names[1] ?? this.translate(column_names.slice(-1)[0]) )
      })
    }) // end header
    
    .call(table => {
    table.append('tbody')
    
    .selectAll('tr')
    .data
    (
      Array.from
      (
        this.story.topic_events_map.entries() 
      )
      .filter(  ([topic,events]) => this.story.is_event_visible( [... events.values()][0] )  )
      .map
      ( 
        ([topic, events]) => this.story.fullstory.get_topic_details( topic ) 
      )
    )
    .join('tr')
    .call(line => {
      
      if( column_names[0] )
      line
        .append('td')
        .text(  topic => topic.get( column_names[0] ) )

      if( this.story.all_topicdetails_keys.has( "begin" ) )
      line
        .append('td')
        .text( topic => topic.get("begin") ) 

      if( this.story.all_topicdetails_keys.has( "end" ) )
      line
        .append('td')
        .text( topic => topic.get( "end" )  )

      line
        .append('td')
        .append('b')
        .text( topic => topic.get( "label" ) )

      if( this.story.all_topicdetails_keys.has( "description" ) )
      line
        .append('td')
        .selectAll('p')
        .data( topic => topic.get( "description" ) ?? [] )
        .join('p')
        .text(description => description)
      
      if( column_names[1] )
      line
        .append('td')
        .text( topic => topic.get( column_names.slice(-1)[0] ) ) 

    }) // end topic line
    }) // end tbody
    .node() // of table, that is

} // end of tabular_view()


create_button_to_apply_visible_entities_as_new_filter = (input) =>
Inputs.button( "apply visible entities as new entity selection", {reduce: () => set_input_value(input, this.story.visible_entity_keys) } )

create_type_buttons = (view, model, string_truncate_length = 3) =>
Inputs.button
(
  this.story.all_entity_types
  // TODO: .filter for types with more than one entity
  .reduce
  ( (acc, type) =>
    acc.concat
    (
    [
    [ html`<a title=" no ${ this.translate( type ) }">- ${ Text.truncate( this.translate( type ),string_truncate_length) }</a>`, () => 
      set_input_value( view, model.filter( x => ! this.story.keep_types( ""+type ).includes(x) )  )  // ""+type casts "undefined" to String
    ],
    [ html`<a title="all ${ this.translate( type ) }">+ ${ Text.truncate( this.translate( type ),string_truncate_length) }</a>`, () => 
      set_input_value( view, model.concat(        this.story.keep_types( ""+type )             )  ) 
    ]
    ] 
    )
    ,
    []  // accumulator
  )
)
  

create_daterange_input ( values_if_not_passed_in_url = ['',''] )
{
  return Inputs.form
  (
    [
      create_date_text_input( " from " , values_if_not_passed_in_url, 0, this.story.get_date_labels()[0]     )
      ,
      create_date_text_input( " until ", values_if_not_passed_in_url, 1, this.story.get_date_labels().pop()  )
    ],
    {
      template: inputs => html`
        <details class="date_range" open>
          <summary>date range shows events ...</summary>
          <div>
            ${inputs[0]}
            &nbsp;
            ${inputs[1]}
          </div>
        </details>
        <style>

          details.date_range > div ,
          details.date_range > div > form
          {
            display: flex;
          }
        
          details.date_range > div > form
          ,
          details.date_range > div > form > label
          { width: unset; max-width: unset }
          
          details.date_range > div > form > div > input
          { width: 10em; max-width: 10em }
          
          details.date_range > div > form > div > input:invalid
          {background : lightpink }
          
        </style>
      `
    }
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

create_grouped_input( label = html`<span>select<span class="printonly">ed</span> elements, grouped by type</span>`, values_if_not_passed_in_url )
{
  const groups = new Set;
  const format = (d) => 
  {
    const group = d[1].options.rdfType
    const name =  d[0]
    const label = html` <span>${name}</span>`;
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
  const style = html`<style>
.${scope}-head {
  font:13px/1.2 var(--sans-serif);
  margin-bottom: 1em;
  display: block;
}
.${scope}-body {
  padding-left: 0em;
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
    const wrap = html`<div>`;
    wrap.append( ...nodes.map( (n) => n.parentElement) );
    const g = html`<div class="${scope}-group type_${name}">`
    g.append
    (
      html`
      <span class="screenonly">show&nbsp;</span>${
        Object.entries(groups).length>1 
        && 
        name != 'undefined' 
        ?
        html`<strong>${
          this.translate( name ) 
        }</strong>`
        :
        '' 
      }&nbsp` 
    )
    //g.append( Inputs.button("+") ) // can't get this button to set the inputvalue of surrounding cell because of circular definition by Observable means -- also can't manipulate via HTML DOM ('checked' attribute) because d3 does not reflect such a change in the value of the input: value remains unchanged even with checkbox being visibly checked or unchecked
    g.append( wrap )
    parent.appendChild(g);
  }
  
  const widget = html`<div>
    <span class="${scope}-head">${label}</span>
    <div class="${scope}-body">${input}</div>
    ${style}
  `;

  Object.defineProperty
  ( widget, 
    "none_all_buttons", 
    {
      value: () =>
      Inputs.button
      ( 
        [
          [ "none", () => set_input_value( widget, []                               ) ]
          ,
          [  "all", () => set_input_value( widget, this.story.fullstory.entity_keys ) ]
        ]
      )
    } 
  )

  return Object.defineProperty
  ( widget, 
    "value", 
    {
      get: ( ) =>   input.value     ,
      set: (v) => { input.value = v }
    }
  )

} // end of create_grouped_input()

} // end of class StoryToHTMLRenderer
