import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Blog from './pages/Blog';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function CustomerOnlyRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center items-center">
        <div className="h-10 w-10 border-4 border-nursery-200 border-t-nursery-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-neutral-50 text-neutral-800 selection:bg-nursery-200 selection:text-nursery-900">
            {/* Header Navbar */}
            <Navbar />

            {/* Main viewports */}
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<CustomerOnlyRoute><Home /></CustomerOnlyRoute>} />
                <Route path="/catalog" element={<CustomerOnlyRoute><Catalog /></CustomerOnlyRoute>} />
                <Route path="/products/:id" element={<CustomerOnlyRoute><ProductDetail /></CustomerOnlyRoute>} />
                <Route path="/cart" element={<CustomerOnlyRoute><Cart /></CustomerOnlyRoute>} />
                <Route path="/checkout" element={<CustomerOnlyRoute><Checkout /></CustomerOnlyRoute>} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>

            {/* Site Footer */}
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
