import * as d3              from "d3"

export const kts_console = d3.create( 'div' )
                            .attr( "id", "ktsConsole" )
                            .text( "KTS loading..."   )
                            .node()
