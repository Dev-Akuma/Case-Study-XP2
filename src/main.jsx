import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// 🔹 Bootstrap CSS (GLOBAL)
import 'bootstrap/dist/css/bootstrap.min.css'

// 🔹 Your own global styles
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
