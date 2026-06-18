import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, HelpCircle, Heart, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: 'Indoor Plants', img: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=250&q=80' },
    { name: 'Outdoor Plants', img: 'https://images.unsplash.com/photo-1528826722302-d4758b9ebed4?auto=format&fit=crop&w=250&q=80' },
    { name: 'Succulents', img: 'https://images.unsplash.com/photo-1596547613758-c10b57e793cb?auto=format&fit=crop&w=250&q=80' },
    { name: 'Bonsai', img: 'https://images.unsplash.com/photo-1613143715124-7389a9dbd178?auto=format&fit=crop&w=250&q=80' },
    { name: 'Seeds', img: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=250&q=80' },
    { name: 'Pots & Accessories', img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=250&q=80' },
  ];

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  // Filter lists
  const bestSellers = products
    .filter((p) => p.rating >= 4.0)
    .slice(0, 4);

  const newArrivals = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div className="space-y-16 pb-16 font-sans">
      {/* 1. Hero Section */}
      <section className="relative bg-nursery-950 text-white overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        {/* Background blobs for premium decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-nursery-800 rounded-full blur-3xl opacity-30 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-nursery-900 rounded-full blur-2xl opacity-20 -ml-20 -mb-20"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-nursery-800 text-nursery-300 border border-nursery-700">
              🍃 Fresh Plant Arrivals Weekly
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Bring Nature to Your <span className="text-nursery-400">Living Spaces</span>
            </h1>
            <p className="text-base sm:text-lg text-neutral-300 max-w-xl leading-relaxed">
              Explore our curated selection of high-quality indoor & outdoor plants, seeds, and accessories. Get expert care instructions and doorstep nursery delivery.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-nursery-950 bg-nursery-300 hover:bg-nursery-200 shadow-sm transition-all duration-200"
              >
                Browse Catalog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center justify-center px-6 py-3 border border-nursery-700 text-sm font-semibold rounded-xl text-neutral-200 hover:bg-neutral-800 transition-colors"
              >
                Read Care Blog
              </Link>
            </div>
          </div>

          {/* Featured Hero Product Card (Glassmorphism overlay) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="glass-panel-dark text-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1597055181300-e3633a207518?auto=format&fit=crop&w=450&q=80"
                alt="Fiddle Leaf Fig"
                className="w-full h-56 object-cover rounded-2xl mb-4"
              />
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-nursery-300 uppercase tracking-widest font-semibold">Featured Collector Choice</span>
                  <h3 className="font-bold text-lg text-neutral-100">Fiddle Leaf Fig (Ficus Lyrata)</h3>
                </div>
                <span className="text-xl font-black text-nursery-400">$59.99</span>
              </div>
              <p className="text-xs text-neutral-450 mt-2 leading-relaxed">
                Add an iconic statement with this glossy, violin-leafed plant. Includes detailed indoor care tags.
              </p>
              <Link
                to="/catalog"
                className="mt-4 w-full flex items-center justify-center py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white transition-all"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-850">
            Shop by Plant Category
          </h2>
          <p className="text-sm text-neutral-500 max-w-lg mx-auto">
            From easy-care indoor houseplants to delicate outdoor flowering shrubs.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/catalog?category=${encodeURIComponent(cat.name)}`}
              className="group text-center space-y-3 block focus:outline-none"
            >
              <div className="relative overflow-hidden pt-[100%] rounded-full bg-neutral-100 border border-neutral-150">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-350 ease-out"
                />
              </div>
              <h4 className="text-sm font-semibold text-neutral-700 group-hover:text-nursery-600 transition-colors">
                {cat.name}
              </h4>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-850">
              Customer Best Sellers ⭐
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Popular choices tested and loved by our gardening community.
            </p>
          </div>
          <Link
            to="/catalog?sortBy=popularity"
            className="text-sm font-semibold text-nursery-600 hover:text-nursery-700 flex items-center space-x-1"
          >
            <span>See all popularity</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="bg-neutral-50 border border-neutral-100 rounded-2xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : bestSellers.length === 0 ? (
          <p className="text-neutral-500 text-sm italic">No best selling products loaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Seasonal Promotion Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-100 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-neutral-150 relative">
          <div className="lg:col-span-7 p-8 sm:p-12 space-y-6 flex flex-col justify-center">
            <span className="text-xs font-semibold tracking-wider text-accent-terracotta uppercase">Limited Time Season Offer</span>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-850 tracking-tight leading-tight">
              Beginner Friendly Soil Prep & Pot Starter Kits
            </h2>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-md">
              Need a complete starter kit? Get a premium handcrafted Terracotta Pot, organic nutrient mix, and seeds package for an extra 20% discount on checkout.
            </p>
            <div className="pt-2">
              <Link
                to="/catalog?category=Pots %26 Accessories"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-white bg-accent-terracotta hover:bg-accent-terracotta_dark font-semibold text-sm transition-all"
              >
                Shop Pot Kits
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 h-64 lg:h-auto min-h-[300px] relative">
            <img
              src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80"
              alt="Terracotta pots"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5. New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-850">
              New Arrivals 🌱
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Fresh stock recently potted and added to our inventory catalog.
            </p>
          </div>
          <Link
            to="/catalog?sortBy=newest"
            className="text-sm font-semibold text-nursery-600 hover:text-nursery-700 flex items-center space-x-1"
          >
            <span>See all newest</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="bg-neutral-50 border border-neutral-100 rounded-2xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : newArrivals.length === 0 ? (
          <p className="text-neutral-500 text-sm italic">No products currently loaded.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
