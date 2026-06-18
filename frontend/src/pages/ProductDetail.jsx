import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Droplets, 
  Sun, 
  Sprout, 
  ShieldCheck, 
  ChevronRight, 
  Trash2, 
  Edit3, 
  AlertTriangle 
} from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, toggleWishlist } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery
  const [activeImage, setActiveImage] = useState('');

  // Cart Qty
  const [qty, setQty] = useState(1);

  // Wishlist state
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  
  // Review edit modes
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');

  // Fetch product detail
  const fetchProduct = () => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setActiveImage(data.images[0]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center items-center">
        <div className="h-10 w-10 border-4 border-nursery-200 border-t-nursery-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4 font-sans">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-neutral-800">Failed to Load Product</h2>
        <p className="text-sm text-neutral-500">{error || 'The product details could not be retrieved.'}</p>
        <button
          onClick={() => navigate('/catalog')}
          className="px-5 py-2 bg-nursery-600 text-white rounded-xl text-sm font-semibold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const isWishlisted = user?.wishlist?.some((item) => {
    const wId = typeof item === 'object' ? item._id : item;
    return wId === product._id;
  });

  const handleWishlistClick = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setWishlistLoading(true);
    try {
      await toggleWishlist(product._id);
    } catch (err) {
      alert(err.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product, qty);
    }
  };

  // Submit product review handler
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!user) {
      setReviewError('You must be logged in to leave a review.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id,
          rating,
          comment
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      setReviewSuccess('Review added successfully!');
      setComment('');
      setRating(5);
      fetchProduct(); // reload reviews & rating index
    } catch (err) {
      setReviewError(err.message);
    }
  };

  // Delete product review handler
  const handleReviewDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete review');
      }
      fetchProduct();
    } catch (err) {
      alert(err.message);
    }
  };

  // Edit review save trigger
  const handleReviewEditSave = async (reviewId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: editRating,
          comment: editComment
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to edit review');
      }
      setEditingReviewId(null);
      fetchProduct();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-16">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-400">
        <span className="hover:text-nursery-600 cursor-pointer" onClick={() => navigate('/')}>Home</span>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="hover:text-nursery-600 cursor-pointer" onClick={() => navigate('/catalog')}>Shop</span>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="hover:text-nursery-600 cursor-pointer" onClick={() => navigate(`/catalog?category=${encodeURIComponent(product.category)}`)}>
          {product.category}
        </span>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-neutral-300" />
        <span className="text-neutral-700 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main product overview */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Image Viewer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-neutral-50 border border-neutral-100 rounded-3xl overflow-hidden aspect-square relative shadow-sm">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images?.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-neutral-50 shrink-0 transition-all focus:outline-none ${
                    activeImage === img ? 'border-nursery-600 shadow-sm' : 'border-neutral-200 hover:border-nursery-400'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: details */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-nursery-600 bg-nursery-50 px-3 py-1 rounded-full border border-nursery-100">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-850 tracking-tight mt-2">
              {product.name}
            </h1>
            
            {/* Ratings summary bar */}
            <div className="flex items-center space-x-1.5 pt-1">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4.5 w-4.5 ${i < Math.round(product.rating) ? 'fill-current' : 'text-neutral-200'}`} 
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-neutral-700">{product.rating}</span>
              <span className="text-sm text-neutral-400">({product.numReviews} customer reviews)</span>
            </div>
          </div>

          <div className="text-2xl font-black text-neutral-900 border-b border-neutral-100 pb-4">
            ${product.price.toFixed(2)}
          </div>

          <p className="text-sm text-neutral-500 leading-relaxed">
            {product.description}
          </p>

          {/* Quick Specifications grid badges */}
          <div className="grid grid-cols-2 gap-4 bg-neutral-50 border border-neutral-100 rounded-2xl p-4 text-xs">
            <div className="flex items-center space-x-2.5">
              <Sun className="h-5 w-5 text-nursery-600 shrink-0" />
              <div>
                <p className="font-semibold text-neutral-700">Sunlight</p>
                <p className="text-neutral-500 mt-0.5">{product.sunlight}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2.5">
              <Droplets className="h-5 w-5 text-nursery-600 shrink-0" />
              <div>
                <p className="font-semibold text-neutral-700">Watering</p>
                <p className="text-neutral-500 mt-0.5">{product.water}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2.5">
              <Sprout className="h-5 w-5 text-nursery-600 shrink-0" />
              <div>
                <p className="font-semibold text-neutral-700">Difficulty</p>
                <p className="text-neutral-500 mt-0.5">{product.difficulty} Care</p>
              </div>
            </div>
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="h-5 w-5 text-nursery-600 shrink-0" />
              <div>
                <p className="font-semibold text-neutral-700">Location</p>
                <p className="text-neutral-500 mt-0.5">{product.indoorOutdoor}</p>
              </div>
            </div>
          </div>

          {/* Ordering operations row */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-semibold text-neutral-600">Stock Status:</span>
              {product.stock === 0 ? (
                <span className="text-sm font-bold text-red-500 uppercase bg-red-50 px-3 py-0.5 rounded border border-red-100">Out of Stock</span>
              ) : (
                <span className="text-sm font-bold text-nursery-700 uppercase bg-nursery-50 px-3 py-0.5 rounded border border-nursery-100">
                  {product.stock} available in stock
                </span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold text-neutral-600">Quantity:</span>
                <div className="flex items-center border border-neutral-200 rounded-xl bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    className="px-3.5 py-1.5 text-neutral-500 hover:bg-neutral-50 focus:outline-none text-base"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 font-bold text-sm text-neutral-800">{qty}</span>
                  <button
                    onClick={() => setQty((prev) => Math.min(product.stock, prev + 1))}
                    className="px-3.5 py-1.5 text-neutral-500 hover:bg-neutral-50 focus:outline-none text-base"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex space-x-4 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl font-bold text-sm shadow-sm transition-all focus:outline-none ${
                  product.stock === 0
                    ? 'bg-neutral-200 text-neutral-450 cursor-not-allowed'
                    : 'bg-nursery-600 text-white hover:bg-nursery-700'
                }`}
              >
                <ShoppingCart className="h-4.5 w-4.5" />
                <span>Add to Shopping Cart</span>
              </button>

              <button
                onClick={handleWishlistClick}
                disabled={wishlistLoading}
                className={`p-3.5 border rounded-xl shadow-sm transition-all focus:outline-none ${
                  isWishlisted
                    ? 'bg-red-50 text-red-500 border-red-100'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:text-red-500 hover:bg-neutral-50'
                }`}
                title="Wishlist"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Complete care instructions detailed tab */}
      <section className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-neutral-800 border-b border-neutral-100 pb-3">
          Detailed Plant Care Instructions & Info
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-neutral-600 leading-relaxed">
          <div className="space-y-4">
            <h3 className="font-bold text-nursery-700 text-base">Care Routine</h3>
            <p>{product.careInstructions}</p>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-nursery-700 text-base">Growth & Dimensions</h3>
            <p>{product.growthInfo || 'Slow growth patterns, perfect for table placements or windows.'}</p>
          </div>
        </div>
      </section>

      {/* Customer reviews section */}
      <section className="space-y-8">
        <h2 className="text-xl font-bold text-neutral-850 border-b border-neutral-100 pb-3">
          Customer Reviews ({product.reviews?.length || 0})
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Review list */}
          <div className="lg:col-span-7 space-y-6">
            {!product.reviews || product.reviews.length === 0 ? (
              <p className="text-neutral-500 text-sm italic py-4">This product has not received any reviews yet. Be the first to write one!</p>
            ) : (
              <div className="space-y-6">
                {product.reviews.map((rev) => {
                  const isOwnReview = user && rev.user === user._id;
                  const isEditing = editingReviewId === rev._id;

                  return (
                    <div key={rev._id} className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-3 relative">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-neutral-800">{rev.name}</h4>
                          <span className="text-[11px] text-neutral-400">
                            {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>

                        {/* Edit / Delete actions for owner */}
                        {isOwnReview && !isEditing && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingReviewId(rev._id);
                                setEditRating(rev.rating);
                                setEditComment(rev.comment);
                              }}
                              className="p-1.5 text-neutral-400 hover:text-nursery-600 hover:bg-neutral-50 rounded-lg transition-colors focus:outline-none"
                              title="Edit Review"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleReviewDelete(rev._id)}
                              className="p-1.5 text-neutral-400 hover:text-red-650 hover:bg-neutral-50 rounded-lg transition-colors focus:outline-none"
                              title="Delete Review"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Display / Edit Form */}
                      {isEditing ? (
                        <div className="space-y-3 pt-2">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-500 mb-1">Editing Rating:</label>
                            <select
                              value={editRating}
                              onChange={(e) => setEditRating(Number(e.target.value))}
                              className="text-xs border rounded-lg px-2 py-1 bg-white"
                            >
                              {[5, 4, 3, 2, 1].map((r) => (
                                <option key={r} value={r}>{r} Stars</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-500 mb-1">Editing Review Comment:</label>
                            <textarea
                              rows="3"
                              value={editComment}
                              onChange={(e) => setEditComment(e.target.value)}
                              className="w-full text-xs p-3 border rounded-xl focus:outline-none"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleReviewEditSave(rev._id)}
                              className="px-3.5 py-1.5 bg-nursery-600 text-white text-xs font-semibold rounded-lg"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={() => setEditingReviewId(null)}
                              className="px-3.5 py-1.5 border border-neutral-200 text-neutral-500 text-xs font-semibold rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3.5 w-3.5 ${i < rev.rating ? 'fill-current' : 'text-neutral-200'}`} 
                              />
                            ))}
                          </div>
                          <p className="text-sm text-neutral-600 leading-relaxed font-sans">{rev.comment}</p>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Form to submit a review */}
          <div className="lg:col-span-5 bg-neutral-50 border border-neutral-100 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="font-extrabold text-neutral-800 text-base">Write a Customer Review</h3>
            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-sm">
                {reviewError && <p className="text-xs text-red-500 font-semibold">{reviewError}</p>}
                {reviewSuccess && <p className="text-xs text-nursery-600 font-semibold">{reviewSuccess}</p>}
                
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Select Rating:</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-neutral-700"
                  >
                    <option value="5">5 Stars - Outstanding</option>
                    <option value="4">4 Stars - Very Good</option>
                    <option value="3">3 Stars - Good / Average</option>
                    <option value="2">2 Stars - Disappointed</option>
                    <option value="1">1 Star - Poor quality</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Review Comment:</label>
                  <textarea
                    rows="4"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write details about plant health, soil conditions, delivery speed, and size details..."
                    className="w-full bg-white border border-neutral-200 rounded-xl p-4 text-neutral-700 focus:outline-none focus:border-nursery-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-nursery-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-nursery-700 transition-all focus:outline-none"
                >
                  Submit Review
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3 bg-white border border-neutral-200/50 rounded-2xl p-4">
                <p className="text-xs text-neutral-500">You must be signed in to submit product reviews.</p>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-nursery-50 hover:bg-nursery-100 text-nursery-700 text-xs font-semibold rounded-lg"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
