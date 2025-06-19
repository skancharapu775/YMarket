import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, User, WandSparkles, TriangleAlert } from 'lucide-react';
import api from '../utils/api';
import axios from 'axios';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");

  const handleContactSeller = async (listingId) => {
        try {
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:8000/listings/contact-log/", 
            { listing_id: listingId},
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        );
        setSellerEmail(res.data["contact_email"]);
        setSellerPhone(res.data["contact_phone"]);
        document.getElementById('contact-info').showModal()
        } catch (error) {
        console.error("Error fetching contact info:", error);
        setSellerEmail("Something went wrong.");
        document.getElementById('contact-info').showModal();
        }
    }

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Fetch listing details
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/listings/${id}`);
        setListing(response.data);
        console.log(response.data)
      } catch (err) {
        console.error('Failed to fetch listing:', err);
        if (err.response && err.response.status === 404) {
          setError('Listing not found');
        } else {
          setError('Failed to load listing details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
    
  }, [id]);

//   const handleMessageSeller = () => {
//     if (!isLoggedIn) {
//       alert('Please log in to message the seller');
//       navigate('/login');
//       return;
//     }
//     // TODO: Implement messaging functionality
//     alert('Messaging feature coming soon!');
//   };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4 mt-6">
        <div className="flex items-center justify-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4 mt-6">
        <div className="bg-error text-error-content p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button onClick={handleBack} className="btn btn-sm btn-outline mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto p-4 mt-6">
        <div className="bg-warning text-warning-content p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Listing Not Found</h2>
          <p>The listing you're looking for doesn't exist or has been removed.</p>
          <button onClick={handleBack} className="btn btn-sm btn-outline mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto p-4 mt-6 gap-4">
        <dialog id="contact-info" className="modal">
            <div className="modal-box">
            <h3 className="font-bold text-lg">Seller's contact details!</h3>
            <p className="py-4">Email: {sellerEmail}</p>
            <p className="py-4">Phone: {sellerPhone === "" ? ("Not available.") : sellerPhone}</p>
            <div className="modal-action">
                <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
                </form>
            </div>
            </div>
      </dialog>
      {/* Back Button */}
      <button 
        onClick={handleBack}
        className="btn btn-outline btn-sm mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      {/* Listing Details */}
      <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Image Section */}
        <div className="relative">
          {listing.image ? (
            <img 
              src={listing.image} 
              alt={listing.title} 
              className="w-full h-96 object-cover"
            />
          ) : (
            <div className="w-full h-96 bg-base-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-base-content/70">No image available</p>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Title and Price */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
              <div className="flex items-center gap-2 text-base-content/70">
                <User className="w-4 h-4" />
                <span>Seller ID: {listing.owner_id}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-success">${listing.asking_price}</p>
              {listing.ai_low && listing.ai_high && (
                <div className="badge badge-info mt-2">
                  AI Estimate: ${listing.ai_low} – ${listing.ai_high}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-base-content/80 leading-relaxed">{listing.description}</p>
          </div>

          {/* Additional Details */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-base-content/70">Listed:</span>
                <span className="ml-2">{new Date(listing.created_at).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-base-content/70">Status:</span>
                <span className={`ml-2 badge ${listing.sold ? 'badge-error' : 'badge-success'}`}>
                  {listing.sold ? 'Sold' : 'Available'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-4 flex gap-4">
            <button 
              onClick={() => handleContactSeller(listing.id)}
              className="btn btn-primary flex-1"
              disabled={listing.sold}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {listing.sold ? 'Item Sold' : 'Interested? Contact the Seller'}
            </button>
            
            {!isLoggedIn && (
              <button 
                onClick={() => navigate('/login')}
                className="btn btn-outline"
              >
                Login to Message
              </button>
            )}
          </div>
        </div>
      </div>
      {listing.ai_reasoning && (
            <aside className="w-90 px-8 py-5 bg-base-100 rounded-2xl shadow-lg border border-base-300 h-fit sticky top-24 self-start">
                <div className="flex items-center mb-2 gap-2">
                <WandSparkles className="h-6 w-6 text-info" />
                <h2 className="text-lg font-semibold text-info">How was this price estimated?</h2>
                </div>
                <p className="text-md text-base-content/90 leading-relaxed whitespace-pre-wrap">
                {listing.ai_reasoning}
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs text-base-content/60 bg-warning/10 border border-warning px-3 py-2 rounded-lg">
                    <TriangleAlert className="w-5 h-5 text-warning" />
                    <span>
                        Price estimates are generated by AI and may be inaccurate. Please use your own judgment.
                    </span>
                </div>
          </aside>
        )}
    </div>
  );
};

export default ListingDetail;