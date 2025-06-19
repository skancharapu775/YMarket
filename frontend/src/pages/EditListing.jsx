import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import api from "../utils/api";

export default function EditListing() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    asking_price: ""
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listings/${listingId}`);
        const listingData = response.data;
        setListing(listingData);
        setFormData({
          title: listingData.title,
          description: listingData.description,
          asking_price: listingData.asking_price.toString()
        });
      } catch (error) {
        console.error("Failed to fetch listing:", error);
        if (error.response?.status === 404) {
          alert("Listing not found");
        } else if (error.response?.status === 403) {
          alert("You are not authorized to edit this listing");
        } else {
          alert("Failed to load listing. Please try again.");
        }
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        asking_price: parseFloat(formData.asking_price)
      };

      await api.put(`/listings/${listingId}`, updateData);
      alert("Listing updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to update listing:", error);
      alert("Failed to update listing. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-ghost btn-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-center">Edit Listing</h1>
      </div>

      <div className="bg-base-200 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
              placeholder="Enter listing title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="textarea textarea-bordered w-full"
              placeholder="Describe your item"
            />
          </div>

          <div>
            <label htmlFor="asking_price" className="block text-sm font-medium mb-2">
              Asking Price ($)
            </label>
            <input
              type="number"
              id="asking_price"
              name="asking_price"
              value={formData.asking_price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="input input-bordered w-full"
              placeholder="0.00"
            />
          </div>

          {listing && (
            <div className="bg-base-300 rounded-lg p-4">
              <h3 className="font-medium mb-2">AI Price Suggestions</h3>
              <div className="text-sm space-y-1">
                <p>Low: ${listing.ai_low || "N/A"}</p>
                <p>High: ${listing.ai_high || "N/A"}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary flex items-center gap-2"
            >
              {saving ? (
                <div className="loading loading-spinner loading-sm"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="btn btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 