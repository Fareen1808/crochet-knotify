import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from '../../services/productService'

const initialState = {
  products: [],
  currentProduct: null,
  page: 0,
  totalPages: 0,
  totalElements: 0,
  isLoading: false,
  error: null,
}

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async ({ category, maxPrice, page, size, sort } = {}, thunkAPI) => {
    try {
      return await productService.getProducts({ category, maxPrice, page, size, sort })
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch products')
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, thunkAPI) => {
    try {
      return await productService.getProductById(id)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch product')
    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = action.payload.products
        state.page = action.payload.page
        state.totalPages = action.payload.totalPages
        state.totalElements = action.payload.totalElements
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentProduct = action.payload.data
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearCurrentProduct } = productSlice.actions
export default productSlice.reducer
