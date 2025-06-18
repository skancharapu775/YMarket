import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider,} from '@react-oauth/google';
import Navbar from './components/navbar.jsx';
import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="89565253405-se6bp162e4s5do2ei6nk2ip064kmjp77.apps.googleusercontent.com">
  <StrictMode>
      <BrowserRouter>
        
          <Navbar></Navbar>
          <App />
        </BrowserRouter>
      
    </StrictMode>
  </GoogleOAuthProvider>
)