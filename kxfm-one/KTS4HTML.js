 /*
  * helper functions for HTML documents
  *
  * (or for any generic DOM manipulation except for SVG specifics - see KTS4SVG)
  *
  * and for the HTTP protocol
  */
export class KTS4HTML
{
  static URL_PARAMETER_VALUES_SEPARATOR = ','

  static    get_url_param( param_name, default_if_no_url_parameter ) 
  { 
    return  get_url_param( param_name, default_if_no_url_parameter );
  }
}

 /*
  * read URL parameters
  * returns the "default" (second) function parameter (or 'undefined') if URL parameter is absent
  * otherwise
  * returns an array, which is the result of parsing the parameter's value as (comma-)separated list
  * special case: array with one element "" if parameter is present but no value defined ("param=" )
  */  
export function get_url_param( param_name, default_if_no_url_parameter ) 
{ 
  const  values = new URLSearchParams(location.search)
                  .get(       param_name )?.split( KTS4HTML.URL_PARAMETER_VALUES_SEPARATOR )

  return values ?? default_if_no_url_parameter;
}
