import { useEffect, useState } from 'react';
import { view } from '@forge/bridge';

function Context()
{
    const [data, setData] = useState( 'thinking...' );

    useEffect
    (   () =>
        {
            view.getContext().then( setData );
        }
    );

    return JSON.stringify( data );  // Objects are not valid as a React child
}

export default Context;