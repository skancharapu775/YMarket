import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostListingPage = () => {
  const [title, setTitle] = useState("");
  const [askingPrice, setAskingPrice] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

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

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-base-100 shadow rounded-lg space-y-4">
      <h2 className="text-xl font-bold">Sell an Item</h2>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input className="input input-bordered" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input className="input input-bordered" placeholder="Price" value={askingPrice} onChange={e => setAskingPrice(e.target.value)} required />
        <textarea className="textarea textarea-bordered" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
        <button className="btn btn-primary" type="submit">Post Listing</button>
      </form>
    </div>
  );
};

export default PostListingPage;
