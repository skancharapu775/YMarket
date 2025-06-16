import { Link } from "react-router-dom";
import { Store } from 'lucide-react';

function Navbar() {
    return (
        <header
          className="border-b border-base-300 fixed w-full top-0 z-50  h-18
        backdrop-blur-lg bg-base-100/80 pb-10"
        >
          <div className="container mx-auto px-4 h-16">
            <div className="flex items-center justify-between h-full">
              {/* Left Side: Logo */}
              <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-2.5 hover:opacity-70 transition-all">
                  <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Store className="w-6 h-6 text-blue-700" />
                  </div>
                  <h1 className="text-lg font-bold">yMarkets</h1>
                </Link>
              </div>
    
              {/* Right Side: Links */}
              <div className="flex items-center gap-3">
                <Link
                    to="/"
                    className="btn btn-sm btn-outline text-blue-700 normal-case"
                  >
                    Sell an item
                </Link>
              </div>
            </div>
          </div>
        </header>
  );
}

export default Navbar;