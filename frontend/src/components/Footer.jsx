import { Link } from 'react-router-dom'
import { HiOutlineHeart } from 'react-icons/hi'
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t-2 border-pink-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🧶</span>
              <span className="font-serif text-xl font-bold text-hotpink-600">Knotify</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Handcrafted with love. Every stitch tells a story of warmth, care, and creativity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-gray-800 mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-sm text-gray-500 hover:text-peach-500 transition-colors">All Products</Link></li>
              <li><Link to="/products?category=Amigurumi" className="text-sm text-gray-500 hover:text-peach-500 transition-colors">Amigurumi</Link></li>
              <li><Link to="/products?category=Bags" className="text-sm text-gray-500 hover:text-peach-500 transition-colors">Bags</Link></li>
              <li><Link to="/products?category=Clothing" className="text-sm text-gray-500 hover:text-peach-500 transition-colors">Clothing</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-medium text-gray-800 mb-4">Help</h4>
            <ul className="space-y-2">
              <Link
    to="/shipping"
    className="hover:text-hotpink-500 transition-colors"
>
    Shipping Info
</Link>
              <Link
    to="/returns"
    className="hover:text-hotpink-500 transition-colors"
>
    Returns & Exchanges
</Link>
              <Link
    to="/care"
    className="hover:text-hotpink-500 transition-colors"
>
    Care Instructions
</Link>
              <Link
    to="/contact"
    className="hover:text-hotpink-500 transition-colors"
>
    Contact Us
</Link>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-medium text-gray-800 mb-4">Stay Cozy</h4>
            <p className="text-sm text-gray-500 mb-3">Get updates on new drops & exclusive offers.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 rounded-xl bg-pink-50 border-2 border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-hotpink-300"
              />
              <button className="px-4 py-2 bg-hotpink-500 text-white rounded-xl text-sm font-bold hover:bg-hotpink-600 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-peach-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © 2026 Knotify. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            Made with <HiOutlineHeart className="w-4 h-4 text-hotpink-400" /> and lots of yarn
          </p>
        </div>
      </div>
    </footer>
  )
}
