import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { cartItems, updateCartQty, removeFromCart, subtotal, shippingPrice, taxPrice, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleQtyChange = (productId, qty) => {
    updateCartQty(productId, qty);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <h1 className="text-3xl font-extrabold text-neutral-850 mb-8 border-b border-neutral-100 pb-4">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white border border-neutral-100 rounded-3xl p-8 space-y-5">
          <div className="p-4 bg-neutral-50 rounded-full border border-neutral-100 w-fit mx-auto">
            <ShoppingBag className="h-10 w-10 text-neutral-450" />
          </div>
          <h3 className="text-lg font-bold text-neutral-800">Your Cart is Empty</h3>
          <p className="text-sm text-neutral-500 max-w-xs mx-auto">
            Add items from our catalog to get started on your plant-growing journey.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-nursery-600 text-white rounded-xl text-xs font-semibold hover:bg-nursery-700 transition-all shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Go Shop Plants</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart list panel */}
          <div className="lg:col-span-8 bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flow-root">
              <ul className="-my-6 divide-y divide-neutral-100">
                {cartItems.map((item) => (
                  <li key={item.product} className="flex py-6">
                    {/* Item Thumbnail */}
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-neutral-150 bg-neutral-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Item Metadata & controls */}
                    <div className="ml-4 flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between text-base font-bold text-neutral-850">
                          <h3 className="line-clamp-1 hover:text-nursery-600">
                            <Link to={`/products/${item.product}`}>{item.name}</Link>
                          </h3>
                          <p className="ml-4">${(item.price * item.qty).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-xs text-neutral-400">Unit Price: ${item.price.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center justify-between text-sm pt-2">
                        {/* Qty edit */}
                        <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => handleQtyChange(item.product, item.qty - 1)}
                            className="px-2.5 py-1 text-neutral-500 hover:bg-neutral-50"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 font-bold text-xs text-neutral-800">{item.qty}</span>
                          <button
                            onClick={() => handleQtyChange(item.product, item.qty + 1)}
                            className="px-2.5 py-1 text-neutral-500 hover:bg-neutral-50"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.product)}
                          className="flex items-center space-x-1 text-xs font-semibold text-neutral-400 hover:text-red-650 transition-colors p-1.5 focus:outline-none"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing summary sidebar card */}
          <div className="lg:col-span-4 bg-neutral-50 border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-extrabold text-neutral-850 text-base">Order Summary</h3>

            <div className="space-y-4 text-sm font-medium border-b border-neutral-200 pb-4">
              <div className="flex items-center justify-between text-neutral-500">
                <span>Subtotal</span>
                <span className="text-neutral-800 font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-500">
                <span>Estimated Shipping</span>
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
              <span>Order Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center space-x-2 py-3.5 bg-nursery-600 hover:bg-nursery-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all focus:outline-none"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              to="/catalog"
              className="block text-center text-xs font-semibold text-nursery-600 hover:text-nursery-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
