import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // This imports your Tailwind styles
import App from './App'; // This imports your main routing logic

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);