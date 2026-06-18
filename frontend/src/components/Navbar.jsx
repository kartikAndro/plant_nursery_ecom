import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ShoppingBag, 
  User as UserIcon, 
  Heart, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  UserCheck 
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to={isAdmin ? "/admin" : "/"} className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold tracking-tight text-nursery-700 font-sans">
                🍃 Leafy<span className="text-accent-terracotta">Loop</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAdmin && (
              <>
                <Link to="/" className="text-sm font-medium text-neutral-600 hover:text-nursery-650 transition-colors">
                  Home
                </Link>
                <Link to="/catalog" className="text-sm font-medium text-neutral-600 hover:text-nursery-650 transition-colors">
                  Shop Plants
                </Link>
              </>
            )}
            <Link to="/blog" className="text-sm font-medium text-neutral-600 hover:text-nursery-650 transition-colors">
              Care Blog
            </Link>
          </div>

          {/* Action Icons (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Wishlist Link */}
            {user && !isAdmin && (
              <Link to="/profile?tab=wishlist" className="relative text-neutral-600 hover:text-accent-terracotta transition-colors p-1" title="Wishlist">
                <Heart className="h-6 w-6" />
                {user.wishlist?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-terracotta text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                    {user.wishlist.length}
                  </span>
                )}
              </Link>
            )}

            {/* Shopping Cart Link */}
            {!isAdmin && (
              <Link to="/cart" className="relative text-neutral-600 hover:text-nursery-600 transition-colors p-1" title="Shopping Cart">
                <ShoppingBag className="h-6 w-6" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-nursery-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Dropdown / Auth Links */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-neutral-700 hover:text-nursery-600 focus:outline-none p-1 transition-colors"
                >
                  <div className="bg-nursery-100 text-nursery-700 rounded-full h-8 w-8 flex items-center justify-center font-bold border border-nursery-200 uppercase">
                    {user.name[0]}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl py-1 border border-neutral-100 z-50 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-neutral-50">
                      <p className="text-xs text-neutral-400">Signed in as</p>
                      <p className="text-sm font-semibold text-neutral-800 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <UserCheck className="h-4 w-4 mr-2 text-neutral-400" />
                      My Profile
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-nursery-700 hover:bg-nursery-50 transition-colors font-medium"
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2 text-nursery-500" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-neutral-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-nursery-600 hover:bg-nursery-700 focus:outline-none shadow-sm transition-all duration-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Hamburger Menu button (Mobile) */}
          <div className="md:hidden flex items-center space-x-4">
            {!isAdmin && (
              <Link to="/cart" className="relative text-neutral-600 p-1">
                <ShoppingBag className="h-6 w-6" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-nursery-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </Link>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-600 hover:text-nursery-600 hover:bg-neutral-50 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top-5 duration-200">
          {!isAdmin && (
            <>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-neutral-700 hover:bg-neutral-50 hover:text-nursery-600"
              >
                Home
              </Link>
              <Link
                to="/catalog"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-neutral-700 hover:bg-neutral-50 hover:text-nursery-600"
              >
                Shop Plants
              </Link>
            </>
          )}
          <Link
            to="/blog"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-neutral-700 hover:bg-neutral-50 hover:text-nursery-600"
          >
            Care Blog
          </Link>
          
          {user && !isAdmin && (
            <Link
              to="/profile?tab=wishlist"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-neutral-700 hover:bg-neutral-50 hover:text-nursery-600"
            >
              My Wishlist ({user.wishlist?.length || 0})
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-neutral-700 hover:bg-neutral-50 hover:text-nursery-600"
              >
                Profile & Addresses
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-nursery-700 hover:bg-nursery-50"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex w-full items-center px-3 py-2 rounded-lg text-base font-medium text-red-650 hover:bg-red-50 text-red-650 mt-4 border-t border-neutral-100 pt-4"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block text-center w-full px-4 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-nursery-600 hover:bg-nursery-700 shadow-sm mt-4"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
