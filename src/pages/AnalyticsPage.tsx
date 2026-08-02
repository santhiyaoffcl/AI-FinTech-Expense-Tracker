import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FinancialSummary } from '../types';
import {
  PieChart,
  BarChart2,
  TrendingUp,
  Award,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = [
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#14b8a6', // Teal
  '#64748b', // Slate
];

export const AnalyticsPage: React.FC = () => {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/budget/summary');
      if (res.data.success) {
        setSummary(res.data.summary);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load financial analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Rendering financial analytics...</div>;
  }

  // Bar Data for Income vs Expense
  const incomeVsExpenseData = [
    {
      name: 'Total Overview',
      Income: summary?.totalIncome || 0,
      Expense: summary?.totalExpense || 0,
      Savings: summary?.savings || 0,
    },
  ];

  // Pie Data for Category Breakdown
  const categoryPieData = (summary?.categoryBreakdown || []).map((item) => ({
    name: item.category,
    value: item.amount,
  }));

  // Income Sources Pie Data
  const incomePieData = (summary?.incomeBreakdown || []).map((item) => ({
    name: item.source,
    value: item.amount,
  }));

  // Calculate executive KPI ratios
  const totalInc = summary?.totalIncome || 0;
  const totalExp = summary?.totalExpense || 0;
  const savings = summary?.savings || 0;
  const monthlyBudget = summary?.monthlyBudget || 3500;
  const currentMonthExp = summary?.currentMonthTotalExpense || 0;

  const savingsRate = totalInc > 0 ? (savings / totalInc) * 100 : 0;
  const expenseRatio = totalInc > 0 ? (totalExp / totalInc) * 100 : 0;
  const dailyBurnRate = currentMonthExp / 30; // Approx daily burn
  const budgetUtilization = (currentMonthExp / monthlyBudget) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-white tracking-tight flex items-center space-x-2">
          <PieChart className="w-6 h-6 text-pink-400" />
          <span>Financial Analytics & Intelligence</span>
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Comprehensive breakdown of income distribution, category allocation, budget compliance, and capital efficiency ratios.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs font-medium rounded-2xl backdrop-blur-md">
          {error}
        </div>
      )}

      {/* Executive Financial KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Savings Rate Card */}
        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>SAVINGS RATE</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            {savingsRate.toFixed(1)}%
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            {savingsRate >= 20 ? 'Optimal Net Wealth Reserve' : 'Below 20% Target Savings'}
          </div>
        </div>

        {/* Expense Ratio Card */}
        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>EXPENSE RATIO</span>
            <BarChart2 className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-extrabold text-pink-400">
            {expenseRatio.toFixed(1)}%
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-pink-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Math.max(expenseRatio, 0), 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            Outflow vs Total Inflow
          </div>
        </div>

        {/* Daily Burn Rate Card */}
        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>DAILY BURN RATE</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">
            ₹{dailyBurnRate.toFixed(0)}<span className="text-xs text-slate-400 font-normal">/day</span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            Avg expenditure pace this month
          </div>
        </div>

        {/* Budget Target Utilization Card */}
        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>BUDGET UTILIZATION</span>
            <Award className="w-4 h-4 text-pink-300" />
          </div>
          <div className={`text-2xl font-extrabold ${budgetUtilization > 100 ? 'text-rose-400' : 'text-pink-300'}`}>
            {budgetUtilization.toFixed(1)}%
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${budgetUtilization > 100 ? 'bg-rose-500' : 'bg-pink-500'}`}
              style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            ₹{currentMonthExp.toLocaleString('en-IN')} of ₹{monthlyBudget.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Top Row: Category-wise Pie Chart + Income vs Expense Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Expense Pie Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-pink-400" />
              <h3 className="text-sm font-serif font-bold text-white">Category-wise Expense Breakdown</h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Expense Allocation</span>
          </div>

          {categoryPieData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => `₹${val.toFixed(2)}`}
                    contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px', color: '#f8fafc', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)', backdropFilter: 'blur(16px)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400 font-medium">
              No expense category data recorded yet.
            </div>
          )}
        </div>

        {/* Income vs Expense Graph */}
        <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-pink-400" />
              <h3 className="text-sm font-serif font-bold text-white">Income vs Expense vs Savings</h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Macro Comparison</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeVsExpenseData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  formatter={(val: number) => `₹${val.toFixed(2)}`}
                  contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px', color: '#f8fafc', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)', backdropFilter: 'blur(16px)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Expense" fill="#ec4899" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Savings" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Income Stream Distribution Chart */}
      {incomePieData.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-serif font-bold text-white">Income Stream Breakdown by Source</h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Inflow Sources</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={incomePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {incomePieData.map((_, index) => (
                      <Cell key={`income-cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => `₹${val.toFixed(2)}`}
                    contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px', color: '#f8fafc', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)', backdropFilter: 'blur(16px)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300">Revenue Stream Share</h4>
              {(summary?.incomeBreakdown || []).map((item) => (
                <div key={item.source} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{item.source}</span>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400">₹{item.amount.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 block">{item.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top Spending Categories Ranking List */}
      <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4">
        <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
          <Award className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-serif font-bold text-white">Top Spending Categories Ranking & Intensity</h3>
        </div>

        {summary?.categoryBreakdown && summary.categoryBreakdown.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {summary.categoryBreakdown.map((item, idx) => (
              <div
                key={item.category}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-6 h-6 rounded-lg bg-pink-500/20 text-pink-300 font-bold text-[10px] flex items-center justify-center border border-pink-500/30">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{item.category}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">{item.percentage.toFixed(1)}% of total expenses</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-pink-400">₹{item.amount.toFixed(2)}</span>
                </div>

                {/* Relative progress bar */}
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 text-xs font-medium">
            No category rankings available yet.
          </div>
        )}
      </div>
    </div>
  );
};
