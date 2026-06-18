import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redirect parameter after registration
  const redirect = searchParams.get('redirect') || '/';

  // State parameters
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate(redirect);
    } catch (err) {
      setError(err.message || 'Registration failed. Try a different email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto py-16 px-4 font-sans">
      <div className="bg-white border border-neutral-100 shadow-lg rounded-3xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-neutral-850">Create Account 🌿</h2>
          <p className="text-xs text-neutral-450">Join LeafyLoop and build your online green paradise</p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 text-red-650 text-xs font-semibold rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-600">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full text-sm bg-white pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-nursery-500 text-neutral-700"
              />
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-600">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full text-sm bg-white pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-nursery-500 text-neutral-700"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-600">Password</label>
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

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-600">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-neutral-50">
          <p className="text-xs text-neutral-450">
            Already have an account?{' '}
            <Link to={`/login?redirect=${redirect}`} className="text-nursery-600 hover:text-nursery-700 font-bold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
