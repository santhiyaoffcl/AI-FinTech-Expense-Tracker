import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface BudgetWarningBannerProps {
  warningLevel: 'NORMAL' | 'WARNING' | 'EXCEEDED';
  message: string;
  budgetPercentageUsed: number;
  currentMonthExpense: number;
  monthlyBudget: number;
}

export const BudgetWarningBanner: React.FC<BudgetWarningBannerProps> = ({
  warningLevel,
  message,
  budgetPercentageUsed,
  currentMonthExpense,
  monthlyBudget,
}) => {
  if (warningLevel === 'NORMAL') {
    return (
      <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Budget Health: Safe</div>
            <div className="text-xs text-slate-400">{message}</div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-emerald-400">{budgetPercentageUsed.toFixed(1)}% Used</span>
          <div className="w-28 bg-slate-800 h-2 rounded-full overflow-hidden mt-1 border border-white/10">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(budgetPercentageUsed, 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  const isExceeded = warningLevel === 'EXCEEDED';

  return (
    <div
      className={`p-4.5 rounded-2xl border backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xl ${
        isExceeded
          ? 'bg-rose-950/40 border-pink-500/30 text-rose-200'
          : 'bg-amber-950/40 border-amber-500/30 text-amber-200'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isExceeded ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}
        >
          {isExceeded ? <AlertCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider">
            {isExceeded ? 'Monthly Budget Exceeded!' : 'Monthly Budget Warning'}
          </h4>
          <p className="text-xs mt-0.5 opacity-90">{message}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 shrink-0">
        <div className="text-right">
          <div className="text-xs font-extrabold">
            ₹{currentMonthExpense.toLocaleString('en-IN')} / ₹{monthlyBudget.toLocaleString('en-IN')}
          </div>
          <div className="w-36 bg-slate-900 h-2.5 rounded-full overflow-hidden mt-1 border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isExceeded ? 'bg-gradient-to-r from-pink-500 to-rose-600' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(budgetPercentageUsed, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
