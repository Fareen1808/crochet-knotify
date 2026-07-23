import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { register, clearError } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
      toast.error(typeof error === 'string' ? error : 'Registration failed')
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    dispatch(register({ username, password }))
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Decorative header */}
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">✨</span>
          <h1 className="font-serif text-3xl text-gray-800 mb-2">Join the Club</h1>
          <p className="text-gray-500">Create your cozy account today</p>
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
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-peach-500 hover:text-peach-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
