import React, { useEffect, useState } from 'react'
import { invoke } from '@forge/bridge'
import { view   } from '@forge/bridge'
import Edit from './Edit';
  
import {Tdot2svgStrings} from "@kxfm/dot2svg/Tdot2svgStrings.js";
// import { Graphviz } from "https://cdn.jsdelivr.net/npm/@hpcc-js/wasm/dist/index.js" // The target environment doesn't support dynamic import() syntax so it's not possible to use external type 'module' within a script

/*
 * Forge React component to render a DOT graph as SVG from a Jira issue query
 *
 */
function App()
{
    function devdebug( message_object )
    {
        context ? devdebugInContext( context, message_object ) : console.debug( ["(no context) " , message_object] );
    };
    
    devdebug( "KTS App() entry" );

    const dom_elm_selector = ".ktscontainer";

    const [data, setData] = useState( 'KTS warming up...' );

    const [context, setContext] = useState( null );
    
    useEffect
    (   () =>
        {
            devdebug( "KTS useEffect() called back" );
            
            if( ! context )
                view.getContext().then( setContext ); // must be called from within useEffect, and within condition, to avoid endless loop
            else
            {
                if( context.extension.entryPoint != 'edit' )
                {
                    const expectedDomPattern = `${dom_elm_selector} svg`;
                    if(  document.querySelector( expectedDomPattern )  )
                    {
                        devdebug
                        (
                            `App() perform(): skipping the expensive SVG generation round-trip. Reason: expected result (${expectedDomPattern}) already exists.` 
                            );                
                            return; 
                        }
                        
                        devdebug( "KTS constructing Transformer" );
                        let transformer = new Tdot2svgStrings( graphviz );  // expecting graphviz to be a global variable (UGLY)
                        
                        devdebug( "KTS invoking FaaS" );
                        invoke
                        (   'getDotFromIssueQuery', { 'clientContext' : context } )
                            .then
                            (   (dotString) =>
                            {
                                devdebug( "KTS invoking render()" );
                                transformer.render( dotString, dom_elm_selector, context );
                                on_svg_load();
                                devdebug( "KTS done with render()" );
                            }
                            )
                        
                        devdebug( "KTS useEffect() done." );
                }
            }
        }
        ,
        [context]
    );

    if( context && context.extension.entryPoint === 'edit' )
    {
        devdebug( "KTS perform() returning <Edit>" );
        return <Edit props={context.extension.gadgetConfiguration} />;
    }
    else
    return (
        <div dangerouslySetInnerHTML={{ __html: data}} />
    );
}

function devdebugInContext( context, message_object )
{
    if
    (
      context.environmentType === 'DEVELOPMENT'
    )
    {
        console.debug( ["(devdebug) " , message_object] );
    }
}

export default App;