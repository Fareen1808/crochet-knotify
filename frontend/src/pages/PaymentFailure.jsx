import { Link } from 'react-router-dom'
import { HiOutlineXCircle } from 'react-icons/hi'

export default function PaymentFailure() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <HiOutlineXCircle className="w-12 h-12 text-red-400" />
        </div>
        <h1 className="font-serif text-3xl text-gray-800 mb-3">Payment Failed 😔</h1>
        <p className="text-gray-500 mb-8">
          Something went wrong with your payment. Don't worry — your items are still in your cart.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/cart" className="btn-primary">
            Back to Cart
          </Link>
          <Link to="/products" className="btn-outline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
