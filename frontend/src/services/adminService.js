import api from './api'

const getStats = async () => {
  const { data } = await api.get('/admin/stats')
  return data
}

const getOrders = async () => {
  const { data } = await api.get('/admin/orders')
  return data
}

const getOrdersByUsername = async (username) => {
  const { data } = await api.get(`/admin/orders/${username}`)
  return data
}

export default {
  getStats,
  getOrders,
  getOrdersByUsername,
}