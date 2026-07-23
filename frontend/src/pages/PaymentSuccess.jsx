import { Link } from 'react-router-dom'
import { HiOutlineCheckCircle } from 'react-icons/hi'

export default function PaymentSuccess() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <HiOutlineCheckCircle className="w-12 h-12 text-sage-500" />
        </div>
        <h1 className="font-serif text-3xl text-gray-800 mb-3">Payment Successful! 🎉</h1>
        <p className="text-gray-500 mb-8">
          Thank you for your order! Your handcrafted crochet items are being prepared with love.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/orders" className="btn-primary">
            View My Orders
          </Link>
          <Link to="/products" className="btn-outline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
