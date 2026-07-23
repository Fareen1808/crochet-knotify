import API from './api'

const cartService = {
  getCart: async (username) => {
    const response = await API.get(`/cart/${username}`)
    return response.data
  },

  addToCart: async (username, productId, quantity) => {
    const response = await API.post(
      `/cart/add?username=${encodeURIComponent(username)}&productId=${productId}&quantity=${quantity}`
    )
    return response.data
  },

  removeItem: async (cartItemId) => {
    const response = await API.delete(`/cart/remove/${cartItemId}`)
    return response.data
  },

  getTotal: async (username) => {
    const response = await API.get(`/cart/${username}/total`)
    return response.data
  },
}

export default cartService
