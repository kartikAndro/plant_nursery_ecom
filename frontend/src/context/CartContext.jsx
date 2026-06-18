import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load initial cart items from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  // Save cart items to localStorage on change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x.product === product._id);

      if (existItem) {
        // Prevent exceeding stock limit
        const newQty = Math.min(existItem.qty + qty, product.stock);
        return prevItems.map((x) =>
          x.product === product._id ? { ...x, qty: newQty } : x
        );
      } else {
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            image: product.images[0],
            price: product.price,
            stock: product.stock,
            qty: Math.min(qty, product.stock),
          },
        ];
      }
    });
  };

  // Update item quantity
  const updateCartQty = (productId, qty) => {
    setCartItems((prevItems) =>
      prevItems.map((x) =>
        x.product === productId ? { ...x, qty: Math.max(1, Math.min(qty, x.stock)) } : x
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((x) => x.product !== productId));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  
  // Shipping: free above $50, else flat $5.99. If cart is empty, shipping is $0.
  const shippingPrice = cartItems.length === 0 ? 0 : subtotal > 50 ? 0 : 5.99;
  
  // Tax: 8%
  const taxPrice = subtotal * 0.08;
  
  const totalPrice = subtotal + shippingPrice + taxPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        subtotal: parseFloat(subtotal.toFixed(2)),
        shippingPrice: parseFloat(shippingPrice.toFixed(2)),
        taxPrice: parseFloat(taxPrice.toFixed(2)),
        totalPrice: parseFloat(totalPrice.toFixed(2)),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
