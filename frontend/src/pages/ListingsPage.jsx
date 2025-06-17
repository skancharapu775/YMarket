import { useState, useEffect } from "react";
import React from 'react'
import Listing from "../components/Listing";
import { ChevronDown } from "lucide-react";

const ListingsPage = () => {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("recent")
    const mockItem = {
        title: "Mini Fridge",
        image: "https://example.com/fridge.jpg",
        category: "Appliances",
        condition: "Used – Good",
        description: "Works perfectly, just moving out. Light scratches on the side.",
        askingPrice: 40,
        aiLow: 35,
        aiHigh: 45
      };
      const mockItem1 = {
        title: "Mini Fridge",
        image: "https://example.com/fridge.jpg",
        category: "Appliances",
        condition: "Used – Good",
        description: "Works perfectly, just moving out. Light scratches on the side.",
        askingPrice: 40,
        aiLow: 35,
        aiHigh: 45
      };
    const [listings, setListings] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8000/listings/get")
          .then((res) => res.json())
          .then((data) => setListings(data))
          .catch((err) => console.error("Failed to fetch listings", err));
    }, []);

    return (
      <div className="min-h-screen bg-base-200 py-6 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
  
          {/* Search Bar */}
          <div className="bg-base-100 rounded-lg shadow p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <input
                type="text"
                placeholder="Search items..."
                className="input input-bordered w-full sm:w-3/4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-outline btn-sm">
                Sort by: {sortBy === "recent" ? "Recent" : "Price"} <ChevronDown className="w-4 h-4 ml-1" />
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32">
                <li><button onClick={() => setSortBy("recent")}>Recent</button></li>
                <li><button onClick={() => setSortBy("price")}>Price</button></li>
                </ul>
            </div>
        </div>
  
          {/* Listings */}
          <div className="bg-base-100 rounded-xl shadow-md px-8 py-5 space-y-10 w-full border border-base-300">
            {listings.map((item, i) => (
                <Listing item={item} key={i} />
            ))}
          </div>
          
        </div>
    
    </div>
    );
}

export default ListingsPage