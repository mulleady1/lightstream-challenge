import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import registerServiceWorker from './registerServiceWorker';

global._debug = require('debug');

const baseURL = process.env.NODE_ENV === 'development' ? 
  'http://localhost:3003' : 
  '';

ReactDOM.render(<App baseURL={baseURL} />, document.getElementById('root'));
registerServiceWorker();
