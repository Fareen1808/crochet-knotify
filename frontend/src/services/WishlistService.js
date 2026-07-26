import API from "./api";

const wishlistService = {
  getWishlist: async () => {
    const response = await API.get("/wishlist");
    return response.data;
  },

  addToWishlist: async (productId) => {
    const response = await API.post(
      `/wishlist/add?productId=${productId}`
    );
    return response.data;
  },

  removeFromWishlist: async (wishlistItemId) => {
    const response = await API.delete(
      `/wishlist/remove/${wishlistItemId}`
    );
    return response.data;
  },
};

export default wishlistService;