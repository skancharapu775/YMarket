import React from 'react'
import { useState } from 'react';
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import axios from 'axios';

const UnsoldListing = ({item, currentListingIdRef, setInterestedUsers, setAmountReceived, 
                        setManualEmail, setSelectedUserId, selectedUserId, }) => {
    const openMarkAsSold = async (listingId) => {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8000/listings/contact-log/${listingId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInterestedUsers(res.data);
        setSelectedUserId(null);
        setManualEmail("");
        setAmountReceived("");
        currentListingIdRef.current = listingId
        document.getElementById("mark-as-sold-modal").showModal();
      };

  return (
    <>

        <div
            key={item.id}
            className="bg-base-200 rounded-xl p-4 shadow flex justify-between items-center"
            >
            <div>
                <h3 className="font-medium text-white">{item.title}</h3>
                <p className="text-sm text-base-content/70">${item.asking_price}</p>
            </div>
            <div className="flex gap-2">
                <button
                className="btn btn-sm btn-outline btn-warning"
                onClick={() => openMarkAsSold(item.id)}
                >
                Mark as Sold
                </button>
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
    </>
  )
}

export default UnsoldListing