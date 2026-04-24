import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// import { Builder } from '@builder.io/react';
import './index.css';
import './animations.css';
import App from './App';

// Initialize Builder.io
// Public API key - safe to use in client-side code
// Builder.init('d243c27cb2074c58bfb9325c6e5adf1b');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
