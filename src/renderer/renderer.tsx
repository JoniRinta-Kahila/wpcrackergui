/**
 * React renderer.
 */
// Import the styles here to process them with webpack
import '_public/style.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from '../app/app';
import DarkmodeContextProvider from '_/app/context/darkmodeContextProvider';

ReactDOM.render(
  <DarkmodeContextProvider>
    <App/>
  </DarkmodeContextProvider>
, document.getElementById('app'));

