import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Listing from './components/Listing.jsx'
import {Routes, Route} from 'react-router-dom';
import ListingsPage from './pages/ListingsPage.jsx'
import ListingDetail from './pages/ListingDetail.jsx'
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <div className='pt-18'>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/listing" element={<ListingsPage/>}></Route>
        <Route path="/listing/:id" element={<ListingDetail />} />
      </Routes>
    </div>
  )
}

export default App