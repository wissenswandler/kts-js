export class DotRenderer
{
  constructor( project_lod = DotRenderer.lod_full_descr )
  {
    this.project_lod = project_lod

    /* 
     * class properties
     */
    this.constructor.lod_title_only = "title only"
    this.constructor.lod_full_descr = "full description"
  }
  
  static id_from_options_or_label( rdfLabel, options = {} ) 
  {
    return options.id ?? rdfLabel.replaceAll( ' ',"" )
  }

  static to_dot_label_raw( value )
  {
    return value === null ? "" :
    typeof( value ) === 'string' 
    ?
    value
      ?.replace(/(?:\r\n|\r|\n)/g, '\\n')
       .replace(/"/g, '\\"') 
      ?? ""
    :
    value+"" // undefined.toString() causes an error
  }
  
  translate_nodeValues_to_dotValues( node_o )
  {
    const view_summary = this.project_lod == "title only"
    
    const labelAndDescription = 
      node_o.rdfDescription ?
      `${node_o.rdfLabel}: ${node_o.rdfDescription}`
      :
      node_o.rdfLabel
  
    const result = new Map( Object.entries( node_o ) )

    if( node_o.rdfLabel )
    if( view_summary )
    {
      // event.isExpanded    = false // TODO: finish turning this flag into a CSS class
      result.set( "graphvizLabel", node_o.rdfLabel )
      
      if( node_o.rdfDescription )
      result.set( "htmlTooltip",  labelAndDescription )
    }
    else 
    {
      //event.isExpanded    = true // TODO: finish turning this flag into a CSS class
      result.set( "graphvizLabel", labelAndDescription )
      result.set( "htmlTooltip",   " " ) // we don't want a tooltip because the description is already rendered as label
    }

    if( node_o.rdfLabel )
    result.set
    ( "graphvizShape",
      node_o.rdfLabel[0].search(/[a-zA-Z0-9]/) // if label begins with non-alpha character (an icon) then don't use boxed shape 
      ?
      "none" 
      :
        node_o.rdfDescription
        ?
        "note"
        :
        "none"  // if there is NO rdfDescription then we don't render the event with the visually heavier box because the event won't expand to a larger box in "details" mode
    )
    
    remap( "rdfLabel",      "label"   ) // generic label (typically short)
    remap( "graphvizLabel", "label"   ) // specific graphviz label - could be long if 'expanded'; overwrites "rdfLable"
    
    remap( "graphvizShape", "shape"   )
    
    remap( "rdfDescription","tooltip" ) // generic tooltip from description (if any)
    remap( "htmlTooltip"  , "tooltip" ) // an explicit tooltip, e.g. constructed through expansion
    
    return result
  
    function remap(from_name, to_name)
    {
      if( result.has( from_name ) )
          result.set(   to_name ,
          result.get( from_name )
         )
    }
  }

}

