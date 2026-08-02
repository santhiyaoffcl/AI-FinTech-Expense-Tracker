import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { AIInsightsData } from '../types';
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  PiggyBank,
  CheckCircle,
  Lightbulb,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';

export const AIInsightsPage: React.FC = () => {
  const [insights, setInsights] = useState<AIInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAIInsights = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/ai/insights');
      if (res.data.success) {
        setInsights(res.data.insights);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate AI insights.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>AI Insights</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
            Smart Spending Insights & Savings Recommendations
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Real-time AI financial audit detecting non-essential expenses, savings potential, and unusual spikes.
          </p>
        </div>

        <button
          onClick={fetchAIInsights}
          disabled={loading}
          className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-full transition-all shadow-lg shadow-pink-950/50 border border-pink-400/30 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analyzing Transactions...' : 'Re-run AI Analysis'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs font-medium rounded-2xl backdrop-blur-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl space-y-3">
          <div className="w-10 h-10 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-sm font-serif font-bold text-white">AI is auditing your financial ledger...</h3>
          <p className="text-xs text-slate-400 font-medium">
            Evaluating category distribution, identifying unnecessary recurring costs, and computing optimal savings strategies.
          </p>
        </div>
      ) : insights ? (
        <div className="space-y-6">
          {/* Executive Spending Analysis Card */}
          <div className="p-6 rounded-2xl bg-pink-950/30 border border-pink-500/20 space-y-3 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center space-x-2 text-pink-300 font-serif font-bold text-xs">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>AI Spending Behavior Audit</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {insights.spendingAnalysis}
            </p>
          </div>

          {/* Potential Monthly Savings Card */}
          <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <PiggyBank className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Potential Savings</span>
                <div className="text-2xl font-extrabold text-amber-400">
                  ₹{insights.potentialMonthlySavings.toLocaleString('en-IN')} / month
                </div>
              </div>
            </div>
            <span className="hidden sm:block text-xs text-slate-400 font-medium max-w-xs text-right">
              Identified through discretionary spending optimizations and category caps.
            </span>
          </div>

          {/* Grid: Unnecessary Expenses + Unusual Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Unnecessary Expenses List */}
            <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4">
              <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
                <TrendingDown className="w-4 h-4 text-pink-400" />
                <h3 className="text-sm font-serif font-bold text-white">Unnecessary / Non-Essential Expenses</h3>
              </div>

              {insights.unnecessaryExpenses && insights.unnecessaryExpenses.length > 0 ? (
                <div className="space-y-3">
                  {insights.unnecessaryExpenses.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-100">{item.title}</span>
                        <span className="text-xs font-extrabold text-pink-400">-₹{item.amount.toFixed(2)}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">{item.reason}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 font-medium">
                  No obvious unnecessary expenses flagged in your current ledger!
                </div>
              )}
            </div>

            {/* Unusual Spending Alerts */}
            <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4">
              <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-serif font-bold text-white">Unusual Spending & Anomaly Alerts</h3>
              </div>

              {insights.unusualSpendingAlerts && insights.unusualSpendingAlerts.length > 0 ? (
                <div className="space-y-2.5">
                  {insights.unusualSpendingAlerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 font-medium flex items-start space-x-2.5"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{alert}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 font-medium">
                  No unusual transaction spikes or anomaly alerts detected.
                </div>
              )}
            </div>
          </div>

          {/* Actionable Personalized Financial Advice */}
          <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
              <Lightbulb className="w-4 h-4 text-pink-400" />
              <h3 className="text-sm font-serif font-bold text-white">Personalized Financial Advice</h3>
            </div>

            <div className="space-y-2.5">
              {insights.financialAdvice.map((advice, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start space-x-3"
                >
                  <CheckCircle className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">{advice}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
