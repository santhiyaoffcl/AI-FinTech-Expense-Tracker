import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  PieChart,
  Sparkles,
  User,
  LogOut,
  Target,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenExpenseModal: () => void;
  onOpenIncomeModal: () => void;
  closeMobileMenu?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenExpenseModal,
  onOpenIncomeModal,
  closeMobileMenu,
}) => {
  const { logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expense History', icon: Receipt },
    { id: 'income', label: 'Income Management', icon: TrendingUp },
    { id: 'budget', label: 'Budget Planner', icon: Target },
    { id: 'analytics', label: 'Financial Analytics', icon: PieChart },
    { id: 'ai-insights', label: 'AI Insights', icon: Sparkles, badge: 'AI' },
    { id: 'profile', label: 'User Profile', icon: User },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    if (closeMobileMenu) closeMobileMenu();
  };

  return (
    <aside className="w-full md:w-64 bg-slate-950/40 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between py-6 px-4 min-h-[calc(100vh-4rem)] shadow-2xl">
      <div className="space-y-6">
        {/* Quick Add Mobile Actions */}
        <div className="md:hidden grid grid-cols-2 gap-2 pb-4 border-b border-white/10">
          <button
            onClick={() => {
              onOpenExpenseModal();
              if (closeMobileMenu) closeMobileMenu();
            }}
            className="flex items-center justify-center space-x-1 py-2 px-3 text-xs font-bold bg-pink-600 text-white rounded-xl shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Expense</span>
          </button>
          <button
            onClick={() => {
              onOpenIncomeModal();
              if (closeMobileMenu) closeMobileMenu();
            }}
            className="flex items-center justify-center space-x-1 py-2 px-3 text-xs font-bold bg-white/10 text-slate-200 border border-white/10 rounded-xl shadow-sm"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Income</span>
          </button>
        </div>

        <div>
          <p className="px-3 text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-3">
            Main Navigation
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30 font-bold shadow-md shadow-pink-950/30'
                      : 'text-slate-400 font-medium hover:text-slate-100 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-pink-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[9px] font-extrabold bg-pink-600 text-white rounded-full border border-pink-400/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="pt-6 border-t border-white/10 space-y-3">
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center space-x-2 text-pink-400 font-bold text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Smart AI Assistance</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            AI scans spending anomalies and offers personalized savings advice in real-time.
          </p>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-transparent transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Account</span>
        </button>
      </div>
    </aside>
  );
};
