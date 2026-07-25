import API from './api'

const orderService = {
  // Checkout for logged-in user
  checkout: async () => {
    const response = await API.post('/orders/checkout')
    return response.data
  },

  // Get logged-in user's orders
  getOrders: async () => {
    const response = await API.get('/orders')
    return response.data
  },
}

export default orderService