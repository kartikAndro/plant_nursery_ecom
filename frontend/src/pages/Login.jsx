import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, Check } from 'lucide-react';

export default function Login() {
  const { login, requestPasswordReset, confirmPasswordReset } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redirect after login
  const redirect = searchParams.get('redirect') || '/';

  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password Reset view states
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState(1); // 1 = request, 2 = confirm
  const [resetMsg, setResetMsg] = useState('');
  const [resetErr, setResetErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Password reset request trigger
  const handleResetRequest = async (e) => {
    e.preventDefault();
    setResetErr('');
    setResetMsg('');

    try {
      const data = await requestPasswordReset(resetEmail);
      setResetMsg(data.message);
      setResetStep(2); // move to step 2 (verify code & set password)
    } catch (err) {
      setResetErr(err.message || 'No account with that email exists.');
    }
  };

  // Password reset confirmation trigger
  const handleResetConfirm = async (e) => {
    e.preventDefault();
    setResetErr('');
    setResetMsg('');

    try {
      await confirmPasswordReset(resetEmail, resetCode, newPassword);
      setResetMsg('Password changed successfully! You can close this modal and log in.');
      setTimeout(() => {
        setShowResetModal(false);
        setResetStep(1);
        setResetEmail('');
        setResetCode('');
        setNewPassword('');
        setResetMsg('');
      }, 3000);
    } catch (err) {
      setResetErr(err.message || 'Invalid code or password parameters.');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto py-16 px-4 font-sans">
      <div className="bg-white border border-neutral-100 shadow-lg rounded-3xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-neutral-850">Welcome Back 🌿</h2>
          <p className="text-xs text-neutral-400">Sign in to track orders, manage wishlist, and leave reviews</p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 text-red-650 text-xs font-semibold rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-600">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full text-sm bg-white pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-nursery-500 text-neutral-700"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-600">Password</label>
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-xs text-nursery-600 hover:text-nursery-700 font-semibold focus:outline-none"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm bg-white pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-nursery-500 text-neutral-700"
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-nursery-600 hover:bg-nursery-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all focus:outline-none mt-2 flex items-center justify-center space-x-1"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-neutral-50">
          <p className="text-xs text-neutral-450">
            Don't have an account?{' '}
            <Link to={`/register?redirect=${redirect}`} className="text-nursery-600 hover:text-nursery-700 font-bold">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Demo credentials box for review/test */}
        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs text-neutral-500 space-y-1 leading-relaxed">
          <p className="font-bold text-neutral-700 mb-1">🔑 Demo Accounts Available:</p>
          <p>🧑 **Customer:** `customer@nursery.com` / `password123`</p>
          <p>🛡️ **Admin:** `admin@nursery.com` / `admin123`</p>
        </div>
      </div>

      {/* Forgot Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-neutral-800">Reset Your Password</h3>
              <p className="text-xs text-neutral-400">Mock Password Recovery Procedure</p>
            </div>

            {resetErr && <p className="text-xs text-red-500 font-semibold">{resetErr}</p>}
            {resetMsg && <p className="text-xs text-nursery-600 font-semibold">{resetMsg}</p>}

            {resetStep === 1 ? (
              <form onSubmit={handleResetRequest} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-600 mb-1">Enter Saved Email:</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="customer@nursery.com"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-nursery-600 text-white font-bold rounded-lg"
                  >
                    Request Reset Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="px-4 py-2.5 border rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetConfirm} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-600 mb-1">Reset Code:</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter code 123456"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    className="w-full p-2.5 border rounded-xl text-center font-bold tracking-widest"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-600 mb-1">New Password:</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-nursery-600 text-white font-bold rounded-lg"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setResetStep(1);
                      setResetMsg('');
                    }}
                    className="px-4 py-2.5 border rounded-lg"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
