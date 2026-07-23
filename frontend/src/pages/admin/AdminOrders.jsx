import { useState } from 'react'
import { formatPrice } from '../../utils/formatPrice'
import { HiOutlineSearch } from 'react-icons/hi'
import orderService from '../../services/orderService'
import toast from 'react-hot-toast'

export default function AdminOrders() {
  const [username, setUsername] = useState('')
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!username.trim()) {
      toast.error('Please enter a username')
      return
    }
    setIsLoading(true)
    try {
      const data = await orderService.getOrders(username.trim())
      setOrders(data)
      setSearched(true)
    } catch {
      toast.error('Failed to fetch orders')
    } finally {
      setIsLoading(false)
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-gray-800">Orders</h1>
        <p className="text-gray-500 mt-1">View customer orders by username</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter customer username..."
            className="input-field pl-10"
          />
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Orders List */}
      {searched && orders.length === 0 && (
        <div className="card text-center py-12">
          <span className="text-4xl mb-3 block">📭</span>
          <p className="text-gray-500">No orders found for "{username}"</p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-peach-50 border-b border-peach-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Order ID</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Customer</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Items</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Total</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-peach-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-peach-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">#{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.items?.length || 0} items</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{formatPrice(order.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${getStatusBadge(order.paymentStatus)}`}>
                        {order.paymentStatus || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
