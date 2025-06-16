import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar></Navbar>
      <App />
    </BrowserRouter>
  </StrictMode>,
)