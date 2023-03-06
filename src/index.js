import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ContextProvider } from './Contexts/ContextProvider';
import { GAPI } from './API/GAPI';
import { registerLicense } from '@syncfusion/ej2-base';
registerLicense(process.env.SYNCFUSION_API_KEY);

ReactDOM.render(
  <React.StrictMode>
    <GAPI>
      <ContextProvider>
        <App />
      </ContextProvider>
    </GAPI>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
