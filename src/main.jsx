import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './i18n/config.js'

const saved = localStorage.getItem('bashar-lang')
const lang  = saved ? saved : 'en'
document.documentElement.lang = lang
document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
