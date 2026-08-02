import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FinancialSummary } from '../types';
import { BudgetWarningBanner } from '../components/BudgetWarningBanner';
import { Target, Save, AlertCircle, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

export const BudgetPage: React.FC = () => {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [newBudget, setNewBudget] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/budget/summary');
      if (res.data.success) {
        setSummary(res.data.summary);
        setNewBudget(res.data.summary.monthlyBudget.toString());
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch budget status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const val = parseFloat(newBudget);
    if (isNaN(val) || val < 0) {
      setError('Please enter a valid budget amount.');
      return;
    }

    try {
      setUpdating(true);
      const res = await api.put('/budget/monthly-target', { monthlyBudget: val });
      if (res.data.success) {
        setMessage('Monthly budget target updated successfully!');
        fetchSummary();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update monthly budget.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading budget configuration...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-white tracking-tight flex items-center space-x-2">
          <Target className="w-6 h-6 text-pink-400" />
          <span>Monthly Budget Planner & Warning Engine</span>
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Set monthly expenditure targets and monitor budget thresholds in real-time.
        </p>
      </div>

      {/* Warning Status Banner */}
      {summary && (
        <BudgetWarningBanner
          warningLevel={summary.warningLevel}
          message={summary.warningMessage}
          budgetPercentageUsed={summary.budgetPercentageUsed}
          currentMonthExpense={summary.currentMonthTotalExpense}
          monthlyBudget={summary.monthlyBudget}
        />
      )}

      {/* Grid containing Target Config and Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget Setting Form */}
        <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
            <Target className="w-4 h-4 text-pink-400" />
            <h3 className="text-sm font-serif font-bold text-white">Configure Monthly Budget Target</h3>
          </div>

          {message && (
            <div className="p-3 text-xs font-medium text-emerald-300 bg-emerald-950/50 border border-emerald-800/80 rounded-xl">
              {message}
            </div>
          )}

          {error && (
            <div className="p-3 text-xs font-medium text-rose-300 bg-rose-950/50 border border-rose-800/80 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdateBudget} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Monthly Spending Target (₹)
              </label>
              <input
                type="number"
                step="50"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                placeholder="3500"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                required
              />
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                You will receive a warning if current month expenses exceed 80% or 100% of this target.
              </p>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-full transition-all flex items-center justify-center space-x-2 shadow-lg shadow-pink-950/50 border border-pink-400/30 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{updating ? 'Saving Target...' : 'Save Budget Target'}</span>
            </button>
          </form>
        </div>

        {/* Current Month Budget Metrics Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-serif font-bold text-white">Budget Performance Summary</h3>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30 rounded-full">
                Current Month
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-slate-400 font-medium">Monthly Budget Target:</span>
                <span className="font-extrabold text-white">₹{summary?.monthlyBudget.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-slate-400 font-medium">Current Month Expenses:</span>
                <span className="font-extrabold text-pink-400">₹{summary?.currentMonthTotalExpense.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-slate-400 font-medium">Remaining Allowance:</span>
                <span className={`font-extrabold ${(summary?.budgetRemaining || 0) < 0 ? 'text-pink-400' : 'text-emerald-400'}`}>
                  ₹{summary?.budgetRemaining.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-2xl text-xs text-pink-200 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
            <span className="font-medium">Smart Tip: Staying under 80% of your budget builds a robust emergency buffer.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
