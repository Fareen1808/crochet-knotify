import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById, fetchProducts, clearCurrentProduct } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../store/slices/wishlistSlice'
import { formatPrice } from '../utils/formatPrice'
import ProductCard from '../components/ProductCard'
import toast from 'react-hot-toast'
import {
  HiOutlineMinus,
  HiOutlinePlus,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiHeart,
  HiOutlineArrowLeft,
} from 'react-icons/hi'

const FALLBACK_IMAGE = 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/accessories-bag.jpg'

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentProduct, products, isLoading } = useSelector((state) => state.products)
  const { user } = useSelector((state) => state.auth)
  const { items: wishlistItems } = useSelector((state) => state.wishlist)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    dispatch(fetchProductById(id))
    dispatch(fetchProducts({ size: 4 }))
    dispatch(fetchWishlist())

    return () => {
      dispatch(clearCurrentProduct())
    }
  }, [dispatch, id])

  const wishlistItem = wishlistItems.find(
    (item) => item.product && item.product.id === currentProduct?.id
  )
  const isWishlisted = !!wishlistItem

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to continue')
      return
    }

    if (!currentProduct) return

    if (currentProduct.stock <= 0) {
      toast.error('This product is out of stock')
      return
    }

    if (quantity > currentProduct.stock) {
      toast.error(`Only ${currentProduct.stock} item(s) available`)
      return
    }

    dispatch(
      addToCart({
        productId: currentProduct.id,
        quantity,
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Added to cart 🧶')
      })
      .catch((err) => {
        toast.error(err || 'Failed to add to cart')
      })
  }

  const handleWishlist = () => {
    if (!user) {
      toast.error('Please login first')
      return
    }

    if (!currentProduct) return

    if (isWishlisted) {
      dispatch(removeFromWishlist(wishlistItem.id))
        .unwrap()
        .then(() => toast.success('Removed from wishlist ❤️'))
        .catch(() => toast.error('Failed to remove from wishlist'))
    } else {
      dispatch(addToWishlist(currentProduct.id))
        .unwrap()
        .then(() => toast.success('Added to wishlist ❤️'))
        .catch(() => toast.error('Failed to add to wishlist'))
    }
  }

  if (isLoading || !currentProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="h-96 bg-peach-100/50 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-peach-100/50 rounded-full w-3/4" />
            <div className="h-4 bg-peach-100/50 rounded-full w-1/2" />
            <div className="h-4 bg-peach-100/50 rounded-full w-full" />
            <div className="h-4 bg-peach-100/50 rounded-full w-full" />
            <div className="h-10 bg-peach-100/50 rounded-full w-32 mt-6" />
          </div>
        </div>
      </div>
    )
  }

  const categoryColors = {
    Amigurumi: 'from-pink-200 to-hotpink-200',
    Bags: 'from-lavender-200 to-lavender-300',
    Clothing: 'from-rose-200 to-rose-300',
    'Home Decor': 'from-sage-200 to-sage-300',
    Accessories: 'from-cream-200 to-cream-300',
  }

  const bgGradient = categoryColors[currentProduct.category] || 'from-hotpink-100 to-pink-200'
  const isOutOfStock = currentProduct.stock !== undefined && currentProduct.stock <= 0
  const isLowStock = currentProduct.stock > 0 && currentProduct.stock <= 5

  const relatedProducts = products
    .filter((p) => p.id !== currentProduct.id && p.category === currentProduct.category)
    .slice(0, 4)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-hotpink-500 mb-8 transition-colors"
      >
        <HiOutlineArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className={`bg-gradient-to-br ${bgGradient} rounded-3xl h-96 md:h-[500px] flex items-center justify-center relative overflow-hidden`}>
          <img
            src={currentProduct.imageUrl || FALLBACK_IMAGE}
            alt={currentProduct.name}
            className="w-full h-full object-cover rounded-3xl"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE
            }}
          />
          <div className="absolute top-4 left-4">
            <span className="badge bg-white/80 backdrop-blur-sm text-gray-600">
              {currentProduct.category}
            </span>
          </div>
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/30 rounded-3xl flex items-center justify-center">
              <span className="bg-red-500 text-white font-bold px-6 py-3 rounded-full text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <h1 className="font-serif text-3xl md:text-4xl text-gray-800 mb-3">
            {currentProduct.name}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="font-serif text-2xl text-hotpink-500 font-bold">
              {formatPrice(currentProduct.price)}
            </span>
            {isOutOfStock ? (
              <span className="badge bg-red-100 text-red-600 font-bold">Out of Stock</span>
            ) : isLowStock ? (
              <span className="badge bg-yellow-100 text-yellow-700 font-bold">
                Only {currentProduct.stock} left
              </span>
            ) : (
              <span className="badge bg-green-100 text-green-700 font-bold">
                In Stock ({currentProduct.stock})
              </span>
            )}
          </div>

          <p className="text-gray-500 leading-relaxed mb-8">
            {currentProduct.description}
          </p>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
              <p className="text-xs text-gray-400 mb-1">Material</p>
              <p className="text-sm font-medium text-gray-700">Premium Cotton Yarn</p>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
              <p className="text-xs text-gray-400 mb-1">Made by</p>
              <p className="text-sm font-medium text-gray-700">Knotify Artisans</p>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
              <p className="text-xs text-gray-400 mb-1">Category</p>
              <p className="text-sm font-medium text-gray-700">{currentProduct.category}</p>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
              <p className="text-xs text-gray-400 mb-1">Care</p>
              <p className="text-sm font-medium text-gray-700">Hand wash, air dry</p>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border-2 border-pink-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-hotpink-50 transition-colors"
                disabled={isOutOfStock || quantity >= currentProduct.stock}
              >
                <HiOutlineMinus className="w-4 h-4" />
              </button>
              <span className="px-4 py-3 font-bold text-gray-800 min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => {
                  if (quantity >= currentProduct.stock) {
                    toast.error(`Only ${currentProduct.stock} item(s) available`)
                    return
                  }
                  setQuantity(quantity + 1)
                }}
                className="p-3 hover:bg-hotpink-50 transition-colors"
                disabled={isOutOfStock || quantity >= currentProduct.stock}
              >
                <HiOutlinePlus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || quantity > currentProduct.stock}
              className="btn-primary flex items-center gap-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <HiOutlineShoppingBag className="w-5 h-5" />
              {isOutOfStock ? 'Out of Stock' : `Add ${quantity} to Cart`}
            </button>

            <button
              onClick={handleWishlist}
              className="p-3 border-2 border-pink-200 rounded-xl hover:bg-hotpink-50 transition-colors"
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isWishlisted ? (
                <HiHeart className="w-5 h-5 text-red-500" />
              ) : (
                <HiOutlineHeart className="w-5 h-5 text-hotpink-500" />
              )}
            </button>
          </div>

          <p className="text-xs text-gray-400">
            🚚 Free shipping on orders above ₹999 • 🔄 Easy returns within 7 days
          </p>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="section-title mb-8">You Might Also Love</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
