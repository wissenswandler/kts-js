//
// wraps Inputs.checkbox and adds frequently used helpers
//
import *  as Inputs          from "@observablehq/inputs"
import {  html             } from "htl"
import {  Arr              } from "@kxfm/one"
import {  KTS4HTML         } from "@kxfm/one"

export class FlexibleCheckbox
{
  parts_meta = 'parts' 

  constructor( parts = new Map(), input )
  {
    this.parts = new Map()
    this.input = input
  }

  create_parts_input( default_values = this.parts.keys() )
  {
    this.default_values = KTS4HTML.get_url_param( this.parts_meta, default_values )
    return this.input = 
    ( //Inputs.form( [ // BUG ?? wrapping two inputs in one Form array fails silently
      Inputs.checkbox
      (
        this.parts.keys(), 
        {
          label: `show ${this.parts_meta}`, 
          value: this.default_values
        }  
      )
/*
    ],[
    ] 
*/
    )
  }

  // TODO: disable a button if it corresponds to the current selection state anyway
  getNoneAllButtons = () =>
  Inputs.button
  (
    [ 
      [    "none", () => this.setValue( []                  )  ] ,
      [ "default", () => this.setValue( this.default_values )  ] ,
      [     "all", () => this.setValue( true                )  ] ,
    ] 
  )

  set_part = (...kv) => this.parts.set(...kv) 

  setValue( value, add_or_remove = undefined ) 
  {
    if( add_or_remove === undefined )
    {

      this.input.value =
        (
        (value === true)
        ?
        this.parts.keys()
        :
        value
        )
    }
    else
    {
      switch( add_or_remove )
      {
        case '+':
          this.input.value = this.input.value.concat( Array.isArray(value) ? value : [value] )
          break
        case '-':
          this.input.value = this.input.value.filter( e => e != value )
          break
        default:
          throw new Error( `only operations '+' and '-' are defined (reading "${add_or_remove}")` )
      }
    }
    
    this.input.dispatchEvent(new Event("input", {bubbles: true}));
  }

  combine_parts()
  {
    return [ ...this.parts ].map( e => this.input.value.includes( e[0] ) ? e[1] : "" ).join(" ")
  }


  permalink_parts( view )
  { return (
  Arr.are_equal( view, KTS4HTML.get_url_param( this.parts_meta ) )
  ?
    html`(selected ${this.parts_meta} coming from permalink)`
  :
    html`<a href='?${this.parts_meta}=${
      Arr.are_equal( view, this.parts.keys() )
      ?
      "" // if all keys are selected then omitting the URL parameter is shorter
      :
      view.join(',') 
    }'>permalink with current set of visible ${this.parts_meta}</a>`
  )
  }
}
