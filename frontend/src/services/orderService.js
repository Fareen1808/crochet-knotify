import API from './api'

const orderService = {
  // Step 1 of checkout: backend computes the total from the DB, creates a
  // PENDING order, creates the Razorpay order, and returns everything the
  // frontend needs to open the Razorpay widget. No amount is ever sent here.
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