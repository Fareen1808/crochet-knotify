import { useEffect, useState } from 'react'
import productService from '../../services/productService'
import cloudinaryService from '../../services/cloudinaryService'
import { formatPrice } from '../../utils/formatPrice'
import toast from 'react-hot-toast'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX, HiOutlinePhotograph } from 'react-icons/hi'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: '',
  })

  const categories = ['Amigurumi', 'Bags', 'Clothing', 'Home Decor', 'Accessories']

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
  try {
    const data = await productService.getProducts({ size: 100 })

    console.log("Products received:", data.products.length)
    console.log(data.products)

    setProducts(data.products)
  } catch (error) {
    console.error(error)
    toast.error("Failed to load products")
  } finally {
    setIsLoading(false)
  }
}

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setForm({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock?.toString() || '0',
        imageUrl: product.imageUrl || '',
      })
      setImagePreview(product.imageUrl || null)
    } else {
      setEditingProduct(null)
      setForm({ name: '', description: '', price: '', category: '', stock: '0', imageUrl: '' })
      setImagePreview(null)
    }
    setImageFile(null)
    setShowModal(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.description || !form.price || !form.category) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsUploading(true)
    let imageUrl = form.imageUrl

    try {
      // Upload image to Cloudinary if new file selected
      if (imageFile) {
        imageUrl = await cloudinaryService.uploadImage(imageFile)
      }

      const productData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        stock: parseInt(form.stock) || 0,
        imageUrl: imageUrl || null,
      }

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData)
        toast.success('Product updated! ✨')
      } else {
        await productService.addProduct(productData)
        toast.success('Product added! 🎉')
      }
      setShowModal(false)
      loadProducts()
    } catch (error) {
      toast.error(editingProduct ? 'Failed to update product' : 'Failed to add product')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await productService.deleteProduct(id)
      toast.success('Product deleted')
      loadProducts()
    } catch {
      toast.error('Failed to delete product')
    }
  }

  const handleStockUpdate = async (product, newStock) => {
    try {
      await productService.updateProduct(product.id, {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: parseInt(newStock),
        imageUrl: product.imageUrl,
      })
      toast.success('Stock updated')
      loadProducts()
    } catch {
      toast.error('Failed to update stock')
    }
  }
  console.log("Products in state:", products.length);
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-gray-800">Products</h1>
          <p className="text-gray-500 mt-1">Manage your crochet inventory</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <HiOutlinePlus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="card animate-pulse space-y-4 p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-peach-100/50 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-hotpink-50 border-b border-pink-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Product</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Price</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Stock</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {console.log(products)}
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-hotpink-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-hotpink-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <span className="text-lg">🧶</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge bg-lavender-100 text-lavender-600">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={product.stock || 0}
                          onChange={(e) => {
                            const updated = products.map(p =>
                              p.id === product.id ? { ...p, stock: parseInt(e.target.value) || 0 } : p
                            )
                            setProducts(updated)
                          }}
                          onBlur={(e) => handleStockUpdate(product, e.target.value)}
                          className="w-16 px-2 py-1 text-sm border-2 border-pink-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-hotpink-300"
                          min="0"
                        />
                        {product.stock <= 0 && (
                          <span className="text-xs text-red-500 font-bold">OOS</span>
                        )}
                        {product.stock > 0 && product.stock <= 5 && (
                          <span className="text-xs text-yellow-600 font-bold">Low</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-gray-400 hover:text-hotpink-500 hover:bg-hotpink-50 rounded-lg transition-colors"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-soft-xl w-full max-w-lg p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-hotpink-50 rounded-lg">
                <HiOutlineX className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Product Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-hotpink-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-pink-300">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <HiOutlinePhotograph className="w-8 h-8 text-hotpink-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-hotpink-50 file:text-hotpink-600 hover:file:bg-hotpink-100"
                    />
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="Product name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field resize-none h-24"
                  placeholder="Product description"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Stock</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="input-field"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isUploading}
                className="btn-primary w-full mt-2 disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
