import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCart, removeFromCart, fetchCartTotal } from '../store/slices/cartSlice'
import { formatPrice } from '../utils/formatPrice'
import EmptyState from '../components/EmptyState'
import { CartItemSkeleton } from '../components/LoadingSkeleton'
import toast from 'react-hot-toast'
import { HiOutlineTrash, HiOutlineArrowLeft } from 'react-icons/hi'
import { fetchWishlist } from "../store/slices/wishlistSlice";

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, total, isLoading } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      dispatch(fetchCart())
      dispatch(fetchCartTotal())
      dispatch(fetchWishlist())
    }
  }, [dispatch, user])

  const handleRemoveItem = (cartItemId) => {
    dispatch(removeFromCart(cartItemId))
      .unwrap()
      .then(() => {
        toast.success('Item removed from cart')
        dispatch(fetchCartTotal())
      })
      .catch(() => {
        toast.error('Failed to remove item')
      })
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-serif text-3xl text-gray-800 mb-8">Your Cart</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CartItemSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Looks like you haven't added any cozy items yet. Let's fix that!"
          actionLabel="Start Shopping"
          actionTo="/products"
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/products" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-peach-500 mb-6 transition-colors">
        <HiOutlineArrowLeft className="w-4 h-4" />
        Continue Shopping
      </Link>

      <h1 className="font-serif text-3xl text-gray-800 mb-8">Your Cart 🧺</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card flex gap-4 p-4 border-2 border-pink-100">
              {/* Item Image */}
              <div className="w-20 h-20 bg-gradient-to-br from-hotpink-100 to-hotpink-200 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-2xl">🧶</span>
              </div>

              {/* Item Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">
                  {item.product?.name || 'Crochet Item'}
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  Qty: {item.quantity}
                </p>
                <p className="font-serif font-bold text-hotpink-500 mt-1">
                  {formatPrice(item.product?.price * item.quantity || 0)}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors self-start"
              >
                <HiOutlineTrash className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h3 className="font-serif text-lg text-gray-800 mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal ({items.length} items)</span>
                <span className="text-gray-800">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-sage-600 font-bold">Free</span>
              </div>
              <div className="border-t-2 border-pink-100 pt-3 flex justify-between">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-serif text-xl font-bold text-hotpink-500">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full"
            >
              Proceed to Checkout
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              🔒 Secure checkout powered by Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
