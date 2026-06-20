import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorMsg, setErrorMsg] = useState('');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitStatus(null);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setErrorMsg('Email is required');
      return;
    }
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    // Message validation
    if (!message.trim()) {
      setErrorMsg('Message is required');
      return;
    }
    if (message.trim().length < 10) {
      setErrorMsg('Message must be at least 10 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const accessKey = '6cd20776-3877-41c0-96ab-d94c2a95f270';

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          email: email.trim(),
          message: message.trim(),
          subject: 'LeafyLoop Contact Form Submission',
          from_name: 'LeafyLoop Footer Form',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setEmail('');
        setMessage('');
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus('error');
        setErrorMsg(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
      setErrorMsg('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-nursery-950 text-neutral-400 font-sans border-t border-neutral-800">
      {/* Top Section / Contact Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-neutral-850">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              Send us a message 🌿
            </h3>
            <p className="mt-2 text-sm text-neutral-450 leading-relaxed">
              Have questions about plant care, designer pots, or your order? Reach out to our nursery experts directly using Web3Forms.
            </p>
          </div>
          <div className="lg:col-span-2">
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:outline-none focus:border-nursery-500 text-sm transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <textarea
                    required
                    rows="3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message (min 10 characters)"
                    className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:outline-none focus:border-nursery-500 text-sm transition-all resize-none"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-red-500 font-semibold mt-1">
                  ⚠️ {errorMsg}
                </p>
              )}

              {submitStatus === 'success' && (
                <p className="text-xs text-nursery-400 font-semibold mt-1 flex items-center gap-1.5">
                  <Check className="h-4 w-4" /> Message sent successfully! We'll reply soon.
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-nursery-600 hover:bg-nursery-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
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
