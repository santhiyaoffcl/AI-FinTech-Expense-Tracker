import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, Sparkles, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('demo@fintech.com');
  const [password, setPassword] = useState('demo1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('demo@fintech.com');
    setPassword('demo1234');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden antialiased">
      {/* Twilight Sunset ambient gradient blobs */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-950/50 border border-pink-400/30 mb-4">
          <Wallet className="w-6 h-6 text-white font-bold" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
          FinTech <span className="text-pink-400">AI</span> Ledger
        </h2>
        <p className="mt-1.5 text-xs font-medium text-slate-400">
          Executive Financial Ledger, Expense Tracking & AI Insights
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 text-xs font-medium text-rose-300 bg-rose-950/60 border border-rose-800/80 rounded-xl backdrop-blur-md">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-full shadow-lg shadow-pink-950/50 border border-pink-400/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            </button>
          </form>

          {/* Quick Demo Credentials Button */}
          <div className="mt-5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={fillDemoAccount}
              className="w-full py-2.5 px-3 text-xs font-bold text-pink-300 bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 rounded-full transition-colors flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Fill Demo Credentials (demo@fintech.com)</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400 font-medium">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-bold text-pink-400 hover:underline"
              >
                Register here <ArrowRight className="w-3 h-3 inline ml-0.5" />
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs font-medium text-slate-400 flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
          <span>JWT Authenticated & Encrypted Financial Ledger</span>
        </div>
      </div>
    </div>
  );
};
