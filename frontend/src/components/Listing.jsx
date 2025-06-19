// Listing. Singular on landing page. 
import React from 'react'
import { Link } from 'react-router-dom'

const Listing = ({item}) => {
  // Get the first image from the images array, or use a placeholder
  const firstImage = item.images && item.images.length > 0 ? item.images[0] : null;
  const imageUrl = firstImage ? `http://localhost:8000/uploads/${firstImage.filename}` : null;

  return (
    <div className="card card-side bg-base-300 shadow-sm my-6 rounded-2xl hover:shadow-lg transition-all duration-200">
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
        <div className="flex flex-col items-end ml-4 min-w-[120px] text-right">
          <p className="font-bold text-lg text-success">${item.asking_price}</p>
          {item.ai_low != null && item.ai_high != null ? (
            <div className="badge badge-info mt-1">
              Est. ${item.ai_low} – ${item.ai_high}
            </div>
          ) : (
            <div className="badge badge-info mt-1">Est. N/A</div>
          )}
          <p className="text-xs text-base-content/70 mt-1">AI estimate</p>
        </div>
      </div>
    </div>
  )
}

export default Listing