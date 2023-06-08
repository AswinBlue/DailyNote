import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ContextProvider } from './Contexts/ContextProvider';
import { GAPI } from './API/GAPI';
import { BrowserRouter } from 'react-router-dom';
import { registerLicense } from '@syncfusion/ej2-base';

// set Syncfusion Key
registerLicense(process.env.REACT_APP_SYNCFUSION_LICENSE_KEY);
ReactDOM.render(
  <React.StrictMode>
    {/* routing을 위한 세팅 */}
    <BrowserRouter>
      <GAPI>
        <ContextProvider>
          <App />
        </ContextProvider>
      </GAPI>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
