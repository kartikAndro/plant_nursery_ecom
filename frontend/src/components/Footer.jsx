import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-nursery-950 text-neutral-400 font-sans border-t border-neutral-800">
      {/* Top Section / Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-neutral-850">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-white tracking-wide">
              Keep your inbox green 🌿
            </h3>
            <p className="mt-2 text-sm text-neutral-450 max-w-xl">
              Subscribe to LeafyLoop newsletter for plant care checklists, exclusive nursery discounts, and early access to new plant drops.
            </p>
          </div>
          <div>
            <form onSubmit={handleSubscribe} className="flex relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-neutral-800 text-white pl-4 pr-12 py-3 rounded-lg border border-neutral-700 focus:outline-none focus:border-nursery-500 text-sm transition-all"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 bg-nursery-600 hover:bg-nursery-500 text-white px-4 rounded-md transition-colors flex items-center justify-center focus:outline-none"
              >
                {subscribed ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-nursery-400 mt-2 animate-pulse">
                Thanks for subscribing! Check your inbox soon.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Links Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              🍃 LeafyLoop
            </span>
            <p className="mt-4 text-sm text-neutral-500 leading-relaxed">
              Premium online plant nursery offering hand-picked indoor and outdoor plants, designer pots, and expert plant care advice delivered straight to your door.
            </p>
          </div>

          {/* Featured Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Browse Categories
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/catalog?category=Indoor Plants" className="hover:text-nursery-450 transition-colors">
                  Indoor Plants
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Outdoor Plants" className="hover:text-nursery-450 transition-colors">
                  Outdoor Plants
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Succulents" className="hover:text-nursery-450 transition-colors">
                  Succulents & Cacti
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Bonsai" className="hover:text-nursery-450 transition-colors">
                  Bonsai Trees
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Pots %26 Accessories" className="hover:text-nursery-450 transition-colors">
                  Pots & Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Helpful Links
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/catalog" className="hover:text-nursery-450 transition-colors">
                  Shop All Plants
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-nursery-450 transition-colors">
                  Care Guides & Blog
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-nursery-450 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-nursery-450 transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Contact Nursery
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-nursery-500 shrink-0" />
                <span>100 Green Garden Lane, Greenville, CA 90210</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-nursery-500 shrink-0" />
                <span>+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-nursery-500 shrink-0" />
                <span>support@leafyloop.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom copyright line */}
      <div className="bg-nursery-950 py-6 text-center text-xs text-neutral-600 border-t border-neutral-900">
        <p>&copy; {new Date().getFullYear()} LeafyLoop Inc. All rights reserved. Made with love for plants 💚</p>
      </div>
    </footer>
  );
}
