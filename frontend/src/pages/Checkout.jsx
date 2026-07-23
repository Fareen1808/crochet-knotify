import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCartTotal, clearCart } from '../store/slices/cartSlice'
import orderService from '../services/orderService'
import paymentService from '../services/paymentService'
import { formatPrice } from '../utils/formatPrice'
import toast from 'react-hot-toast'

export default function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { items, total } = useSelector((state) => state.cart)
  const [isProcessing, setIsProcessing] = useState(false)
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  })

  useEffect(() => {
    if (user) {
      dispatch(fetchCartTotal(user.username))
    }
  }, [dispatch, user])

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    if (!address.fullName || !address.phone || !address.street || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill in all address fields')
      return
    }

    setIsProcessing(true)

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway')
        setIsProcessing(false)
        return
      }

      // Create Razorpay order
      const razorpayOrderId = await paymentService.createOrder(total)

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: 'INR',
        name: 'Knotify',
        description: 'Handcrafted Crochet Purchase',
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            // Verify payment
            await paymentService.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            )

            // Create order
            await orderService.checkout(user.username)
            
            dispatch(clearCart())
            toast.success('Order placed successfully! 🎉')
            navigate('/payment-success')
          } catch (error) {
            toast.error('Payment verification failed')
            navigate('/payment-failure')
          }
        },
        prefill: {
          name: address.fullName,
          contact: address.phone,
        },
        theme: {
          color: '#ffa080',
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      toast.error('Payment initiation failed')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-serif text-3xl text-gray-800 mb-8">Checkout 💝</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Address Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="font-serif text-lg text-gray-800 mb-6">Shipping Address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={address.phone}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="10-digit phone number"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1.5">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="House no., Street, Area"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">State</label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="State"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="6-digit pincode"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h3 className="font-serif text-lg text-gray-800 mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-500 truncate mr-2">
                    {item.product?.name || 'Item'} × {item.quantity}
                  </span>
                  <span className="text-gray-800 shrink-0">
                    {formatPrice(item.product?.price * item.quantity || 0)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-peach-100 pt-3 space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-sage-500">Free</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-peach-100">
                <span>Total</span>
                <span className="font-serif text-xl text-peach-500">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Pay ${formatPrice(total)}`}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              🔒 Secured by Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
