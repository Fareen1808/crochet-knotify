import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import cartService from '../../services/cartService'

const initialState = {
  items: [],
  total: 0,
  isLoading: false,
  error: null,
}

export const fetchCart = createAsyncThunk('cart/fetch', async (username, thunkAPI) => {
  try {
    return await cartService.getCart(username)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch cart')
  }
})

export const addToCart = createAsyncThunk('cart/add', async ({ username, productId, quantity }, thunkAPI) => {
  try {
    return await cartService.addToCart(username, productId, quantity)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Failed to add to cart')
  }
})

export const removeFromCart = createAsyncThunk('cart/remove', async (cartItemId, thunkAPI) => {
  try {
    await cartService.removeItem(cartItemId)
    return cartItemId
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Failed to remove item')
  }
})

export const fetchCartTotal = createAsyncThunk('cart/total', async (username, thunkAPI) => {
  try {
    return await cartService.getTotal(username)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Failed to get total')
  }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = []
      state.total = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.items || []
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items || []
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload)
      })
      .addCase(fetchCartTotal.fulfilled, (state, action) => {
        state.total = action.payload
      })
  },
})

export const { clearCart } = cartSlice.actions
export default cartSlice.reducer
