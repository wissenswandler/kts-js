import React    from 'react';
import ReactDOM from 'react-dom';
import App      from './App';
import Context  from './Context';

import '@atlaskit/css-reset';

/*
 * test the Context component
 *
ReactDOM.render(
    <React.StrictMode>
        <Context />
    </React.StrictMode>,
    document.getElementById('context')
);
*/
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.querySelector('.ktscontainer')
);