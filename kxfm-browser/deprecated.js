/*
 *
 * Collection of now-deprecated functions
 *
 */

// pseudo compatibility with nodejs so that REPL can try to load this module
// of course: using 'document' in nodejs will fail
const document = globalThis.document ?? {}

/*
 * DEPRECATED: 
 * creating the KTS console in a markdown expression will delay the rendering,
 * which prevents KTS initialization on the console.
 * the only way to support initialization is to create the console with verbatim text,
 * like so:
 * <div id="ktsConsole">KTS loading...</div>
 */
export
const               create_kts_console = () =>
{
  try{
  const div = document.createElement( 'div' )
  div.setAttribute( "id", "ktsConsole" )
  div.innerText =  "KTS loading..."
  return div
  } catch( error ) { /*probably REPL*/ }
}
export
const kts_console = create_kts_console()

