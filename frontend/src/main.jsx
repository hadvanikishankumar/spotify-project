import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ReactDOM.createRoot finds the <div id="root"> in index.html
// and renders our entire React app inside it
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>   {/* Helps detect bugs in development */}
    <App />
  </React.StrictMode>,
)