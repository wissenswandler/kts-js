import { html             } from "npm:htl"
import * as d3              from "npm:d3"

export const kts_console = d3.create( 'div' )
                            .attr( "id", "ktsConsole" )
                            .text( "KTS loading..."   )
                            .node()
