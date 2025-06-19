// Listing. Singular on landing page. 
import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WandSparkles } from 'lucide-react';
import axios from 'axios'

const Listing = ({item}) => {
  // Get the first image from the images array, or use a placeholder
  const [sellerEmail, setSellerEmail] = useState("")
  const [sellerPhone, setSellerPhone] = useState("")
  const firstImage = item.images && item.images.length > 0 ? item.images[0] : null;
  const imageUrl = firstImage ? `http://localhost:8000/uploads/${firstImage.filename}` : null;
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
    
  };

  return (
    <div className="card card-side bg-base-300 shadow-sm my-6  rounded-2xl hover:shadow-lg transition-all duration-200">
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
      {/* Image */}
      <figure className="w-32 h-32 overflow-hidden rounded-l-2xl">
        {imageUrl 
        ? (<img src={imageUrl} alt={item.title} className="object-cover w-full h-full" />) 
        : (<div className='w-full h-full flex bg-base-100 items-center justify-center'>
            <p className="text-sm text-base-content line-clamp-2 text-center px-2">No image available.</p>
            </div>)}
        
      </figure>

      {/* Main content */}
      <div className="flex justify-between items-start w-full px-4 py-2">
        {/* Description */}
        <div className="flex flex-col justify-between flex-grow">
          <div>
            <Link to={`/listing/${item.id}`}>
              <h2 className="text-xl font-bold hover:text-blue-500 cursor-pointer transition-colors duration-100">{item.title}</h2>
            </Link>
            <p className="text-sm text-base-content/70">{item.condition} · {item.category}</p>
            <p className="text-sm mt-1 line-clamp-2">{item.description}</p>
          </div>
        </div>

        {/* AI Price Summary */}
        <div className="flex flex-col items-end ml-4 min-w-[150px] text-right">
          <p className="font-bold text-lg text-success">${item.asking_price}</p>
          {item.ai_low != null && item.ai_high != null ? (
            <p className="badge badge-info whitespace-nowrap text-sm">
              Est. ${item.ai_low} – ${item.ai_high}
            </p>
          ) : (
            <div className="badge badge-info mt-1">Est. N/A</div>
          )}
          <p className="text-xs text-base-content/70 mt-1 inline-flex items-center gap-1"> 
            <WandSparkles className='h-3 w-3'/>AI estimate
          </p>
          <button 
            className="btn btn-sm btn-outline btn-info mt-2"
            onClick={() => handleContactSeller(item.id)}
          >
            Contact Seller
          </button>
        </div>

        
      </div>
    </div>
  )
}

export default Listing