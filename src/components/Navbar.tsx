import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, PlusCircle, ArrowUpRight, LogOut, Menu, X, Wallet, Shield } from 'lucide-react';

interface NavbarProps {
  onOpenExpenseModal: () => void;
  onOpenIncomeModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenExpenseModal,
  onOpenIncomeModal,
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-slate-950/40 backdrop-blur-xl border-b border-white/10 text-slate-100 sticky top-0 z-30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-pink-600/30 border border-white/20">
              <Wallet className="w-5 h-5 text-white font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-xl tracking-tight text-white">Financial <span className="text-pink-400 font-sans text-lg font-extrabold">Report</span></span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider hidden sm:block">Track your monthly activities</p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={onOpenIncomeModal}
              id="add-income-btn"
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-bold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all shadow-sm"
            >
              <ArrowUpRight className="w-4 h-4 mr-1.5 text-emerald-400" />
              Add Income
            </button>
            <button
              onClick={onOpenExpenseModal}
              id="add-expense-btn"
              className="inline-flex items-center px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-full transition-all shadow-lg shadow-pink-600/30 border border-pink-400/30"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Add Expense
            </button>

            {/* Profile Menu pill */}
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center space-x-2.5 pl-3 border-l border-white/10 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-xs font-bold text-slate-200">{user?.name}</div>
                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{user?.email}</div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
