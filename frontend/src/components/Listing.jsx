// Listing. Singular on landing page. 
import React from 'react'

const Listing = ({item}) => {
  return (
    <div className="card card-side bg-base-300 shadow-md my-5">
      {/* Image */}
      <figure className="w-32 h-32 overflow-hidden">
        <img src={item.image || "https://via.placeholder.com/100"} alt={item.title} className="object-cover w-full h-full" />
      </figure>

      {/* Main content */}
      <div className="flex justify-between items-start w-full px-4 py-2">
        {/* Description */}
        <div className="flex flex-col justify-between flex-grow">
          <div>
            <h2 className="text-lg font-bold hover:text-blue-500 cursor-pointer transition-colors duration-100">{item.title}</h2>
            <p className="text-sm text-base-content/70">{item.condition} · {item.category}</p>
            <p className="text-sm mt-1 line-clamp-2">{item.description}</p>
          </div>
        </div>

        {/* AI Price Summary */}
        <div className="flex flex-col items-end ml-4 min-w-[120px] text-right">
          <p className="font-bold text-lg text-success">${item.askingPrice}</p>
          <div className="badge badge-info mt-1">
            Est. ${item.aiLow} – ${item.aiHigh}
          </div>
          <p className="text-xs text-base-content/60 mt-1">AI estimate</p>
        </div>
      </div>
    </div>
  )
}

export default Listing