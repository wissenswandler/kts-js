var transformer = null; // re-usable, expensive graphviz instance (takes 500 ms to load)

import {Tdot2svgStrings} from "@kxfm/dot2svg/Tdot2svgStrings.js";

console.debug( "KTS worker importing graphviz" );
import { Graphviz } from "https://cdn.jsdelivr.net/npm/@hpcc-js/wasm/dist/index.js";

// waiting for promise here on module top-level (both with .then OR await) causes the worker to hang without trace of error

console.debug( "KTS worker waiting for connection..." );
addEventListener
(   "connect", async connection_event =>
{
    console.debug( "KTS worker received new connection..." );
    if( transformer )
    {
        console.debug( "KTS worker reusing graphviz" );
    }
    else
    {
        console.debug( "KTS worker LOADING graphviz" );
        transformer = new Tdot2svgStrings( await Graphviz.load() );
    }

    const port = connection_event.ports[0];
    
    port.addEventListener
    (   'message', message_event =>
    {
        console.debug( "KTS worker received request, returning SVG" );
        port.postMessage(  transformer.dot2svg( message_event.data )  );
        //port.postMessage(  '<svg><text x="10" y="20">pong ' + i++ + '</svg></svg>'  );
    }
    );
    port.start();
    console.debug( "KTS worker waiting for messages..." );
}
);