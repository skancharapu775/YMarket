import React from 'react'
import { useParams } from 'react-router-dom';



const ListingDetail = () => {
  const { id } = useParams();

  // Temporary: mock a fetch

  return (
    <div className="max-w-3xl mx-auto p-4 bg-base-100 rounded-xl shadow space-y-4 mt-6">
      <img src={item.image} alt={item.title} className="w-full max-h-96 object-cover rounded-md" />
      <h1 className="text-2xl font-bold">{item.title}</h1>
      <p className="text-base-content/70">{item.condition}</p>
      <p>{item.description}</p>
      <div className="badge badge-info">
        AI Estimate: ${item.aiLow} – ${item.aiHigh}
      </div>
      <p className="text-xl font-bold text-success">Seller Asking: ${item.askingPrice}</p>
      <button className="btn btn-primary mt-4">Message Seller</button>
    </div>
  );
};

export default ListingDetail