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
  const [isFetchingPincode, setIsFetchingPincode] = useState(false)
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    pincode: '',
    city: '',
    state: '',
  })

  // Track which fields have been touched, so we don't show errors before the user interacts
  const [touched, setTouched] = useState({
    fullName: false,
    phone: false,
    street: false,
    pincode: false,
  })

  // Field-level error messages
  const [errors, setErrors] = useState({
    fullName: '',
    phone: '',
    street: '',
    pincode: '',
  })

  useEffect(() => {
    if (user) {
      dispatch(fetchCartTotal())
    }
  }, [dispatch, user])

  // Validate a single field and return an error message (empty string = valid)
  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required'
        if (value.trim().length < 3) return 'Enter a valid full name'
        return ''
      case 'phone':
        if (!value.trim()) return 'Phone number is required'
        if (!/^[6-9]\d{9}$/.test(value)) return 'Enter a valid 10-digit mobile number'
        return ''
      case 'street':
        if (!value.trim()) return 'Street address is required'
        if (value.trim().length < 10) return 'Please enter a complete address'
        return ''
      case 'pincode':
        if (!value.trim()) return 'Pincode is required'
        if (!/^\d{6}$/.test(value)) return 'Enter a valid 6-digit pincode'
        return ''
      default:
        return ''
    }
  }

  // Auto-fetch city/state whenever pincode changes and is 6 digits
  useEffect(() => {
    if (address.pincode.length !== 6) {
      setAddress((prev) => ({
        ...prev,
        city: '',
        state: '',
      }))
      return
    }

    const fetchLocation = async () => {
      setIsFetchingPincode(true)
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${address.pincode}`)
        const data = await res.json()

        if (data?.[0]?.Status === 'Success' && data?.[0]?.PostOffice?.length > 0) {
          setAddress((prev) => ({
            ...prev,
            city: data[0].PostOffice[0].District,
            state: data[0].PostOffice[0].State,
          }))
          setErrors((prev) => ({ ...prev, pincode: '' }))
        } else {
          setAddress((prev) => ({
            ...prev,
            city: '',
            state: '',
          }))
          setErrors((prev) => ({ ...prev, pincode: 'Invalid pincode' }))
          toast.error('Invalid pincode')
        }
      } catch (error) {
        setAddress((prev) => ({
          ...prev,
          city: '',
          state: '',
        }))
        setErrors((prev) => ({ ...prev, pincode: 'Unable to fetch location' }))
        toast.error('Unable to fetch location')
      } finally {
        setIsFetchingPincode(false)
      }
    }

    fetchLocation()
  }, [address.pincode])

  const handleInputChange = (e) => {
    let { name, value } = e.target

    if (name === 'fullName') {
      value = value.replace(/[^a-zA-Z ]/g, '')
    }

    if (name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10)
    }

    if (name === 'city' || name === 'state') {
      return
    }

    if (name === 'pincode') {
      value = value.replace(/\D/g, '').slice(0, 6)
    }

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Live-validate as the user types, but only surface it if the field was already touched
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
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
    // Validate every field at once and mark all as touched so errors render
    const fieldNames = ['fullName', 'phone', 'street', 'pincode']
    const newErrors = {}
    fieldNames.forEach((name) => {
      newErrors[name] = validateField(name, address[name])
    })
    setErrors((prev) => ({ ...prev, ...newErrors }))
    setTouched((prev) => {
      const next = { ...prev }
      fieldNames.forEach((name) => (next[name] = true))
      return next
    })

    const hasErrors = Object.values(newErrors).some((msg) => msg !== '')
    if (hasErrors) {
      toast.error('Please fix the highlighted fields')
      return
    }

    if (!address.city.trim() || !address.state.trim()) {
      toast.error('Please enter a valid pincode to auto-fill city and state')
      return
    }

    setIsProcessing(true)

    try {
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway')
        setIsProcessing(false)
        return
      }

      const order = JSON.parse(await paymentService.createOrder(total))
      console.log("Order from backend:", order)
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: 'INR',
        name: 'Knotify',
        description: 'Handcrafted Crochet Purchase',
        order_id: order.id,
        handler: async (response) => {

  console.log("Razorpay response:", response);

  try {
    await paymentService.verifyPayment(
      response.razorpay_order_id,
      response.razorpay_payment_id,
      response.razorpay_signature
    )

            await orderService.checkout()

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

  // Helper to build input classes based on error state
  const inputClass = (name) =>
    `input-field ${
      touched[name] && errors[name]
        ? 'border-2 border-red-400 ring-2 ring-red-100 focus:border-red-500 focus:ring-red-200'
        : ''
    }`

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-serif text-3xl text-gray-800 mb-8">Checkout 💝</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  onBlur={handleBlur}
                  className={inputClass('fullName')}
                  placeholder="Your full name"
                  maxLength={50}
                />
                {touched.fullName && errors.fullName && (
                  <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  name="phone"
                  value={address.phone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={inputClass('phone')}
                  placeholder="10-digit phone number"
                />
                {touched.phone && errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1.5">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={inputClass('street')}
                  placeholder="House no., Street, Area"
                />
                {touched.street && errors.street && (
                  <p className="text-xs text-red-500 mt-1">{errors.street}</p>
                )}
              </div>

              {/* Pincode now comes first, so entering it auto-fills City/State below */}
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  inputMode="numeric"
                  maxLength={6}
                  className={inputClass('pincode')}
                  placeholder="6-digit pincode"
                />
                {touched.pincode && errors.pincode && (
                  <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>
                )}
                {isFetchingPincode && (
                  <p className="text-xs text-gray-400 mt-1">Looking up city and state…</p>
                )}
              </div>

              <div />

              <div>
                <label className="block text-sm text-gray-600 mb-1.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  readOnly
                  className="input-field bg-gray-100 cursor-not-allowed"
                  placeholder="Auto-filled from pincode"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1.5">State</label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  readOnly
                  className="input-field bg-gray-100 cursor-not-allowed"
                  placeholder="Auto-filled from pincode"
                />
              </div>
            </div>
          </div>
        </div>

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
