import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineShoppingBag,
  HiOutlineClipboardList,
  HiOutlineCurrencyRupee,
  HiOutlineUsers,
} from 'react-icons/hi'

import adminService from '../../services/adminService'
import { formatPrice } from '../../utils/formatPrice'

export default function AdminDashboard() {

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    totalCustomers: 0,
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await adminService.getStats()
      setStats(data)
    } catch (e) {
      console.error(e)
    }
  }

  const cards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <HiOutlineShoppingBag className="w-6 h-6" />,
      color: 'bg-peach-100 text-peach-600',
      link: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <HiOutlineClipboardList className="w-6 h-6" />,
      color: 'bg-lavender-100 text-lavender-600',
      link: '/admin/orders',
    },
    {
      title: 'Revenue',
      value: formatPrice(stats.revenue),
      icon: <HiOutlineCurrencyRupee className="w-6 h-6" />,
      color: 'bg-sage-100 text-sage-600',
      link: '#',
    },
    {
      title: 'Customers',
      value: stats.totalCustomers,
      icon: <HiOutlineUsers className="w-6 h-6" />,
      color: 'bg-cream-200 text-yellow-700',
      link: '#',
    },
  ]

  return (
    <div>

      <div className="mb-8">
        <h1 className="font-serif text-3xl text-gray-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome back, Admin!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        {cards.map((card, index) => (

          <Link
            key={index}
            to={card.link}
            className="card card-hover p-6"
          >

            <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
              {card.icon}
            </div>

            <p className="text-sm text-gray-500">
              {card.title}
            </p>

            <p className="font-serif text-2xl text-gray-800 mt-1">
              {card.value}
            </p>

          </Link>

        ))}

      </div>

      <div className="card p-6">

        <h3 className="font-serif text-lg mb-4">
          Quick Actions
        </h3>

        <div className="flex gap-3 flex-wrap">

          <Link
            to="/admin/products"
            className="btn-primary text-sm py-2 px-4"
          >
            Manage Products
          </Link>

          <Link
            to="/admin/orders"
            className="btn-secondary text-sm py-2 px-4"
          >
            View Orders
          </Link>

          <Link
            to="/"
            className="btn-outline text-sm py-2 px-4"
          >
            Visit Store
          </Link>

        </div>

      </div>

    </div>
  )
}