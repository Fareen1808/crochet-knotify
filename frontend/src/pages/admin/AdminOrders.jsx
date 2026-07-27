import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { HiOutlineSearch } from 'react-icons/hi'
import { formatPrice } from '../../utils/formatPrice'
import adminService from '../../services/adminService'

export default function AdminOrders() {

  const [orders, setOrders] = useState([])
  const [username, setUsername] = useState('')
  const [searched, setSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadAllOrders()
  }, [])

  const loadAllOrders = async () => {
    try {
      const data = await adminService.getOrders()
      setOrders(data)
    } catch {
      toast.error('Failed to load orders')
    }
  }

  const handleSearch = async (e) => {

    e.preventDefault()

    if (!username.trim()) {
      loadAllOrders()
      return
    }

    setIsLoading(true)

    try {

      const data =
        await adminService.getOrdersByUsername(username)

      setOrders(data)

      setSearched(true)

    } catch {

      toast.error('Failed to fetch orders')

    } finally {

      setIsLoading(false)

    }

  }

  const badge = (status) => {

    switch (status?.toUpperCase()) {

      case 'PAID':
        return 'bg-green-100 text-green-700'

      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700'

      case 'FAILED':
        return 'bg-red-100 text-red-700'

      default:
        return 'bg-gray-100 text-gray-700'

    }

  }

  return (

    <div>

      <div className="mb-8">

        <h1 className="font-serif text-3xl">
          Orders
        </h1>

        <p className="text-gray-500">
          Manage customer orders
        </p>

      </div>

      <form
        onSubmit={handleSearch}
        className="flex gap-3 mb-8"
      >

        <div className="relative flex-1 max-w-md">

          <input
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            placeholder="Search username..."
            className="input-field pl-10"
          />

          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2"/>

        </div>

        <button
          className="btn-primary"
          disabled={isLoading}
        >
          Search
        </button>

      </form>

      {searched && orders.length===0 && (

        <div className="card text-center py-10">

          No orders found.

        </div>

      )}

      <div className="space-y-6">

        {orders.map(order=>(

          <div
            key={order.id}
            className="card"
          >

            <div className="flex justify-between mb-4">

              <div>

                <h3 className="font-semibold">

                  Order #{order.id}

                </h3>

                <p className="text-sm text-gray-500">

                  {order.username}

                </p>

              </div>

              <span className={`badge ${badge(order.paymentStatus)}`}>

                {order.paymentStatus}

              </span>

            </div>

            <div className="space-y-2">

              {order.items?.map(item=>(

                <div
                  key={item.id}
                  className="flex justify-between border-b py-2"
                >

                  <div>

                    <p>

                      {item.product?.name}

                    </p>

                    <p className="text-sm text-gray-500">

                      Qty : {item.quantity}

                    </p>

                  </div>

                  <div>

                    {formatPrice(item.price*item.quantity)}

                  </div>

                </div>

              ))}

            </div>

            <div className="flex justify-end mt-4">

              <strong>

                {formatPrice(order.totalAmount)}

              </strong>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}