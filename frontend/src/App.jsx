import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './components/navbar.jsx'
import './App.css'
import Listing from './components/Listing.jsx'
import {Routes, Route} from 'react-router-dom';
import ListingsPage from './pages/ListingsPage.jsx'

function App() {
  return (
    <div className='pt-18'>
      <Routes>
        <Route path="/" element={<ListingsPage/>}></Route>
      </Routes>
    </div>
  )
}

export default App