import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { HiOutlineShoppingBag, HiOutlineUser, HiOutlineMenu, HiOutlineX, HiOutlineSearch } from 'react-icons/hi'
import { logout } from '../store/slices/authSlice'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useSelector((state) => state.auth)
  const { items } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const categories = ['Amigurumi', 'Bags', 'Clothing', 'Home Decor', 'Accessories']

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-pink-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-hotpink-100 rounded-full flex items-center justify-center border-2 border-hotpink-300">
              <span className="text-hotpink-600 text-lg">🧶</span>
            </div>
            <span className="font-serif text-2xl font-bold text-hotpink-600 hidden sm:block">Knotify</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${isActive ? 'text-hotpink-500' : 'text-gray-700 hover:text-hotpink-400'}`
              }
            >
              Home
            </NavLink>
            
            {/* Category Dropdown */}
            <div className="relative group">
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors ${isActive ? 'text-hotpink-500' : 'text-gray-700 hover:text-hotpink-400'}`
                }
              >
                Shop
              </NavLink>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border-2 border-pink-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  to="/products"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-hotpink-50 hover:text-hotpink-500 font-medium"
                >
                  All Products
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    to={`/products?category=${cat}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-hotpink-50 hover:text-hotpink-500 font-medium"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {user?.role === 'ADMIN' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors ${isActive ? 'text-hotpink-500' : 'text-gray-700 hover:text-hotpink-400'}`
                }
              >
                Admin
              </NavLink>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crochet..."
                className="w-48 lg:w-64 pl-9 pr-4 py-2 rounded-full bg-pink-50 border-2 border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-hotpink-300 focus:w-72 transition-all duration-300"
              />
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hotpink-400" />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/cart" className="relative p-2 rounded-full hover:bg-hotpink-50 transition-colors">
                  <HiOutlineShoppingBag className="w-5 h-5 text-hotpink-500" />
                  {items.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-hotpink-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {items.length}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 rounded-full hover:bg-hotpink-50 transition-colors">
                    <HiOutlineUser className="w-5 h-5 text-hotpink-500" />
                    <span className="hidden lg:block text-sm font-medium text-gray-700">{user.username}</span>
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border-2 border-pink-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-hotpink-50 hover:text-hotpink-500 font-medium">
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-hotpink-50 hover:text-hotpink-500 font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-4">
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full hover:bg-peach-50"
            >
              {isOpen ? <HiOutlineX className="w-5 h-5" /> : <HiOutlineMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-peach-100 animate-slide-up">
          <div className="px-4 py-4 space-y-3">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search crochet..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-full bg-peach-50 border border-peach-100 text-sm focus:outline-none focus:ring-2 focus:ring-peach-200"
                />
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </form>
            <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 text-gray-600 hover:text-peach-500">
              Home
            </Link>
            <Link to="/products" onClick={() => setIsOpen(false)} className="block py-2 text-gray-600 hover:text-peach-500">
              Shop
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                onClick={() => setIsOpen(false)}
                className="block py-2 pl-4 text-sm text-gray-500 hover:text-peach-500"
              >
                {cat}
              </Link>
            ))}
            {user?.role === 'ADMIN' && (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block py-2 text-gray-600 hover:text-peach-500">
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
