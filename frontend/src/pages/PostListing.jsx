import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostListingPage = () => {
  const [title, setTitle] = useState("");
  const [askingPrice, setAskingPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isGeneratingPrice, setIsGeneratingPrice] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleGeneratePrice = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill in both title and description before generating a price.");
      return;
    }

    setIsGeneratingPrice(true);
    try {
      const response = await axios.post("http://localhost:8000/listings/generate_price", {
        title: title,
        description: description,
      });
      
      if (response.data && response.data.suggested_price) {
        setAskingPrice(response.data.suggested_price.toString());
        alert(`Suggested price: $${response.data.suggested_price}`);
      }
    } catch (err) {
      console.error("Error generating price:", err);
      alert("Failed to generate price. Please try again.");
    } finally {
      setIsGeneratingPrice(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/listings/submit", {
        title,
        asking_price: parseFloat(askingPrice),
        description,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Listing posted!");
      navigate("/listings");
    } catch (err) {
      alert("You must be logged in to post.");
      navigate("/login");
    }
  };

  const isGeneratePriceEnabled = title.trim() && description.trim();

  return (
    <div className="max-w-6xl mx-auto mt-8 p-4">
      <h2 className="text-xl font-bold text-center mb-8">Sell an Item</h2>
      
      <div className="flex justify-center items-start gap-12">
        {/* Image Upload Section */}
        <div className="w-80 p-6 bg-slate-900 rounded-lg border-2 border-dashed border-slate-500">
          <h3 className="text-lg font-semibold mb-4 text-white">Upload Images</h3>
          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-slate-300" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              Drag and drop images here, or click to select files
            </p>
            <button className="btn btn-sm btn-outline text-white border-white hover:bg-white hover:text-slate-900">
              Choose Files
            </button>
          </div>
        </div>
        
        {/* Form Section */}
        <div className="w-96 p-4 bg-base-100 shadow rounded-lg space-y-4">
          <form className="flex flex-col gap-3 items-center" onSubmit={handleSubmit}>
            <input 
              className="input input-bordered w-full" 
              placeholder="Title" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
            />
            <textarea 
              className="textarea textarea-bordered w-full" 
              placeholder="Description" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              required 
            />
            
            <input 
              className="input input-bordered w-full" 
              placeholder="Price" 
              value={askingPrice} 
              onChange={e => setAskingPrice(e.target.value)} 
              required 
            />
            
            <div className="flex gap-2 justify-center w-full">
              <button 
                type="button"
                className={`btn ${isGeneratePriceEnabled ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-disabled'}`}
                onClick={handleGeneratePrice}
                disabled={!isGeneratePriceEnabled || isGeneratingPrice}
              >
                {isGeneratingPrice ? 'Generating...' : 'Recomend Price'}
              </button>
              <button className="btn btn-primary" type="submit">Post Listing</button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Note Section Below */}
      <div className="mt-8 max-w-4xl mx-auto p-6 bg-slate-900 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-center text-white">Note for Sellers</h3>
        <p className="text-sm text-slate-300 text-center leading-relaxed">
          Please ensure your item description is accurate and includes all relevant details. 
          High-quality photos and honest descriptions help your items sell faster. 
          Remember to respond promptly to buyer inquiries!
        </p>
      </div>
    </div>
  );
};

export default PostListingPage;
