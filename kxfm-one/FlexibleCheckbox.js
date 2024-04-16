          // extending creates a dependency which currently cannot be resolved 
          // (bare specifiers, mimetype text for .mjs ...)
export class FlexibleCheckbox // extends Inputs.checkbox 
{
  // also a static factory method would be nice to construct an Inputs.checkbox, but see above

  constructor( parts, input )
  {
    this.parts = parts
    this.input = input
  }

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


  // recerence error for function html at runtime
  // test = () => html`a`
}
