import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearError } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isLoading, error } = useSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : 'Login failed')
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    dispatch(login({ username, password }))
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Decorative header */}
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">🧶</span>
          <h1 className="font-serif text-3xl text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-500">Sign in to your cozy account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-peach-500 hover:text-peach-600 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
