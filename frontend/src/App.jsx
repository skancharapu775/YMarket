import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Listing from './components/Listing.jsx'
import {Routes, Route, Navigate} from 'react-router-dom';
import ListingsPage from './pages/ListingsPage.jsx'
import ListingDetail from './pages/ListingDetail.jsx'
import SellerDashboard from './pages/SellerDashboard.jsx'
import LoginPage from './pages/LoginPage';
import PostListingPage from './pages/PostListing.jsx'
import EditListing from './pages/EditListing.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <div className='pt-18'>
      <Routes>
        <Route path="/" element={<ListingsPage />} />
        <Route path="/dashboard" element={<Navigate to="/seller-dashboard" replace />} />
        <Route path="/seller-dashboard" element={<ProtectedRoute child={<SellerDashboard /> }></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/post-listing" element={<ProtectedRoute child={<PostListingPage/>}></ProtectedRoute>}></Route>
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/edit/:listingId" element={<ProtectedRoute child={<EditListing />}></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App