import API from './api'
import { jwtDecode } from '../utils/jwtDecode'

const authService = {
  login: async ({ username, password }) => {
    const response = await API.post(
      `/auth/login`,
      null,
      { params: { username, password } }
    )
    const token = response.data
    const decoded = jwtDecode(token)
    return {
      token,
      user: {
        username: decoded.sub,
        role: decoded.role || 'USER',
      },
    }
  },

  register: async ({ username, password, role = 'USER' }) => {
    await API.post('/auth/register', { username, password, role })
    // After registration, auto-login
    const response = await API.post(
      `/auth/login`,
      null,
      { params: { username, password } }
    )
    const token = response.data
    const decoded = jwtDecode(token)
    return {
      token,
      user: {
        username: decoded.sub,
        role: decoded.role || 'USER',
      },
    }
  },
}

export default authService
