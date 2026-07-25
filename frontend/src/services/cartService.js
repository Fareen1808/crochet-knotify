import API from './api'

const cartService = {
  // Get logged-in user's cart
  getCart: async () => {
    const response = await API.get('/cart')
    return response.data
  },

  // Add product to logged-in user's cart
  addToCart: async (productId, quantity) => {
    const response = await API.post('/cart/add', null, {
      params: {
        productId,
        quantity,
      },
    })

    return response.data
  },

  // Remove cart item
  removeItem: async (cartItemId) => {
    const response = await API.delete(`/cart/remove/${cartItemId}`)
    return response.data
  },

  // Get logged-in user's cart total
  getTotal: async () => {
    const response = await API.get('/cart/total')
    return response.data
  },
}

export default cartService