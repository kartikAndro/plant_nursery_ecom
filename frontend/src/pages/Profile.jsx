import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Heart, 
  Trash2, 
  Plus, 
  Check, 
  Edit2, 
  Lock 
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function Profile() {
  const { 
    user, 
    token, 
    updateProfile, 
    addAddress, 
    editAddress, 
    deleteAddress, 
    toggleWishlist,
    logout 
  } = useAuth();
  
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab state synchronizations
  const activeTab = searchParams.get('tab') || 'details';

  // Customer orders lists
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Edit details form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileErr, setProfileErr] = useState('');

  // Address manager form states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [fullName, setFullName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [phone, setPhone] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [addrErr, setAddrErr] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !token) {
      navigate('/login?redirect=/profile');
    } else if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user, token, navigate]);

  // Fetch customer orders
  useEffect(() => {
    if (token && activeTab === 'orders') {
      setOrdersLoading(true);
      fetch(`${API_BASE}/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((res) => {
          if (res.ok) return res.json();
          return [];
        })
        .then((data) => {
          setOrders(data);
          setOrdersLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setOrdersLoading(false);
        });
    }
  }, [token, activeTab]);

  // Profile update submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileErr('');
    setProfileSuccess('');
    
    try {
      await updateProfile({ name, email, password });
      setProfileSuccess('Profile details updated successfully!');
      setPassword('');
    } catch (err) {
      setProfileErr(err.message || 'Profile update failed.');
    }
  };

  // Add/Edit address submit
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddrErr('');

    const payload = {
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault
    };

    try {
      if (editingAddressId) {
        await editAddress(editingAddressId, payload);
      } else {
        await addAddress(payload);
      }
      // Reset form
      setShowAddressForm(false);
      setEditingAddressId(null);
      setFullName('');
      setAddressLine1('');
      setAddressLine2('');
      setCity('');
      setState('');
      setPostalCode('');
      setPhone('');
      setIsDefault(false);
    } catch (err) {
      setAddrErr(err.message || 'Failed to process address.');
    }
  };

  // Edit address form populate
  const handleEditAddressInit = (addr) => {
    setEditingAddressId(addr._id);
    setFullName(addr.fullName);
    setAddressLine1(addr.addressLine1);
    setAddressLine2(addr.addressLine2 || '');
    setCity(addr.city);
    setState(addr.state);
    setPostalCode(addr.postalCode);
    setPhone(addr.phone);
    setIsDefault(addr.isDefault);
    setShowAddressForm(true);
  };

  const handleAddressDelete = async (addressId) => {
    if (window.confirm('Delete this address?')) {
      try {
        await deleteAddress(addressId);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleMoveToCart = (prod) => {
    if (prod.stock > 0) {
      addToCart(prod, 1);
      toggleWishlist(prod._id);
    }
  };

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center items-center">
        <div className="h-10 w-10 border-4 border-nursery-200 border-t-nursery-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Side: Navigation Links card */}
        <aside className="w-full md:w-64 bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="h-16 w-16 bg-nursery-100 text-nursery-700 rounded-full flex items-center justify-center font-bold text-2xl uppercase mx-auto border border-nursery-200">
              {user.name[0]}
            </div>
            <div>
              <h3 className="font-extrabold text-neutral-800 text-base">{user.name}</h3>
              <p className="text-xs text-neutral-400 capitalize">{user.role} Account</p>
            </div>
          </div>

          <nav className="space-y-1.5 pt-4 border-t border-neutral-100">
            <button
              onClick={() => handleTabChange('details')}
              className={`flex items-center w-full px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'details'
                  ? 'bg-nursery-50 text-nursery-700 shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <User className="h-4 w-4 mr-2.5 text-neutral-400" />
              Account Details
            </button>
            <button
              onClick={() => handleTabChange('addresses')}
              className={`flex items-center w-full px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'addresses'
                  ? 'bg-nursery-50 text-nursery-700 shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <MapPin className="h-4 w-4 mr-2.5 text-neutral-400" />
              Delivery Address Book ({user.addresses?.length || 0})
            </button>
            <button
              onClick={() => handleTabChange('orders')}
              className={`flex items-center w-full px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'orders'
                  ? 'bg-nursery-50 text-nursery-700 shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <ShoppingBag className="h-4 w-4 mr-2.5 text-neutral-400" />
              My Orders List
            </button>
            <button
              onClick={() => handleTabChange('wishlist')}
              className={`flex items-center w-full px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'wishlist'
                  ? 'bg-nursery-50 text-nursery-700 shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <Heart className="h-4 w-4 mr-2.5 text-neutral-400" />
              My Wishlist ({user.wishlist?.length || 0})
            </button>

            <button
              onClick={logout}
              className="w-full text-left px-4 py-3 text-xs font-semibold text-red-650 hover:bg-red-50 rounded-xl mt-4 border-t pt-4 border-neutral-100 flex items-center"
            >
              Sign Out Account
            </button>
          </nav>
        </aside>

        {/* Right Side: Tab Panel contents */}
        <main className="flex-1 w-full bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm min-h-[400px]">
          
          {/* Tab 1: Details */}
          {activeTab === 'details' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl font-bold text-neutral-850">Personal Profile Details</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Keep your account communication settings updated</p>
              </div>

              {profileErr && <p className="text-xs text-red-500 font-semibold">{profileErr}</p>}
              {profileSuccess && <p className="text-xs text-nursery-600 font-semibold">{profileSuccess}</p>}

              <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-600">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border p-2.5 rounded-lg text-sm text-neutral-750"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-600">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border p-2.5 rounded-lg text-sm text-neutral-750"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-1 mb-1">
                    <Lock className="h-3.5 w-3.5 text-neutral-400" />
                    <label className="font-semibold text-neutral-600">Change Password (Leave blank to keep current)</label>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-white border p-2.5 rounded-lg text-sm text-neutral-750"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-nursery-600 hover:bg-nursery-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Saved Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-neutral-850">Saved Addresses</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">Manage your shipping and billing address books</p>
                </div>
                {!showAddressForm && (
                  <button
                    onClick={() => {
                      setEditingAddressId(null);
                      setShowAddressForm(true);
                    }}
                    className="text-xs font-bold text-nursery-600 hover:text-nursery-700 flex items-center border px-3 py-2 rounded-xl bg-white hover:bg-neutral-50 transition-all"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    <span>Add New Address</span>
                  </button>
                )}
              </div>

              {/* Show Form */}
              {showAddressForm ? (
                <form onSubmit={handleAddressSubmit} className="space-y-4 text-xs max-w-xl bg-neutral-50 border border-neutral-100 rounded-2xl p-5">
                  <h3 className="font-bold text-neutral-700 text-sm">{editingAddressId ? 'Edit Address' : 'New Address'}</h3>
                  {addrErr && <p className="text-xs text-red-500 font-semibold">{addrErr}</p>}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-600">FullName</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-white border p-2.5 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-600">Phone</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="123-456-7890"
                        className="w-full bg-white border p-2.5 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-600">Address Line 1</label>
                    <input
                      type="text"
                      required
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="Street name, apt etc."
                      className="w-full bg-white border p-2.5 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-600">Address Line 2</label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Apt, unit etc. (optional)"
                      className="w-full bg-white border p-2.5 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="font-semibold text-neutral-600">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white border p-2.5 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-neutral-600">State</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-white border p-2.5 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-neutral-600">Postal Code</label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full bg-white border p-2.5 rounded-lg"
                      />
                    </div>
                  </div>

                  <label className="flex items-center cursor-pointer py-1 font-semibold text-neutral-600">
                    <input
                      type="checkbox"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="mr-2 rounded"
                    />
                    Set as Default Shipping Address
                  </label>

                  <div className="flex space-x-2 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-nursery-600 text-white rounded-lg font-bold"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false);
                        setEditingAddressId(null);
                      }}
                      className="px-4 py-2 border rounded-lg text-neutral-500 bg-white"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses?.length === 0 ? (
                    <p className="text-neutral-450 text-xs italic">No address listings found. Create one above.</p>
                  ) : (
                    user.addresses.map((addr) => (
                      <div key={addr._id} className="p-4 border rounded-2xl space-y-3 relative text-xs">
                        <div className="space-y-1 text-neutral-600">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-neutral-800">{addr.fullName}</p>
                            {addr.isDefault && (
                              <span className="bg-nursery-50 text-nursery-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-nursery-150 flex items-center">
                                <Check className="h-3 w-3 mr-0.5" />
                                <span>Default</span>
                              </span>
                            )}
                          </div>
                          <p>{addr.addressLine1}</p>
                          {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                          <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                          <p className="pt-1 text-neutral-450">{addr.phone}</p>
                        </div>

                        <div className="flex space-x-2 border-t border-neutral-100 pt-2.5 justify-end">
                          <button
                            onClick={() => handleEditAddressInit(addr)}
                            className="text-neutral-400 hover:text-nursery-600 p-1 flex items-center"
                          >
                            <Edit2 className="h-3.5 w-3.5 mr-1" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleAddressDelete(addr._id)}
                            className="text-neutral-400 hover:text-red-650 p-1 flex items-center"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Order History */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-850">Your Orders</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Track shipping statuses and history of nursery orders</p>
              </div>

              {ordersLoading ? (
                <div className="h-20 flex items-center justify-center">
                  <div className="h-6 w-6 border-2 border-nursery-200 border-t-nursery-600 rounded-full animate-spin"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-3xl p-6">
                  <p className="text-neutral-500 text-sm">No orders registered on this account yet.</p>
                  <Link
                    to="/catalog"
                    className="inline-flex items-center text-xs text-nursery-600 hover:text-nursery-700 mt-3 font-semibold"
                  >
                    <span>Browse Nursery Catalogue</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((ord) => (
                    <div key={ord._id} className="border border-neutral-100 rounded-2xl p-5 space-y-4 shadow-sm bg-neutral-50/45">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-3 text-xs">
                        <div>
                          <p className="text-neutral-450">ORDER ID</p>
                          <p className="font-mono text-neutral-700 font-bold">{ord._id}</p>
                        </div>
                        <div>
                          <p className="text-neutral-450">DATE PLACED</p>
                          <p className="font-bold text-neutral-700">{new Date(ord.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-neutral-450">TOTAL AMOUNT</p>
                          <p className="font-bold text-neutral-900">${ord.totalPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-neutral-450">STATUS</p>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                            ord.deliveryStatus === 'Delivered'
                              ? 'bg-green-100 text-green-700'
                              : ord.deliveryStatus === 'Cancelled'
                              ? 'bg-red-100 text-red-650'
                              : 'bg-yellow-100 text-yellow-750'
                          }`}>
                            {ord.deliveryStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items order details */}
                      <div className="space-y-2">
                        {ord.orderItems.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-neutral-600">
                            <span className="font-bold truncate max-w-[200px]">{item.name}</span>
                            <span>x{item.qty}</span>
                            <span className="font-bold text-neutral-800">${(item.price * item.qty).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Stepper progress tracker */}
                      {ord.deliveryStatus !== 'Cancelled' && (
                        <div className="pt-2 border-t border-neutral-200/50">
                          <p className="text-[10px] font-bold text-neutral-450 uppercase mb-2">Delivery Status Progress:</p>
                          <div className="flex items-center text-[10px] text-neutral-450 font-bold">
                            {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map((step, idx, arr) => {
                              const steps = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];
                              const currentIdx = steps.indexOf(ord.deliveryStatus);
                              const isCompleted = idx <= currentIdx;
                              
                              return (
                                <React.Fragment key={step}>
                                  <div className="flex items-center space-x-1 shrink-0">
                                    <div className={`h-4.5 w-4.5 rounded-full flex items-center justify-center border text-[9px] ${
                                      isCompleted 
                                        ? 'bg-nursery-600 border-nursery-600 text-white shadow-sm' 
                                        : 'bg-white border-neutral-200 text-neutral-400'
                                    }`}>
                                      {idx + 1}
                                    </div>
                                    <span className={`${isCompleted ? 'text-neutral-800 font-bold' : ''}`}>{step}</span>
                                  </div>
                                  {idx < arr.length - 1 && (
                                    <div className={`h-0.5 flex-1 mx-2 ${isCompleted ? 'bg-nursery-500' : 'bg-neutral-200'}`} />
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-850">My Wishlist</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Quickly access plants you have saved for later</p>
              </div>

              {user.wishlist?.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-3xl p-6">
                  <p className="text-neutral-500 text-sm">Your wishlist is currently empty.</p>
                  <Link
                    to="/catalog"
                    className="inline-flex items-center text-xs text-nursery-600 hover:text-nursery-700 mt-3 font-semibold"
                  >
                    <span>Browse Plant Catalog</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.wishlist?.map((prod) => {
                    // product might be populated or unpopulated. Let's make sure it handles both
                    if (!prod || typeof prod !== 'object') return null;

                    return (
                      <div key={prod._id} className="flex p-3.5 border rounded-2xl items-center relative text-xs bg-neutral-50/45">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="h-16 w-16 object-cover rounded-xl border shrink-0 bg-neutral-100 mr-3"
                        />
                        <div className="flex-1 space-y-1.5 pr-8">
                          <Link to={`/products/${prod._id}`} className="font-bold text-neutral-850 hover:underline line-clamp-1 block">
                            {prod.name}
                          </Link>
                          <p className="font-bold text-neutral-800">${prod.price.toFixed(2)}</p>
                          
                          {prod.stock === 0 ? (
                            <span className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded">Out of stock</span>
                          ) : (
                            <button
                              onClick={() => handleMoveToCart(prod)}
                              className="text-[10px] text-nursery-700 font-bold bg-nursery-50 hover:bg-nursery-100 border border-nursery-150 px-2 py-0.5 rounded transition-all focus:outline-none"
                            >
                              Move to Cart
                            </button>
                          )}
                        </div>

                        {/* Remove heart toggle */}
                        <button
                          onClick={() => toggleWishlist(prod._id)}
                          className="absolute right-3.5 top-3.5 p-1 text-neutral-400 hover:text-red-650 transition-colors"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
