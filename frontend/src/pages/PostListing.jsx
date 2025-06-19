import { useState, useRef } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';

const PostListingPage = () => {
  const [title, setTitle] = useState("");
  const [askingPrice, setAskingPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isGeneratingPrice, setIsGeneratingPrice] = useState(false);
  const [images, setImages] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleGeneratePrice = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill in both title and description before generating a price.");
      return;
    }

    setIsGeneratingPrice(true);
    try {
      const response = await api.post("/listings/generate_price", {
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('Please select only image files.');
      return;
    }

    if (images.length + imageFiles.length > 5) {
      alert('You can upload a maximum of 5 images.');
      return;
    }

    const newImages = imageFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (imageId) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== imageId);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      alert("Please upload at least one image for your listing.");
      return;
    }

    setIsUploading(true);
    try {
      // Create FormData for multipart/form-data upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('asking_price', askingPrice);
      formData.append('description', description);
      
      // Append each image file
      images.forEach((image, index) => {
        formData.append(`images`, image.file);
      });

      await api.post("/listings/submit", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      alert("Listing posted successfully!");
      navigate("/seller-dashboard");
    } catch (err) {
      console.error("Error posting listing:", err);
      alert("Failed to post listing. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const isGeneratePriceEnabled = title.trim() && description.trim();

  return (
    <div className="max-w-6xl mx-auto mt-8 p-4">
      <h2 className="text-xl font-bold text-center mb-8">Sell an Item</h2>
      
      <div className="flex justify-center items-start gap-12">
        {/* Image Upload Section */}
        <div className="w-80">
          <div 
            className={`p-6 bg-slate-900 rounded-lg border-2 border-dashed transition-colors ${
              isDragOver ? 'border-blue-400 bg-slate-800' : 'border-slate-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <h3 className="text-lg font-semibold mb-4 text-white">Upload Images</h3>
            
            {images.length === 0 ? (
              <div className="text-center">
                <div className="mb-4">
                  <Upload className="mx-auto h-12 w-12 text-slate-300" />
                </div>
                <p className="text-sm text-slate-300 mb-4">
                  Drag and drop images here, or click to select files
                </p>
                <button 
                  type="button"
                  className="btn btn-sm btn-outline text-white border-white hover:bg-white hover:text-slate-900"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-300">
                    {images.length}/5 images
                  </p>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline text-white border-white hover:bg-white hover:text-slate-900"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Add More
                  </button>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.preview}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded border border-slate-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}
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
              <button 
                className="btn btn-primary" 
                type="submit"
                disabled={isUploading}
              >
                {isUploading ? 'Posting...' : 'Post Listing'}
              </button>
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
