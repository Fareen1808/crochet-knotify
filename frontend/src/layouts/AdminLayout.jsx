import { Outlet, NavLink } from 'react-router-dom'
import { HiOutlineHome, HiOutlineShoppingBag, HiOutlineClipboardList, HiOutlineArrowLeft } from 'react-icons/hi'

export default function AdminLayout() {
  const navItems = [
    { to: '/admin', icon: HiOutlineHome, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: HiOutlineShoppingBag, label: 'Products' },
    { to: '/admin/orders', icon: HiOutlineClipboardList, label: 'Orders' },
  ]

  return (
    <div className="min-h-screen flex bg-cream-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-soft border-r border-peach-100 p-6 hidden md:flex flex-col">
        <div className="mb-8">
          <h2 className="font-serif text-2xl text-hotpink-500 font-bold">Knotify</h2>
          <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-hotpink-100 text-hotpink-600 font-medium'
                    : 'text-gray-500 hover:bg-hotpink-50 hover:text-hotpink-500'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-hotpink-50 hover:text-hotpink-500 transition-all duration-200 mt-4"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          Back to Store
        </NavLink>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
