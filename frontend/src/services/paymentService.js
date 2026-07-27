import API from './api'

const paymentService = {
  // Step 2 of checkout: sent only AFTER Razorpay's own checkout widget
  // reports success. The backend re-verifies everything server-side -
  // this call carries proof of payment, not a request to create one.
  verifyPayment: async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
    const response = await API.post('/payment/verify', {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    })
    return response.data
  },
}

export default paymentService