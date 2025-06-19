import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Package, CheckCircle, DollarSign, TrendingUp } from 'lucide-react';
import api from '../utils/api';

export default function SellerDashboard() {
  const [unsoldListings, setUnsoldListings] = useState([]);
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    api.get("/listings/my-unsold")
      .then((res) => setUnsoldListings(res.data))
      .catch((err) => console.error("Failed to fetch listings", err));
  }, []);

  const handleDelete = async (listingId) => {
    if (window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      try {
        await api.delete(`/listings/${listingId}`);
        // Remove the deleted listing from the local state
        setUnsoldListings(prevListings => 
          prevListings.filter(listing => listing.id !== listingId)
        );
      } catch (error) {
        console.error("Failed to delete listing:", error);
        alert("Failed to delete listing. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          to="/post-listing"
          className="btn btn-primary normal-case flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Listing
        </Link>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">Welcome to your seller dashboard. This page is under construction.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-10">
        {/* Left Column - Stats */}
        <div className="col-span-1 bg-base-200 rounded-xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-4">📊 Your Stats</h2>
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-500" />  Items Listed: 
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" /> 
              Items Sold: <span className="font-medium"></span>
            </li>
            <li className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-yellow-500" /> 
              Revenue: <span className="font-medium">$</span>
            </li>
            <li>🧠 AI Savings for buyers: $</li>
          </ul>
        </div>

        {/* Right Column - Unsold Listings */}
        <div className="col-span-1 lg:col-span-3 space-y-4">
          <h2 className="text-lg font-semibold">🧾 Unsold Listings</h2>
          {unsoldListings.length === 0 ? (
            <p className="text-sm text-gray-400">No unsold listings yet.</p>
          ) : (
            unsoldListings.map((item) => (
              <div
                key={item.id}
                className="bg-base-200 rounded-xl p-4 shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium text-white">{item.title}</h3>
                  <p className="text-sm text-base-content/70">${item.asking_price}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/edit/${item.id}`}
                    className="btn btn-sm btn-outline"
                  >
                    Edit
                  </Link>
                  <button 
                    className="btn btn-sm btn-error"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
    </div>
    </div>
  );
} 