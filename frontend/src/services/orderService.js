import API from './api'

const orderService = {
  checkout: async (username) => {
    const response = await API.post(`/orders/checkout?username=${encodeURIComponent(username)}`)
    return response.data
  },

  getOrders: async (username) => {
    const response = await API.get(`/orders/${username}`)
    return response.data
  },
}

export default orderService
