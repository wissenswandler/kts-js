/*
 * lightweight KTS lib for node.js
 *
 * depends on filesystem
 * does not work in Forge FaaS or Browser
 */
 
import   * as fs           from 'fs';
import { Tdot2svgStrings } from '@kxfm/one';

export class Tdot2svgFiles
{

/*
 * build diagram from DOT source file

	here is a character class, for use with regex, that will find all kinds of whitespace:
	[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]
	this helps in case of "warning: no value for width of non-ascii character"
 */
static build_diagram_from_file( dotsource_filename, svgproduct_filename, graphviz, libPath )
{
  let dot_string

	fs.readFile
  (
    dotsource_filename, 
    'utf8', 
    function (err, data) 
    {
		  if (err) 
      {
			  return console.error(chalk.red(err));
		  }


      let transformer = new Tdot2svgStrings( graphviz );

      transformer.build_diagram_from_string( data, libPath )
      .then
      ( svg_kts => 
        {
          fs.writeFile( svgproduct_filename, svg_kts, err => {
            if (err) {
              console.error( err );
            }

            else
              console.warn( svgproduct_filename + " written." );
          });
        }
      )
    }
  );
} // end build_diagram_from_file

} // end class Tdot2svgFiles
