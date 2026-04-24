import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Builder } from '@builder.io/react';
import './index.css';
import './animations.css';
import App from './App';

// Initialize Builder.io
// Replace YOUR_API_KEY with your actual Builder.io API key
Builder.init('YOUR_API_KEY');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
