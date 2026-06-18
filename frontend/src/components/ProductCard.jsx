import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { user, toggleWishlist } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const isWishlisted = user?.wishlist?.some((item) => {
    // wishlist might be populated (objects) or unpopulated (IDs)
    const id = typeof item === 'object' ? item._id : item;
    return id === product._id;
  });

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    setWishlistLoading(true);
    try {
      await toggleWishlist(product._id);
    } catch (err) {
      alert(err.message || 'Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-md transition-all duration-350 flex flex-col relative">
      {/* Product Image Panel */}
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden bg-neutral-50 pt-[100%]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1 z-10">
          <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase bg-white/90 text-neutral-800 rounded-full shadow-sm backdrop-blur-sm">
            {product.category}
          </span>
          {product.stock === 0 ? (
            <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase bg-red-500 text-white rounded-full shadow-sm">
              Out of stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase bg-accent-terracotta text-white rounded-full shadow-sm animate-pulse">
              Only {product.stock} left
            </span>
          ) : null}
        </div>
      </Link>

      {/* Wishlist toggle overlay */}
      <button
        onClick={handleWishlistClick}
        disabled={wishlistLoading}
        className={`absolute top-3 right-3 p-2 rounded-full shadow-sm backdrop-blur-sm border border-neutral-100 z-10 transition-colors focus:outline-none ${
          isWishlisted 
            ? 'bg-red-50 text-red-500 border-red-100' 
            : 'bg-white/80 text-neutral-500 hover:text-red-500 hover:bg-white'
        }`}
      >
        <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Product Details Panel */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center space-x-1 mb-1.5">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold text-neutral-700">{product.rating}</span>
          <span className="text-xs text-neutral-400">({product.numReviews})</span>
        </div>

        <Link to={`/products/${product._id}`} className="block flex-1">
          <h3 className="font-semibold text-neutral-800 text-sm group-hover:text-nursery-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </Link>

        {/* Difficulty Level & Location */}
        <div className="flex items-center space-x-2 mt-3 text-[11px] text-neutral-450 font-medium">
          <span className="bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100">
            {product.indoorOutdoor}
          </span>
          <span className="bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100">
            {product.difficulty} Care
          </span>
        </div>

        {/* Pricing and Action row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-50">
          <span className="text-base font-bold text-neutral-900">${product.price.toFixed(2)}</span>

          <button
            onClick={handleAddToCartClick}
            disabled={product.stock === 0}
            className={`p-2 rounded-lg transition-all focus:outline-none ${
              product.stock === 0 
                ? 'bg-neutral-100 text-neutral-450 cursor-not-allowed' 
                : 'bg-nursery-50 text-nursery-700 hover:bg-nursery-600 hover:text-white'
            }`}
            title={product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          >
            <ShoppingCart className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
