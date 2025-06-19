import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Package, CheckCircle, DollarSign, TrendingUp, Plus } from 'lucide-react';
import api from '../utils/api';
import UnsoldListing from "../components/UnsoldListing";
import axios from 'axios';

export default function SellerDashboard() {
  const [unsoldListings, setUnsoldListings] = useState([]);
  const [userStats, setUserStats] = useState({
    items_listed: 0,
    items_sold: 0,
    total_revenue: 0,
    ai_savings: 0
  });
  const [loading, setLoading] = useState(true);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [manualEmail, setManualEmail] = useState("");
  const [amountReceived, setAmountReceived] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const currentListingIdRef = useRef(null);
  const selectedUserIdRef = useRef(null);

  const submitMarkAsSold = async () => {
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:8000/listings/transactions/complete",
      {
        listing_id: currentListingIdRef.current,
        amount_received: parseFloat(amountReceived),
        buyer_id: selectedUserId || null,
        buyer_email: manualEmail || null
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Transaction recorded!");
    document.getElementById("mark-as-sold-modal").close();
  };
  
  
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsRes, statsRes] = await Promise.all([
          api.get("/listings/my-unsold"),
          api.get("/listings/stats/user")
        ]);
        setUnsoldListings(listingsRes.data);
        setUserStats(statsRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      <dialog id="mark-as-sold-modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Mark as Sold</h3>

                <label className="label">Select buyer</label>
                <select
                className="select select-bordered w-full"
                value={selectedUserId || ""}
                onChange={(e) => setSelectedUserId(parseInt(e.target.value))}
                >
                <option value="">-- Select from interested buyers --</option>
                {interestedUsers.map((u) => (
                    <option key={u.user_id} value={u.user_id}>{u.email}</option>
                ))}
                </select>

                <label className="label mt-2">Or enter buyer's email manually</label>
                <input
                type="email"
                className="input input-bordered w-full"
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
                />

                <label className="label mt-2">Amount Received</label>
                <input
                type="number"
                step="0.01"
                className="input input-bordered w-full"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                />

                <div className="modal-action">
                <button className="btn" onClick={submitMarkAsSold}>Submit</button>
                <form method="dialog"><button className="btn">Cancel</button></form>
                </div>
            </div>
        </dialog>
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
      <div className="bg-slate-900 shadow rounded-lg p-6">
        <p className="text-white">Welcome to your seller dashboard! You can edit, delete, and view your listings here.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-10">
        {/* Left Column - Stats */}
        <div className="col-span-1 bg-base-200 rounded-xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-4">📊 Your Stats</h2>
          {loading ? (
            <div className="space-y-2">
              <div className="loading loading-spinner loading-sm"></div>
              <p className="text-sm text-gray-400">Loading stats...</p>
            </div>
          ) : (
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-500" />  
                Items Listed: <span className="font-medium">{userStats.items_listed}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> 
                Items Sold: <span className="font-medium">{userStats.items_sold}</span>
              </li>
              <li className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-yellow-500" /> 
                Revenue: <span className="font-medium">${userStats.total_revenue}</span>
              </li>
              <li className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                Buying Savings: <span className="font-medium">${userStats.ai_savings}</span>
              </li>
            </ul>
          )}
        </div>

        {/* Right Column - Unsold Listings */}
        <div className="col-span-1 lg:col-span-3 space-y-4">
          <h2 className="text-lg font-semibold">🧾 Unsold Listings</h2>
          {unsoldListings.length === 0 ? (
            <p className="text-sm text-gray-400">No unsold listings yet.</p>
          ) : (
            unsoldListings.map((item) => (
              <UnsoldListing 
                item={item}
                currentListingIdRef={currentListingIdRef}
                setInterestedUsers={setInterestedUsers}
                setAmountReceived={setAmountReceived} 
                setManualEmail={setManualEmail}
                SelectedUserId={selectedUserId}
                setSelectedUserId={setSelectedUserId}
              />
            ))
          )}
        </div>
    </div>
    </div>
  );
} 