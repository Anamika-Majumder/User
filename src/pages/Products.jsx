import React, { useState, useEffect } from 'react';
import { getProducts, getProduct, addProduct, deleteProduct } from '../services/api';
import { Search, Plus, Trash2, Eye, X } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    data: {
      year: '',
      price: '',
      CPU_model: '',
      Hard_disk_size: ''
    }
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setLoading(true);
      const response = await getProduct(id);
      setSelectedProduct(response.data);
      setShowViewModal(true);
    } catch (err) {
      setError('Failed to load product details');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      const response = await addProduct(newProduct);
      setProducts(prevProducts => [...prevProducts, response.data]);
      setShowAddModal(false);
      setNewProduct({
        name: '',
        data: {
          year: '',
          price: '',
          CPU_model: '',
          Hard_disk_size: ''
        }
      });
    } catch (err) {
      setError('Failed to add product');
      console.error('Error adding product:', err);
    }
  };

  const handleDeleteProduct = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await deleteProduct(id);
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !showAddModal && !showViewModal) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search products..."
          className="form-input pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500 py-8 animate-[fadeIn_0.3s_ease-out]">
          {searchTerm ? 'No products found matching your search.' : 'No products available.'}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="card p-6"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => handleViewProduct(product.id, e)}
                    className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    title="View Details"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteProduct(product.id, e)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    title="Delete Product"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-gray-600">
                <p>Year: {product.data?.year || 'N/A'}</p>
                <p>Price: ${product.data?.price || 'N/A'}</p>
                <p>CPU: {product.data?.CPU_model || 'N/A'}</p>
                <p>Storage: {product.data?.Hard_disk_size || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 modal">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Add New Product</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({
                    ...newProduct,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={newProduct.data.year}
                  onChange={(e) => setNewProduct({
                    ...newProduct,
                    data: { ...newProduct.data, year: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={newProduct.data.price}
                  onChange={(e) => setNewProduct({
                    ...newProduct,
                    data: { ...newProduct.data, price: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPU Model
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={newProduct.data.CPU_model}
                  onChange={(e) => setNewProduct({
                    ...newProduct,
                    data: { ...newProduct.data, CPU_model: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hard Disk Size
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={newProduct.data.Hard_disk_size}
                  onChange={(e) => setNewProduct({
                    ...newProduct,
                    data: { ...newProduct.data, Hard_disk_size: e.target.value }
                  })}
                />
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              <button className="btn-primary" onClick={handleAddProduct}>
                Add Product
              </button>
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 modal">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Product Details</h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedProduct(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedProduct.name}</h3>
                <p className="text-gray-500 text-sm">ID: {selectedProduct.id}</p>
              </div>
              <div className="space-y-2">
                <p><strong>Year:</strong> {selectedProduct.data?.year || 'N/A'}</p>
                <p><strong>Price:</strong> ${selectedProduct.data?.price || 'N/A'}</p>
                <p><strong>CPU Model:</strong> {selectedProduct.data?.CPU_model || 'N/A'}</p>
                <p><strong>Hard Disk Size:</strong> {selectedProduct.data?.Hard_disk_size || 'N/A'}</p>
              </div>
            </div>
            <div className="mt-6">
              <button className="btn-secondary w-full" onClick={() => {
                setShowViewModal(false);
                setSelectedProduct(null);
              }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;