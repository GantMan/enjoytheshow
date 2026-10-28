import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import './App.css'
import Router from './Router'

const root = document.getElementById('root')
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </React.StrictMode>
)

// The homepage is prerendered at build time; every other route renders client-side
if (location.pathname === '/' && root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  root.textContent = ''
  createRoot(root).render(app)
}
document.documentElement.classList.remove('spa-route')
