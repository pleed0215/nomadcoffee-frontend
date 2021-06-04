import { ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { apolloClient } from './apollo/client';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    
    <App />    
  </React.StrictMode>,
  document.getElementById('root')
);

