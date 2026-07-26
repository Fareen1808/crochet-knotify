import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import wishlistService from "../../services/wishlistService";

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, thunkAPI) => {
    try {
      return await wishlistService.getWishlist();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch wishlist"
      );
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId, thunkAPI) => {
    try {
      return await wishlistService.addToWishlist(productId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add"
      );
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (wishlistItemId, thunkAPI) => {
    try {
      await wishlistService.removeFromWishlist(wishlistItemId);
      return wishlistItemId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to remove"
      );
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
      })

      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })

      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default wishlistSlice.reducer;