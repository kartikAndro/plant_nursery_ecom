import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, RotateCcw, Frown } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search parameter defaults
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialSort = searchParams.get('sortBy') || 'newest';

  // React state sync
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);

  // Filter lists
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory ? [initialCategory] : []
  );
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [selectedIndoorOutdoors, setSelectedIndoorOutdoors] = useState([]);
  const [priceRange, setPriceRange] = useState(100); // Max cap
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Available filter options constant definition
  const categoriesList = [
    'Indoor Plants', 
    'Outdoor Plants', 
    'Flowering Plants', 
    'Succulents', 
    'Bonsai', 
    'Seeds', 
    'Pots & Accessories'
  ];

  const difficultiesList = ['Easy', 'Medium', 'Hard'];
  const indoorOutdoorList = ['Indoor', 'Outdoor', 'Both'];

  // Handle URL parameter synchronizations
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      setSelectedCategories([urlCategory]);
    }
    const urlSort = searchParams.get('sortBy');
    if (urlSort) {
      setSortBy(urlSort);
    }
  }, [searchParams]);

  // Fetch products based on criteria
  useEffect(() => {
    setLoading(true);
    
    // Construct query parameters
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (selectedCategories.length > 0) params.append('category', selectedCategories.join(','));
    if (selectedDifficulties.length > 0) params.append('difficulty', selectedDifficulties.join(','));
    if (selectedIndoorOutdoors.length > 0) params.append('indoorOutdoor', selectedIndoorOutdoors.join(','));
    if (priceRange < 100) params.append('maxPrice', priceRange.toString());
    if (availabilityOnly) params.append('availability', 'true');
    params.append('sortBy', sortBy);

    fetch(`http://localhost:5000/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products in catalog:', err);
        setLoading(false);
      });
  }, [search, selectedCategories, selectedDifficulties, selectedIndoorOutdoors, priceRange, availabilityOnly, sortBy]);

  // Handler helpers
  const handleCategoryChange = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((x) => x !== cat) : [...prev, cat]
    );
  };

  const handleDifficultyChange = (diff) => {
    setSelectedDifficulties((prev) =>
      prev.includes(diff) ? prev.filter((x) => x !== diff) : [...prev, diff]
    );
  };

  const handleIndoorOutdoorChange = (io) => {
    setSelectedIndoorOutdoors((prev) =>
      prev.includes(io) ? prev.filter((x) => x !== io) : [...prev, io]
    );
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setSelectedIndoorOutdoors([]);
    setPriceRange(100);
    setAvailabilityOnly(false);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-850">Discover Plants</h1>
          <p className="text-sm text-neutral-500 mt-1">Explore our fresh botanical selection for your home or patio.</p>
        </div>
        
        {/* Reset button */}
        <button
          onClick={handleResetFilters}
          className="text-xs font-semibold text-neutral-500 hover:text-nursery-600 flex items-center space-x-1 border border-neutral-200 px-3 py-2 rounded-xl bg-white hover:bg-neutral-50 transition-all focus:outline-none"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Main Grid: Filters + Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block space-y-6 shrink-0">
          {/* Search bar */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">Search</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search plant names..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-nursery-500 transition-colors"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
            </div>
          </div>

          {/* Category checklist */}
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">Category</h3>
            <div className="space-y-2">
              {categoriesList.map((cat) => (
                <label key={cat} className="flex items-center text-sm text-neutral-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                    className="h-4 w-4 text-nursery-600 border-neutral-300 rounded focus:ring-nursery-500 cursor-pointer mr-2.5"
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* Location checklist */}
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">Indoor / Outdoor</h3>
            <div className="space-y-2">
              {indoorOutdoorList.map((io) => (
                <label key={io} className="flex items-center text-sm text-neutral-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIndoorOutdoors.includes(io)}
                    onChange={() => handleIndoorOutdoorChange(io)}
                    className="h-4 w-4 text-nursery-600 border-neutral-300 rounded focus:ring-nursery-500 cursor-pointer mr-2.5"
                  />
                  {io}
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty checklist */}
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">Care Difficulty</h3>
            <div className="space-y-2">
              {difficultiesList.map((diff) => (
                <label key={diff} className="flex items-center text-sm text-neutral-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDifficulties.includes(diff)}
                    onChange={() => handleDifficultyChange(diff)}
                    className="h-4 w-4 text-nursery-600 border-neutral-300 rounded focus:ring-nursery-500 cursor-pointer mr-2.5"
                  />
                  {diff} Care
                </label>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">Max Price</h3>
              <span className="text-sm font-semibold text-neutral-900">${priceRange}</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-nursery-600 cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
            />
          </div>

          {/* Stock availability */}
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <label className="flex items-center text-sm text-neutral-600 cursor-pointer">
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(e) => setAvailabilityOnly(e.target.checked)}
                className="h-4 w-4 text-nursery-600 border-neutral-300 rounded focus:ring-nursery-500 cursor-pointer mr-2.5"
              />
              In Stock Only
            </label>
          </div>
        </aside>

        {/* Catalog List panel */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top filter summaries & Sort row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 border border-neutral-100 rounded-2xl shadow-sm">
            <div className="text-sm text-neutral-500 font-medium">
              Showing <span className="text-neutral-800 font-semibold">{products.length}</span> plants
            </div>

            {/* Sorting and Mobile toggles */}
            <div className="flex items-center space-x-3 justify-between sm:justify-end">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center space-x-1 px-3.5 py-2 border border-neutral-200 text-sm font-medium rounded-xl hover:bg-neutral-50 focus:outline-none transition-all"
              >
                <SlidersHorizontal className="h-4 w-4 text-neutral-500" />
                <span>Filters</span>
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-neutral-400 shrink-0 font-medium">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-neutral-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-nursery-500 text-neutral-700 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="popularity">Popularity</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Filters panel overlay drawer */}
          {showMobileFilters && (
            <div className="lg:hidden bg-white border border-neutral-100 rounded-2xl p-5 shadow-lg space-y-6 animate-in slide-in-from-top-4 duration-300">
              {/* Search mobile */}
              <div>
                <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">Search</h3>
                <input
                  type="text"
                  placeholder="Search plants..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-4 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Categories mobile */}
              <div>
                <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categoriesList.map((cat) => (
                    <label key={cat} className="flex items-center text-xs text-neutral-600">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                        className="mr-2"
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              {/* Indoor/Outdoor mobile */}
              <div>
                <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">Indoor / Outdoor</h3>
                <div className="flex space-x-4">
                  {indoorOutdoorList.map((io) => (
                    <label key={io} className="flex items-center text-xs text-neutral-600">
                      <input
                        type="checkbox"
                        checked={selectedIndoorOutdoors.includes(io)}
                        onChange={() => handleIndoorOutdoorChange(io)}
                        className="mr-2"
                      />
                      {io}
                    </label>
                  ))}
                </div>
              </div>

              {/* Difficulty mobile */}
              <div>
                <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">Difficulty</h3>
                <div className="flex space-x-4">
                  {difficultiesList.map((diff) => (
                    <label key={diff} className="flex items-center text-xs text-neutral-600">
                      <input
                        type="checkbox"
                        checked={selectedDifficulties.includes(diff)}
                        onChange={() => handleDifficultyChange(diff)}
                        className="mr-2"
                      />
                      {diff}
                    </label>
                  ))}
                </div>
              </div>

              {/* Max price mobile */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Max Price</h3>
                  <span className="text-xs font-semibold text-neutral-900">${priceRange}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-nursery-600"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 py-2 bg-nursery-600 text-white rounded-xl text-xs font-semibold"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 border border-neutral-200 text-neutral-600 rounded-xl text-xs"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Grid Layout Cards */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="bg-neutral-50 border border-neutral-100 rounded-2xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-neutral-100 rounded-3xl p-8 text-center space-y-4">
              <div className="p-4 bg-neutral-50 rounded-full border border-neutral-100">
                <Frown className="h-10 w-10 text-neutral-400" />
              </div>
              <h3 className="text-lg font-bold text-neutral-800">No Plants Found</h3>
              <p className="text-sm text-neutral-500 max-w-sm">
                We couldn't find any products matching your specific keywords or filters. Try adjusting your settings.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-nursery-600 hover:bg-nursery-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
