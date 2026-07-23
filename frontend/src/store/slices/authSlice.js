import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../../services/authService'

const token = localStorage.getItem('token')
const user = localStorage.getItem('user')

const initialState = {
  user: user ? JSON.parse(user) : null,
  token: token || null,
  isLoading: false,
  error: null,
}

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await authService.login(credentials)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Login failed')
  }
})

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await authService.register(userData)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Registration failed')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.token = action.payload.token
        state.user = action.payload.user
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.token = action.payload.token
        state.user = action.payload.user
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
