import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { register, clearError } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isLoading, error } = useSelector((state) => state.auth)

  const passwordChecks = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }
  }, [password])

  const isPasswordValid =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.lowercase &&
    passwordChecks.number &&
    passwordChecks.special

  const isFormValid =
    username.trim() &&
    password.trim() &&
    confirmPassword.trim() &&
    password === confirmPassword &&
    isPasswordValid

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    if (!error) return

    if (typeof error === 'string') {
      toast.error(error)
    } else if (error.errors) {
      Object.values(error.errors).forEach((messages) => {
        if (Array.isArray(messages)) {
          messages.forEach((msg) => toast.error(msg))
        } else if (messages) {
          toast.error(messages)
        }
      })
    } else if (error.message) {
      toast.error(error.message)
    } else {
      toast.error('Registration failed')
    }

    dispatch(clearError())
  }, [error, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (!isPasswordValid) {
      toast.error('Please satisfy all password requirements')
      return
    }

    dispatch(register({ username, password }))
  }

  const renderCheck = (ok, label) => (
    <p className={`text-xs sm:text-sm flex items-center gap-2 ${ok ? 'text-green-600' : 'text-gray-500'}`}>
      <span className="text-sm">{ok ? '✅' : '❌'}</span>
      <span>{label}</span>
    </p>
  )

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
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
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-2">
                <p className="text-sm font-medium text-gray-700">Password requirements</p>
                {renderCheck(passwordChecks.length, 'At least 8 characters')}
                {renderCheck(passwordChecks.uppercase, 'One uppercase letter')}
                {renderCheck(passwordChecks.lowercase, 'One lowercase letter')}
                {renderCheck(passwordChecks.number, 'One number')}
                {renderCheck(passwordChecks.special, 'One special character')}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {confirmPassword.length > 0 && (
                <p
                  className={`mt-2 text-xs sm:text-sm ${
                    password === confirmPassword ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {password === confirmPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
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
