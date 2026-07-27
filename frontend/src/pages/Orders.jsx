import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import orderService from '../services/orderService'
import { formatPrice } from '../utils/formatPrice'
import EmptyState from '../components/EmptyState'
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineXCircle } from 'react-icons/hi'

export default function Orders() {
  const { user } = useSelector((state) => state.auth)
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      orderService.getOrders()
        .then((data) => {
          setOrders(data)
          setIsLoading(false)
        })
        .catch(() => {
          setIsLoading(false)
        })
    }
  }, [user])

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'completed':
        return <HiOutlineCheckCircle className="w-5 h-5 text-sage-500" />
      case 'pending':
        return <HiOutlineClock className="w-5 h-5 text-yellow-500" />
      case 'failed':
        return <HiOutlineXCircle className="w-5 h-5 text-red-400" />
      default:
        return <HiOutlineClock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'bg-sage-100 text-sage-600'
      case 'pending':
        return 'bg-yellow-100 text-yellow-600'
      case 'failed':
        return 'bg-red-100 text-red-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-serif text-3xl text-gray-800 mb-8">My Orders</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-5 bg-peach-100/50 rounded-full w-1/3 mb-3" />
              <div className="h-4 bg-peach-100/50 rounded-full w-1/2 mb-2" />
              <div className="h-4 bg-peach-100/50 rounded-full w-1/4" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          icon="📦"
          title="No orders yet"
          message="Once you place an order, it will show up here. Start shopping!"
          actionLabel="Browse Products"
          actionTo="/products"
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-serif text-3xl text-gray-800 mb-8">My Orders 📦</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium text-gray-800">Order #{order.id}</h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  {order.items?.length || 0} item(s)
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.paymentStatus)}
                <span className={`badge ${getStatusBadge(order.paymentStatus)}`}>
                  {order.paymentStatus || 'Pending'}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2 mb-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-peach-50 last:border-0">
                  <img
  src={item.product?.imageUrl}
  alt={item.product?.name}
  className="w-10 h-10 rounded-lg object-cover shrink-0"
/>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">{item.product?.name || 'Crochet Item'}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-peach-100">
              <span className="text-sm text-gray-500">Total Amount</span>
              <span className="font-serif text-lg text-peach-500">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
