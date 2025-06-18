import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function SellerDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <Link
          to="/post-listing"
          className="btn btn-primary normal-case flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Listing
        </Link>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">Welcome to your seller dashboard. This page is under construction.</p>
      </div>
    </div>
  );
} 