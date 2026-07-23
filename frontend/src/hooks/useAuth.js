import { useSelector } from 'react-redux'

export function useAuth() {
  const { user, token, isLoading } = useSelector((state) => state.auth)

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'ADMIN',
    username: user?.username,
  }
}
