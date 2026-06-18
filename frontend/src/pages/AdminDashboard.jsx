import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Sprout, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle,
  X 
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState('dashboard');

  // Master Data
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // Load States
  const [loading, setLoading] = useState(true);

  // Modal Dialog states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);

  // Form: Product fields
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodDesc, setProdDesc] = useState('');
  const [prodImg, setProdImg] = useState('');
  const [prodCategory, setProdCategory] = useState('Indoor Plants');
  const [prodStock, setProdStock] = useState(10);
  const [prodDifficulty, setProdDifficulty] = useState('Easy');
  const [prodSunlight, setProdSunlight] = useState('');
  const [prodWater, setProdWater] = useState('');
  const [prodCare, setProdCare] = useState('');
  const [prodGrowth, setProdGrowth] = useState('');
  const [prodIndoorOutdoor, setProdIndoorOutdoor] = useState('Indoor');

  // Image Upload State
  const [imageUploading, setImageUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only image files (JPEG, PNG, WEBP) are allowed');
      return;
    }

    // Validate file size (2MB limit)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Image size must be less than 2MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setImageUploading(true);
    try {
      const res = await fetch(`${API_BASE}/products/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setProdImg(data.imageUrl);
      } else {
        const d = await res.json();
        alert(d.message || 'Image upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setImageUploading(false);
    }
  };

  // Form: Blog fields
  const [blogTitle, setBlogTitle] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImg, setBlogImg] = useState('');
  const [blogTags, setBlogTags] = useState('');
  const [blogReadTime, setBlogReadTime] = useState('5 min read');

  // Redirect non-admins
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch all admin datasets
  const fetchAllData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      // 1. Fetch Products
      const prodRes = await fetch(`${API_BASE}/products`);
      if (prodRes.ok) setProducts(await prodRes.json());

      // 2. Fetch Orders
      const ordRes = await fetch(`${API_BASE}/orders`, { headers });
      if (ordRes.ok) setOrders(await ordRes.json());

      // 3. Fetch Customers
      const custRes = await fetch(`${API_BASE}/users`, { headers });
      if (custRes.ok) setCustomers(await custRes.json());

      // 4. Fetch Blogs
      const blogRes = await fetch(`${API_BASE}/blogs`);
      if (blogRes.ok) setBlogs(await blogRes.json());

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  // Product CRUD Handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    // Field validations
    if (!prodName.trim() || prodName.trim().length < 3) {
      alert('Product title must be at least 3 characters long');
      return;
    }
    if (prodPrice === undefined || Number(prodPrice) <= 0) {
      alert('Price must be greater than 0');
      return;
    }
    if (prodStock === undefined || Number(prodStock) < 0) {
      alert('Stock cannot be negative');
      return;
    }
    if (!prodDesc.trim() || prodDesc.trim().length < 10) {
      alert('Description must be at least 10 characters long');
      return;
    }
    if (!prodImg) {
      alert('Please upload a product image');
      return;
    }

    const payload = {
      name: prodName,
      price: Number(prodPrice),
      description: prodDesc,
      images: prodImg ? [prodImg] : undefined,
      category: prodCategory,
      stock: Number(prodStock),
      difficulty: prodDifficulty,
      sunlight: prodSunlight,
      water: prodWater,
      careInstructions: prodCare,
      growthInfo: prodGrowth,
      indoorOutdoor: prodIndoorOutdoor
    };

    try {
      const url = editingProductId ? `${API_BASE}/products/${editingProductId}` : `${API_BASE}/products`;
      const method = editingProductId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowProductModal(false);
        setEditingProductId(null);
        resetProductForm();
        fetchAllData();
      } else {
        const d = await res.json();
        alert(d.message || 'Product action failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProductEditInit = (p) => {
    setEditingProductId(p._id);
    setProdName(p.name);
    setProdPrice(p.price);
    setProdDesc(p.description);
    setProdImg(p.images[0] || '');
    setProdCategory(p.category);
    setProdStock(p.stock);
    setProdDifficulty(p.difficulty);
    setProdSunlight(p.sunlight);
    setProdWater(p.water);
    setProdCare(p.careInstructions);
    setProdGrowth(p.growthInfo || '');
    setProdIndoorOutdoor(p.indoorOutdoor);
    setShowProductModal(true);
  };

  const handleProductDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const resetProductForm = () => {
    setProdName('');
    setProdPrice(0);
    setProdDesc('');
    setProdImg('');
    setProdCategory('Indoor Plants');
    setProdStock(10);
    setProdDifficulty('Easy');
    setProdSunlight('');
    setProdWater('');
    setProdCare('');
    setProdGrowth('');
    setProdIndoorOutdoor('Indoor');
  };

  // Blog CRUD Handlers
  const handleBlogSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: blogTitle,
      excerpt: blogExcerpt,
      content: blogContent,
      imageUrl: blogImg,
      tags: blogTags.split(',').map(t => t.trim()).filter(Boolean),
      readTime: blogReadTime
    };

    try {
      const url = editingBlogId ? `${API_BASE}/blogs/${editingBlogId}` : `${API_BASE}/blogs`;
      const method = editingBlogId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowBlogModal(false);
        setEditingBlogId(null);
        resetBlogForm();
        fetchAllData();
      } else {
        const d = await res.json();
        alert(d.message || 'Blog action failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlogEditInit = (b) => {
    setEditingBlogId(b._id);
    setBlogTitle(b.title);
    setBlogExcerpt(b.excerpt);
    setBlogContent(b.content);
    setBlogImg(b.imageUrl);
    setBlogTags(b.tags?.join(', ') || '');
    setBlogReadTime(b.readTime);
    setShowBlogModal(true);
  };

  const handleBlogDelete = async (blogId) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      const res = await fetch(`${API_BASE}/blogs/${blogId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user account? All associated orders and reviews will also be removed.')) return;
    try {
      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAllData();
      } else {
        const d = await res.json();
        alert(d.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting user');
    }
  };

  const resetBlogForm = () => {
    setBlogTitle('');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogImg('');
    setBlogTags('');
    setBlogReadTime('5 min read');
  };

  // Order Status Handler
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Computed overview variables
  const totalRevenue = orders
    .filter(o => o.deliveryStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const lowStockProducts = products.filter(p => p.stock <= 5);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center items-center">
        <div className="h-10 w-10 border-4 border-nursery-200 border-t-nursery-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Sidebar Nav */}
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dashboard Tabs Grid panel */}
        <main className="flex-1 w-full bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm min-h-[500px]">
          
          {/* TAB 1: DASHBOARD METRICS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl font-bold text-neutral-850">Dashboard Overview</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Summary of platform sales, inventory stock levels, and users</p>
              </div>

              {/* Stats row cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border rounded-2xl p-4 space-y-2 bg-neutral-50/45">
                  <div className="flex items-center justify-between text-neutral-450">
                    <span className="text-xs font-bold uppercase">Revenue</span>
                    <DollarSign className="h-4.5 w-4.5 text-nursery-600" />
                  </div>
                  <p className="text-2xl font-black text-neutral-900">${totalRevenue.toFixed(2)}</p>
                </div>
                <div className="border rounded-2xl p-4 space-y-2 bg-neutral-50/45">
                  <div className="flex items-center justify-between text-neutral-450">
                    <span className="text-xs font-bold uppercase">Orders</span>
                    <ShoppingBag className="h-4.5 w-4.5 text-nursery-600" />
                  </div>
                  <p className="text-2xl font-black text-neutral-900">{orders.length}</p>
                </div>
                <div className="border rounded-2xl p-4 space-y-2 bg-neutral-50/45">
                  <div className="flex items-center justify-between text-neutral-450">
                    <span className="text-xs font-bold uppercase">Customers</span>
                    <Users className="h-4.5 w-4.5 text-nursery-600" />
                  </div>
                  <p className="text-2xl font-black text-neutral-900">{customers.length}</p>
                </div>
                <div className="border rounded-2xl p-4 space-y-2 bg-neutral-50/45">
                  <div className="flex items-center justify-between text-neutral-450">
                    <span className="text-xs font-bold uppercase">Catalog</span>
                    <Sprout className="h-4.5 w-4.5 text-nursery-600" />
                  </div>
                  <p className="text-2xl font-black text-neutral-900">{products.length}</p>
                </div>
              </div>

              {/* Low Stock Alerts warning */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-neutral-800 text-sm flex items-center">
                  <AlertTriangle className="h-4.5 w-4.5 text-accent-terracotta mr-2 shrink-0 animate-pulse" />
                  <span>Low Stock Warnings ({lowStockProducts.length})</span>
                </h3>

                {lowStockProducts.length === 0 ? (
                  <div className="p-4 bg-green-50 text-nursery-700 text-xs rounded-2xl border border-green-150 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 shrink-0" />
                    <span>All products have healthy stock levels above 5 items!</span>
                  </div>
                ) : (
                  <div className="border rounded-2xl overflow-hidden shadow-sm bg-white">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-100 text-neutral-450 font-bold uppercase">
                          <th className="p-3">Product Name</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Stock Left</th>
                          <th className="p-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {lowStockProducts.map(p => (
                          <tr key={p._id} className="hover:bg-neutral-50">
                            <td className="p-3 font-bold text-neutral-800">{p.name}</td>
                            <td className="p-3 text-neutral-500">{p.category}</td>
                            <td className="p-3 font-black text-red-500">{p.stock} remaining</td>
                            <td className="p-3">
                              <button
                                onClick={() => handleProductEditInit(p)}
                                className="text-nursery-600 hover:text-nursery-700 font-bold"
                              >
                                Restock Item
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGER */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h2 className="text-xl font-bold text-neutral-850">Nursery Inventory</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">Add, edit, delete catalog plants and tools</p>
                </div>
                <button
                  onClick={() => {
                    setEditingProductId(null);
                    resetProductForm();
                    setShowProductModal(true);
                  }}
                  className="text-xs font-bold text-white bg-nursery-600 hover:bg-nursery-700 flex items-center px-4 py-2.5 rounded-xl shadow-sm transition-all focus:outline-none"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  <span>Add New Product</span>
                </button>
              </div>

              <div className="border rounded-2xl overflow-hidden shadow-sm bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b text-neutral-450 font-bold uppercase">
                      <th className="p-3">Product Info</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Difficulty</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {products.map(p => (
                      <tr key={p._id} className="hover:bg-neutral-50">
                        <td className="p-3 font-bold text-neutral-800">{p.name}</td>
                        <td className="p-3 text-neutral-500">{p.category}</td>
                        <td className="p-3 font-semibold text-neutral-800">${p.price.toFixed(2)}</td>
                        <td className={`p-3 font-bold ${p.stock <= 5 ? 'text-red-500' : 'text-neutral-600'}`}>{p.stock}</td>
                        <td className="p-3">{p.difficulty}</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleProductEditInit(p)}
                            className="p-1 hover:text-nursery-600"
                            title="Edit"
                          >
                            <Edit3 className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => handleProductDelete(p._id)}
                            className="p-1 hover:text-red-650"
                            title="Delete"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER ORDERS LIST */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl font-bold text-neutral-850">Customer Orders</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Inspect purchases and update shipping timelines</p>
              </div>

              <div className="border rounded-2xl overflow-hidden shadow-sm bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b text-neutral-450 font-bold uppercase">
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Delivery Status</th>
                      <th className="p-3 text-right">Update Timeline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {orders.map(o => (
                      <tr key={o._id} className="hover:bg-neutral-50">
                        <td className="p-3 font-mono text-[10px] font-bold text-neutral-700">{o._id}</td>
                        <td className="p-3 text-neutral-800">
                          <p className="font-bold">{o.user?.name || 'Guest User'}</p>
                          <p className="text-[10px] text-neutral-400">{o.user?.email}</p>
                        </td>
                        <td className="p-3 text-neutral-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="p-3 font-bold text-neutral-900">${o.totalPrice.toFixed(2)}</td>
                        <td className="p-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                            o.deliveryStatus === 'Delivered'
                              ? 'bg-green-100 text-green-700'
                              : o.deliveryStatus === 'Cancelled'
                              ? 'bg-red-100 text-red-650'
                              : 'bg-yellow-100 text-yellow-750'
                          }`}>
                            {o.deliveryStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <select
                            value={o.deliveryStatus}
                            onChange={(e) => handleOrderStatusUpdate(o._id, e.target.value)}
                            className="bg-white border rounded px-2 py-1 text-xs text-neutral-700 focus:outline-none cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CLIENT LOOKUP LIST */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl font-bold text-neutral-850">Customers Directory</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Inspect user accounts and historical orders counts</p>
              </div>

              <div className="border rounded-2xl overflow-hidden shadow-sm bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b text-neutral-450 font-bold uppercase">
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Completed Purchases</th>
                      <th className="p-3">Date Registered</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {customers.map(c => (
                      <tr key={c._id} className="hover:bg-neutral-50">
                        <td className="p-3 font-bold text-neutral-800">{c.name}</td>
                        <td className="p-3 text-neutral-500">{c.email}</td>
                        <td className="p-3">
                          <span className={`inline-block px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                            c.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {c.role}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-neutral-800">{c.orderCount || 0} orders</td>
                        <td className="p-3 text-neutral-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td className="p-3 text-right">
                          {c._id !== user?._id && (
                            <button
                              onClick={() => handleUserDelete(c._id)}
                              className="p-1 text-neutral-400 hover:text-red-650 transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: BLOG MANAGER */}
          {activeTab === 'blogs' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h2 className="text-xl font-bold text-neutral-850">Care Guide Articles</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">Publish and edit educational blogs for clients</p>
                </div>
                <button
                  onClick={() => {
                    setEditingBlogId(null);
                    resetBlogForm();
                    setShowBlogModal(true);
                  }}
                  className="text-xs font-bold text-white bg-nursery-600 hover:bg-nursery-700 flex items-center px-4 py-2.5 rounded-xl shadow-sm transition-all focus:outline-none"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  <span>Publish Article</span>
                </button>
              </div>

              <div className="border rounded-2xl overflow-hidden shadow-sm bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b text-neutral-450 font-bold uppercase">
                      <th className="p-3">Title</th>
                      <th className="p-3">Author</th>
                      <th className="p-3">Read Time</th>
                      <th className="p-3">Tags</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {blogs.map(b => (
                      <tr key={b._id} className="hover:bg-neutral-50">
                        <td className="p-3 font-bold text-neutral-800 line-clamp-1 max-w-[250px]">{b.title}</td>
                        <td className="p-3 text-neutral-500">{b.authorName}</td>
                        <td className="p-3">{b.readTime}</td>
                        <td className="p-3 text-neutral-400">{b.tags?.join(', ')}</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleBlogEditInit(b)}
                            className="p-1 hover:text-nursery-600"
                            title="Edit"
                          >
                            <Edit3 className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => handleBlogDelete(b._id)}
                            className="p-1 hover:text-red-650"
                            title="Delete"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: ADD/EDIT PRODUCT DIALOG */}
      {showProductModal && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowProductModal(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-700 p-1.5 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>

            <h3 className="text-xl font-bold text-neutral-850">
              {editingProductId ? 'Edit Nursery Product' : 'Add New Plant / Accessory'}
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-600">Product Title</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Fiddle Leaf Fig"
                    className="w-full bg-white border p-2.5 rounded-lg text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-neutral-600">Category Selection</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full bg-white border p-2.5 rounded-lg text-sm cursor-pointer"
                  >
                    <option value="Indoor Plants">Indoor Plants</option>
                    <option value="Outdoor Plants">Outdoor Plants</option>
                    <option value="Flowering Plants">Flowering Plants</option>
                    <option value="Succulents">Succulents</option>
                    <option value="Bonsai">Bonsai</option>
                    <option value="Seeds">Seeds</option>
                    <option value="Pots & Accessories">Pots & Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-600">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full bg-white border p-2.5 rounded-lg text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-neutral-600">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full bg-white border p-2.5 rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-2 md:col-span-1 space-y-1">
                  <label className="font-bold text-neutral-600">Indoor/Outdoor Placement</label>
                  <select
                    value={prodIndoorOutdoor}
                    onChange={(e) => setProdIndoorOutdoor(e.target.value)}
                    className="w-full bg-white border p-2.5 rounded-lg text-sm cursor-pointer"
                  >
                    <option value="Indoor">Indoor Only</option>
                    <option value="Outdoor">Outdoor Only</option>
                    <option value="Both">Both Placements</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-600">Product Description</label>
                <textarea
                  rows="3"
                  required
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Provide botanical details and visual highlights..."
                  className="w-full bg-white border p-2.5 rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-600">Product Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full bg-white border p-2.5 rounded-lg text-sm cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-nursery-50 file:text-nursery-700 hover:file:bg-nursery-100"
                />
                {imageUploading && (
                  <p className="text-xs text-neutral-450 animate-pulse mt-1">Uploading image...</p>
                )}
                {prodImg && (
                  <div className="mt-2.5 relative inline-block">
                    <img
                      src={prodImg}
                      alt="Product preview"
                      className="h-24 w-24 object-cover rounded-xl border bg-neutral-50 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setProdImg('')}
                      className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none shadow-md transition-all"
                      title="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-neutral-100 pt-3">
                <h4 className="font-bold text-nursery-700 text-sm mb-3">Plant Care Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-600">Watering Schedule</label>
                    <input
                      type="text"
                      required={prodCategory !== 'Pots & Accessories'}
                      value={prodWater}
                      onChange={(e) => setProdWater(e.target.value)}
                      placeholder="e.g. Once a week"
                      className="w-full bg-white border p-2.5 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-600">Sunlight Demand</label>
                    <input
                      type="text"
                      required={prodCategory !== 'Pots & Accessories'}
                      value={prodSunlight}
                      onChange={(e) => setProdSunlight(e.target.value)}
                      placeholder="e.g. Bright indirect sun"
                      className="w-full bg-white border p-2.5 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-600">Care Difficulty</label>
                    <select
                      value={prodDifficulty}
                      onChange={(e) => setProdDifficulty(e.target.value)}
                      className="w-full bg-white border p-2.5 rounded-lg cursor-pointer"
                    >
                      <option value="Easy">Easy Care</option>
                      <option value="Medium">Medium Care</option>
                      <option value="Hard">Hard Care</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-600">Detailed Care Instructions</label>
                  <textarea
                    rows="3"
                    required={prodCategory !== 'Pots & Accessories'}
                    value={prodCare}
                    onChange={(e) => setProdCare(e.target.value)}
                    placeholder="Enter detailed step by step care routines..."
                    className="w-full bg-white border p-2.5 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-600">Growth Information</label>
                  <textarea
                    rows="3"
                    value={prodGrowth}
                    onChange={(e) => setProdGrowth(e.target.value)}
                    placeholder="e.g. Grows up to 4 feet tall..."
                    className="w-full bg-white border p-2.5 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-nursery-600 text-white hover:bg-nursery-700 rounded-xl font-bold shadow-sm text-sm"
              >
                {editingProductId ? 'Save Product Changes' : 'Create Product Entry'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD/EDIT BLOG DIALOG */}
      {showBlogModal && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowBlogModal(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-700 p-1.5 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>

            <h3 className="text-xl font-bold text-neutral-850">
              {editingBlogId ? 'Edit Care Article' : 'Publish New Care Guide'}
            </h3>

            <form onSubmit={handleBlogSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-600">Article Title</label>
                  <input
                    type="text"
                    required
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="e.g. Complete watering guide for Succulents"
                    className="w-full bg-white border p-2.5 rounded-lg text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-neutral-600">Read Time Estimation</label>
                  <input
                    type="text"
                    required
                    value={blogReadTime}
                    onChange={(e) => setBlogReadTime(e.target.value)}
                    placeholder="e.g. 5 min read"
                    className="w-full bg-white border p-2.5 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-600">Image Cover URL</label>
                <input
                  type="text"
                  required
                  value={blogImg}
                  onChange={(e) => setBlogImg(e.target.value)}
                  placeholder="Paste Unsplash image URL link"
                  className="w-full bg-white border p-2.5 rounded-lg text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-600">Tag Categories (Comma separated)</label>
                <input
                  type="text"
                  required
                  value={blogTags}
                  onChange={(e) => setBlogTags(e.target.value)}
                  placeholder="e.g. Care Guide, Succulents, Plant Care"
                  className="w-full bg-white border p-2.5 rounded-lg text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-600">Article Excerpt (Brief Summary)</label>
                <input
                  type="text"
                  required
                  value={blogExcerpt}
                  onChange={(e) => setBlogExcerpt(e.target.value)}
                  placeholder="Write a catchy 1-2 sentence description..."
                  className="w-full bg-white border p-2.5 rounded-lg text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-600">Article Content (Markdown support)</label>
                <textarea
                  rows="10"
                  required
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  placeholder="Enter full guide details. Write ## Headers, ### Subheaders and - Bullets to format."
                  className="w-full bg-white border p-2.5 rounded-lg text-sm focus:outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-nursery-600 text-white hover:bg-nursery-700 rounded-xl font-bold shadow-sm text-sm"
              >
                {editingBlogId ? 'Save Article' : 'Publish Article'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
