import API from './api'

const productService = {
  getProducts: async ({ category, maxPrice, page = 0, size = 12, sort } = {}) => {
    const params = {}
    if (category) params.category = category
    if (maxPrice) params.maxPrice = maxPrice
    params.page = page
    params.size = size
    if (sort) params.sort = sort

    const response = await API.get('/products', { params })
    return response.data
  },

  getProductById: async (id) => {
    const response = await API.get(`/products/${id}`)
    return response.data
  },

  // Admin endpoints
  addProduct: async (productData) => {
    const response = await API.post('/products/admin', productData)
    return response.data
  },

  updateProduct: async (id, productData) => {
    const response = await API.put(`/products/admin/${id}`, productData)
    return response.data
  },

  deleteProduct: async (id) => {
    const response = await API.delete(`/products/admin/${id}`)
    return response.data
  },
}

export default productService
