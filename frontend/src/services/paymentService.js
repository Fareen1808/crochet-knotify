import API from './api'

const paymentService = {
  createOrder: async (amount) => {
    const response = await API.post(`/payment/create-order?amount=${amount}`)
    return response.data
  },

  verifyPayment: async (orderId, paymentId, signature) => {
    const response = await API.post(
      `/payment/verify?orderId=${encodeURIComponent(orderId)}&paymentId=${encodeURIComponent(paymentId)}&signature=${encodeURIComponent(signature)}`
    )
    return response.data
  },
}

export default paymentService
