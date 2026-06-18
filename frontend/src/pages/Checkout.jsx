import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { MapPin, CreditCard, ChevronRight, CheckCircle, Plus } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function Checkout() {
  const { user, token, addAddress } = useAuth();
  const { cartItems, clearCart, subtotal, shippingPrice, taxPrice, totalPrice } = useCart();
  const navigate = useNavigate();

  // Selected shipping address index
  const [selectedAddressId, setSelectedAddressId] = useState('');

  // New Address form states
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [phone, setPhone] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [addressErr, setAddressErr] = useState('');

  // Payment mock states
  const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Card');
  
  // Checkout flow states
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [checkoutErr, setCheckoutErr] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  // Redirect to login if user not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else if (user.addresses?.length > 0) {
      // Set default address
      const def = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setSelectedAddressId(def._id);
    }
  }, [user, navigate]);

  // Handle new address creation during checkout
  const handleAddAddress = async (e) => {
    e.preventDefault();
    setAddressErr('');

    try {
      const updatedUser = await addAddress({
        fullName,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        phone,
        isDefault
      });
      // Set newly added address as selected
      const added = updatedUser.addresses[updatedUser.addresses.length - 1];
      setSelectedAddressId(added._id);
      setShowNewAddressForm(false);
      // Reset form
      setFullName('');
      setAddressLine1('');
      setAddressLine2('');
      setCity('');
      setState('');
      setPostalCode('');
      setPhone('');
      setIsDefault(false);
    } catch (err) {
      setAddressErr(err.message || 'Failed to add address');
    }
  };

  // Handle order creation
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setCheckoutErr('Please select a shipping address');
      return;
    }

    setCheckoutErr('');
    setPlacingOrder(true);

    const activeAddress = user.addresses.find((a) => a._id === selectedAddressId);
    
    // Structure order payload
    const orderData = {
      orderItems: cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item.product
      })),
      shippingAddress: {
        fullName: activeAddress.fullName,
        addressLine1: activeAddress.addressLine1,
        addressLine2: activeAddress.addressLine2,
        city: activeAddress.city,
        state: activeAddress.state,
        postalCode: activeAddress.postalCode,
        country: activeAddress.country,
        phone: activeAddress.phone
      },
      paymentMethod,
      itemsPrice: subtotal,
      shippingPrice,
      totalPrice
    };

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      setCreatedOrder(data);
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      setCheckoutErr(err.message || 'Error occurred placing order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  // Render Success receipt
  if (orderSuccess) {
    return (
      <div className="max-w-md w-full mx-auto py-16 px-4 font-sans text-center space-y-6">
        <div className="bg-white border border-neutral-100 shadow-lg rounded-3xl p-8 space-y-5">
          <div className="p-4 bg-nursery-50 rounded-full border border-nursery-100 w-fit mx-auto text-nursery-600">
            <CheckCircle className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-black text-neutral-850">Order Confirmed!</h2>
          <p className="text-sm text-neutral-500">
            Thank you for shopping at LeafyLoop! Your order has been registered and is being processed.
          </p>
          
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-left text-xs space-y-2 text-neutral-600">
            <p className="font-bold text-neutral-800">Receipt Details:</p>
            <p>Order ID: <span className="font-mono">{createdOrder?._id}</span></p>
            <p>Total Charged: <span className="font-bold text-neutral-800">${createdOrder?.totalPrice?.toFixed(2)}</span></p>
            <p>Shipping to: <span>{createdOrder?.shippingAddress?.fullName}</span></p>
          </div>

          <div className="flex flex-col space-y-2 pt-2">
            <button
              onClick={() => navigate('/profile?tab=orders')}
              className="py-2.5 bg-nursery-600 hover:bg-nursery-700 text-white font-bold text-xs rounded-xl shadow-sm focus:outline-none"
            >
              Track Order Progress
            </button>
            <Link
              to="/catalog"
              className="text-xs font-semibold text-neutral-500 hover:text-nursery-600 py-1"
            >
              Continue Browsing Plants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-8">
      <h1 className="text-3xl font-extrabold text-neutral-850 border-b border-neutral-100 pb-4">Secure Checkout</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-neutral-500 text-sm">No items in your cart. Redirecting to cart...</p>
          {setTimeout(() => navigate('/cart'), 2000)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel: address & payment */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Address Selection */}
            <div className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h2 className="text-lg font-bold text-neutral-800 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-nursery-600" />
                  <span>1. Delivery Address</span>
                </h2>
                {!showNewAddressForm && (
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="text-xs font-bold text-nursery-600 hover:text-nursery-700 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    <span>Add Address</span>
                  </button>
                )}
              </div>

              {checkoutErr && <p className="text-xs text-red-500 font-semibold">{checkoutErr}</p>}

              {/* Saved addresses checkbox grid */}
              {!showNewAddressForm && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user?.addresses?.length === 0 ? (
                    <p className="text-neutral-450 text-xs italic md:col-span-2">No saved addresses found. Please add a new delivery address.</p>
                  ) : (
                    user?.addresses?.map((addr) => (
                      <label
                        key={addr._id}
                        className={`p-4 border rounded-2xl block cursor-pointer transition-all ${
                          selectedAddressId === addr._id
                            ? 'border-nursery-500 bg-nursery-50/45 shadow-sm'
                            : 'border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name="checkout-address"
                            checked={selectedAddressId === addr._id}
                            onChange={() => setSelectedAddressId(addr._id)}
                            className="mt-1 mr-3 text-nursery-600 focus:ring-nursery-500 shrink-0"
                          />
                          <div className="text-xs space-y-1 text-neutral-600">
                            <p className="font-bold text-neutral-800">{addr.fullName}</p>
                            <p>{addr.addressLine1}</p>
                            {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                            <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                            <p className="pt-1 text-neutral-450">{addr.phone}</p>
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              )}

              {/* Add New Address sub-form */}
              {showNewAddressForm && (
                <form onSubmit={handleAddAddress} className="space-y-4 text-xs max-w-xl bg-neutral-50 border border-neutral-100 rounded-2xl p-5">
                  <h3 className="font-bold text-neutral-700 text-sm">Create Delivery Address</h3>
                  {addressErr && <p className="text-xs text-red-500 font-semibold">{addressErr}</p>}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-600">Recipient Name</label>
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
                      <label className="font-semibold text-neutral-600">Phone Number</label>
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
                      placeholder="Street address, P.O. box"
                      className="w-full bg-white border p-2.5 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-600">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Apartment, suite, unit"
                      className="w-full bg-white border p-2.5 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-600">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="San Francisco"
                        className="w-full bg-white border p-2.5 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-600">State / Region</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="California"
                        className="w-full bg-white border p-2.5 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-600">Postal Code</label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="94103"
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
                      onClick={() => setShowNewAddressForm(false)}
                      className="px-4 py-2 border rounded-lg text-neutral-500 bg-white"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Step 2: Payment Simulation */}
            <div className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-neutral-800 flex items-center border-b border-neutral-100 pb-3">
                <CreditCard className="h-5 w-5 mr-2 text-nursery-600" />
                <span>2. Payment Option (Simulated)</span>
              </h2>

              <div className="space-y-3">
                <label className="flex items-center p-4 border border-nursery-500 bg-nursery-50/45 rounded-2xl cursor-pointer">
                  <input
                    type="radio"
                    checked={paymentMethod === 'Credit/Debit Card'}
                    onChange={() => setPaymentMethod('Credit/Debit Card')}
                    className="mr-3 text-nursery-600 focus:ring-nursery-500"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-neutral-800">Credit / Debit Card</p>
                    <p className="text-neutral-500 mt-0.5">Pay securely using standard checkout gateway simulators.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right panel: order total and items checkout */}
          <div className="lg:col-span-4 bg-neutral-50 border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-extrabold text-neutral-850 text-base">Checkout Summary</h3>

            {/* List items check */}
            <ul className="divide-y divide-neutral-200/50 max-h-56 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <li key={item.product} className="flex py-3.5 items-center justify-between text-xs font-semibold text-neutral-700">
                  <span className="truncate max-w-[150px]">{item.name}</span>
                  <span className="text-neutral-450 text-[11px]">x{item.qty}</span>
                  <span className="font-bold">${(item.price * item.qty).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-4 text-sm font-medium border-t border-b border-neutral-200 py-4">
              <div className="flex items-center justify-between text-neutral-500">
                <span>Items Cost</span>
                <span className="text-neutral-800 font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-500">
                <span>Shipping</span>
                <span className="text-neutral-800 font-semibold">
                  {shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-500">
                <span>Estimated Tax (8%)</span>
                <span className="text-neutral-800 font-semibold">${taxPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between font-bold text-neutral-900 text-base">
              <span>Order Grand Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder || cartItems.length === 0}
              className={`w-full flex items-center justify-center space-x-1.5 py-3.5 bg-nursery-600 hover:bg-nursery-700 text-white font-bold text-xs rounded-xl shadow-sm focus:outline-none ${
                placingOrder ? 'bg-neutral-300 cursor-wait' : ''
              }`}
            >
              <span>{placingOrder ? 'Processing...' : 'Place Secure Order'}</span>
              {!placingOrder && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
