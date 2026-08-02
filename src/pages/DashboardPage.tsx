import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FinancialSummary, Expense, Income } from '../types';
import { StatCard } from '../components/StatCard';
import { BudgetWarningBanner } from '../components/BudgetWarningBanner';
import { TextType } from '../components/TextType';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Receipt,
  Wallet,
  PiggyBank,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Clock,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface DashboardPageProps {
  onOpenExpenseModal: () => void;
  onOpenIncomeModal: () => void;
  setActiveTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenExpenseModal,
  onOpenIncomeModal,
  setActiveTab,
}) => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await api.get('/budget/summary');
      if (res.data.success) {
        setSummary(res.data.summary);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading financial metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Header */}
      <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Smart FinTech Assistant</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
            <TextType
              as="span"
              text={`Welcome back, ${user?.name || 'Valued User'} 👋`}
              typingSpeed={50}
              loop={false}
              showCursor={true}
              cursorCharacter="|"
              cursorClassName="text-pink-400 font-sans ml-1 text-2xl"
              className="inline-flex items-center"
            />
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Track your monthly activities and manage income vs expenses seamlessly.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenIncomeModal}
            className="px-4 py-2 text-xs font-bold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all shadow-sm"
          >
            + Add Income
          </button>
          <button
            onClick={onOpenExpenseModal}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-full shadow-lg shadow-pink-600/30 border border-pink-400/30 transition-all"
          >
            + Add Expense
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs font-medium rounded-2xl backdrop-blur-md">
          {error}
        </div>
      )}

      {/* 4 Core Financial Metrics */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.08
            }
          }
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        >
          <StatCard
            title="Total Income"
            value={summary?.totalIncome || 0}
            icon={TrendingUp}
            variant="emerald"
            subtitle="Combined earnings"
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        >
          <StatCard
            title="Total Expenses"
            value={summary?.totalExpense || 0}
            icon={Receipt}
            variant="rose"
            subtitle="All recorded spending"
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        >
          <StatCard
            title="Current Balance"
            value={summary?.remainingBalance || 0}
            icon={Wallet}
            variant="cyan"
            subtitle="Available funds"
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        >
          <StatCard
            title="Net Savings"
            value={summary?.savings || 0}
            icon={PiggyBank}
            variant="amber"
            subtitle="Remaining positive balance"
          />
        </motion.div>
      </motion.div>

      {/* Budget Warning / Health Banner */}
      {summary && (
        <BudgetWarningBanner
          warningLevel={summary.warningLevel}
          message={summary.warningMessage}
          budgetPercentageUsed={summary.budgetPercentageUsed}
          currentMonthExpense={summary.currentMonthTotalExpense}
          monthlyBudget={summary.monthlyBudget}
        />
      )}

      {/* Category Breakdown Preview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions List */}
        <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-pink-400" />
              <h3 className="text-sm font-serif font-bold text-white text-base">Recent Transactions</h3>
            </div>
            <button
              onClick={() => setActiveTab('expenses')}
              className="text-xs text-pink-400 font-bold hover:underline flex items-center"
            >
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>

          {summary?.recentExpenses && summary.recentExpenses.length > 0 ? (
            <div className="space-y-2.5">
              {summary.recentExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/30 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-2xl bg-pink-500/15 text-pink-400 flex items-center justify-center font-bold text-xs border border-pink-500/30">
                      -₹{exp.amount.toFixed(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{exp.title}</h4>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="px-2 py-0.5 bg-white/10 text-pink-300 border border-white/10 rounded-full font-semibold">
                          {exp.category}
                        </span>
                        <span>•</span>
                        <span>{exp.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-pink-400">
                      -₹{exp.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs font-medium">
              No recent expenses found. Click "+ Add Expense" to begin tracking!
            </div>
          )}
        </div>

        {/* My Accounts / Cards Widget + AI Teaser */}
        <div className="space-y-6">
          {/* Credit Card Graphic (Matching uploaded sample image!) */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-sm font-serif font-bold text-white">My Accounts</h3>
              <span className="text-[10px] uppercase font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">Active Cards</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 border border-white/20 shadow-xl text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-widest uppercase font-extrabold opacity-80">FinTech Preferred</span>
                <span className="text-xs font-black italic tracking-wider">VISA</span>
              </div>
              <div className="text-sm tracking-widest font-mono font-bold pt-1 opacity-90">
                •••• •••• •••• {user?.id ? user.id.slice(-4) : '2241'}
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-white/20">
                <div>
                  <div className="text-[9px] uppercase font-bold opacity-70">Card Holder</div>
                  <div className="text-xs font-bold truncate max-w-[120px]">{user?.name || 'Alex Morgan'}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] uppercase font-bold opacity-70">Available Balance</div>
                  <div className="text-xs font-extrabold">₹{(summary?.remainingBalance || 0).toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insight Teaser Card */}
          <div className="bg-gradient-to-br from-pink-950/40 via-purple-950/40 to-slate-950/60 border border-pink-500/30 rounded-2xl p-5 text-white flex flex-col justify-between space-y-4 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="space-y-3 z-10">
              <div className="flex items-center space-x-2">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-300">
                  AI Spending Advisor
                </span>
              </div>

              <div>
                <h3 className="text-sm font-serif font-bold text-white">Smart Behavioral Analysis</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Automated spending audits, subscription tracking, and custom savings strategies.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('ai-insights')}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-full transition-all flex items-center justify-center space-x-2 shadow-lg shadow-pink-950/50 border border-pink-400/30 z-10"
            >
              <span>Generate Full AI Insights</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
