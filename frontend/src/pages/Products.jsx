import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../store/slices/productSlice'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/LoadingSkeleton'
import EmptyState from '../components/EmptyState'
import { HiOutlineAdjustments, HiOutlineX } from 'react-icons/hi'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useDispatch()
  const { products, totalPages, page, isLoading } = useSelector((state) => state.products)

  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 0)

  const categories = ['Amigurumi', 'Bags', 'Clothing', 'Home Decor', 'Accessories']

  useEffect(() => {
    const category = searchParams.get('category') || ''
    setSelectedCategory(category)
    
    dispatch(fetchProducts({
      category: category || undefined,
      maxPrice: maxPrice || undefined,
      page: currentPage,
      size: 12,
      sort: sortBy || undefined,
    }))
  }, [dispatch, searchParams, currentPage, maxPrice, sortBy])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setCurrentPage(0)
    const params = new URLSearchParams(searchParams)
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    params.set('page', '0')
    setSearchParams(params)
  }

  const handleClearFilters = () => {
    setSelectedCategory('')
    setMaxPrice('')
    setSortBy('')
    setCurrentPage(0)
    setSearchParams({})
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl text-gray-800">
            {selectedCategory || 'All Products'}
          </h1>
          <p className="text-gray-500 mt-1">Handcrafted with love, just for you</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-peach-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-peach-200"
          >
            <option value="">Sort by</option>
            <option value="price,asc">Price: Low to High</option>
            <option value="price,desc">Price: High to Low</option>
            <option value="name,asc">Name: A-Z</option>
            <option value="name,desc">Name: Z-A</option>
          </select>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-peach-200 bg-white text-sm"
          >
            <HiOutlineAdjustments className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filter Sidebar */}
        <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-white p-6 overflow-auto' : 'hidden'} md:block md:static md:w-56 shrink-0`}>
          <div className="flex items-center justify-between md:hidden mb-6">
            <h3 className="font-serif text-xl">Filters</h3>
            <button onClick={() => setShowFilters(false)}>
              <HiOutlineX className="w-5 h-5" />
            </button>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Category</h4>
            <div className="space-y-2">
              <button
                onClick={() => handleCategoryChange('')}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  !selectedCategory ? 'bg-peach-100 text-peach-600 font-medium' : 'text-gray-600 hover:bg-peach-50'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat ? 'bg-peach-100 text-peach-600 font-medium' : 'text-gray-600 hover:bg-peach-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Max Price</h4>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Enter max price"
              className="input-field text-sm"
            />
          </div>

          {/* Clear Filters */}
          {(selectedCategory || maxPrice || sortBy) && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-peach-500 hover:text-peach-600 font-medium"
            >
              Clear all filters
            </button>
          )}
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <ProductGridSkeleton count={12} />
          ) : products.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No products found"
              message="Try adjusting your filters or browse all products."
              actionLabel="View All"
              actionTo="/products"
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 rounded-xl border border-peach-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-peach-50 transition-colors"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                        currentPage === i
                          ? 'bg-peach-400 text-white'
                          : 'border border-peach-200 hover:bg-peach-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="px-4 py-2 rounded-xl border border-peach-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-peach-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
