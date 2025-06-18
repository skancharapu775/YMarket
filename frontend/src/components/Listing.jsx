// Listing. Singular on landing page. 
import React from 'react'

const Listing = ({item}) => {
  return (
    <div className="card card-side bg-base-300 shadow-sm my-6 px-3 rounded-2xl hover:shadow-lg transition-all duration-200">
      {/* Image */}
      <figure className="w-32 h-32 overflow-hidden">
        {item.image 
        ? (<img src={item.image || "https://via.placeholder.com/100"} alt={item.title} className="object-cover w-full h-full" />) 
        : (<div className='w-25 h-25 flex bg-base-100 items-center justify-center rounded-xl '>
            <p className="text-sm text-base-content line-clamp-2 ml-4">No image available.</p>
            </div>)}
        
      </figure>

      {/* Main content */}
      <div className="flex justify-between items-start w-full px-4 py-2">
        {/* Description */}
        <div className="flex flex-col justify-between flex-grow">
          <div>
            <h2 className="text-xl font-bold hover:text-blue-500 cursor-pointer transition-colors duration-100">{item.title}</h2>
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