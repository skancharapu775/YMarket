import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Listing from './components/Listing.jsx'
import {Routes, Route} from 'react-router-dom';
import ListingsPage from './pages/ListingsPage.jsx'
import ListingDetail from './pages/ListingDetail.jsx'
import SellerDashboard from './pages/SellerDashboard.jsx'
import LoginPage from './pages/LoginPage';
import PostListingPage from './pages/PostListing.jsx'

function App() {
  return (
    <div className='pt-18'>
      <Routes>
        <Route path="/" element={<ListingsPage />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/post-listing" element={<PostListingPage/>}></Route>
        <Route path="/listing" element={<ListingsPage/>}></Route>
        <Route path="/listing/:id" element={<ListingDetail />} />
      </Routes>
    </div>
  )
}

export default App