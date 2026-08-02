import React from 'react';
import {
  Wallet,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Receipt,
  Target,
  PieChart,
  User,
  Heart,
  Globe,
  Lock,
  Zap,
} from 'lucide-react';

interface FooterProps {
  setActiveTab?: (tab: string) => void;
  onOpenExpenseModal?: () => void;
  onOpenIncomeModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  onOpenExpenseModal,
  onOpenIncomeModal,
}) => {
  return (
    <footer className="w-full bg-slate-950/80 border-t border-white/10 backdrop-blur-xl mt-12 relative z-10 text-slate-400 text-xs">
      {/* Top Accent Gradient Border */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-950/50 border border-pink-400/30 shrink-0">
                <Wallet className="w-5 h-5 text-white font-bold" />
              </div>
              <span className="text-base font-serif font-bold text-white tracking-tight">
                FinTech <span className="text-pink-400">AI</span> Ledger
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              Enterprise financial intelligence platform combining automated ledger accounting, budget target forecasting, and AI spending audit.
            </p>
            <div className="flex items-center space-x-2 pt-1">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                Systems Operational
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-300 border border-pink-500/20">
                v2.4 Enterprise
              </span>
            </div>
          </div>

          {/* Core Modules Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
              Core Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab?.('dashboard')}
                  className="hover:text-pink-300 transition-colors flex items-center space-x-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-pink-400" />
                  <span>Executive Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab?.('expenses')}
                  className="hover:text-pink-300 transition-colors flex items-center space-x-1.5"
                >
                  <Receipt className="w-3.5 h-3.5 text-pink-400" />
                  <span>Expense Management</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab?.('income')}
                  className="hover:text-pink-300 transition-colors flex items-center space-x-1.5"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Income Streams</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab?.('budget')}
                  className="hover:text-pink-300 transition-colors flex items-center space-x-1.5"
                >
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  <span>Budget Target Engine</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Intelligence & Analytics */}
          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
              Intelligence & Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab?.('analytics')}
                  className="hover:text-pink-300 transition-colors flex items-center space-x-1.5"
                >
                  <PieChart className="w-3.5 h-3.5 text-pink-400" />
                  <span>Financial Analytics</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab?.('ai-insights')}
                  className="hover:text-pink-300 transition-colors flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>AI Spending Audit</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenExpenseModal}
                  className="hover:text-pink-300 transition-colors flex items-center space-x-1.5"
                >
                  <span className="text-xs text-pink-400">+</span>
                  <span>Quick Record Expense</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenIncomeModal}
                  className="hover:text-pink-300 transition-colors flex items-center space-x-1.5"
                >
                  <span className="text-xs text-emerald-400">+</span>
                  <span>Quick Record Income</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
              Security & Infrastructure
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-start space-x-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
                <ShieldCheck className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-200 font-bold text-[11px]">JWT Auth Enforced</div>
                  <div className="text-[10px] text-slate-400">Cryptographically signed user sessions & bcrypt password hashing.</div>
                </div>
              </div>

              <div className="flex items-start space-x-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-200 font-bold text-[11px]">Isolated User Vaults</div>
                  <div className="text-[10px] text-slate-400">Multi-tenant data isolation ensuring private financial records.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium text-slate-400">
          <div className="flex items-center space-x-2">
            <span>© 2026 FinTech AI Ledger Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-6 text-slate-400">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer flex items-center space-x-1">
              <Globe className="w-3 h-3 text-pink-400" />
              <span>INR (₹) Standard</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
