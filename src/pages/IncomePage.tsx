import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Income, INCOME_SOURCES, IncomeSourceType } from '../types';
import {
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  DollarSign,
  Briefcase,
  PiggyBank,
  Wallet,
} from 'lucide-react';

interface IncomePageProps {
  onOpenIncomeModal: (income?: Income) => void;
}

export const IncomePage: React.FC<IncomePageProps> = ({ onOpenIncomeModal }) => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('All');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (selectedSource && selectedSource !== 'All') params.append('source', selectedSource);

      const [incRes, sumRes] = await Promise.all([
        api.get(`/incomes?${params.toString()}`),
        api.get('/budget/summary'),
      ]);

      if (incRes.data.success) setIncomes(incRes.data.incomes);
      if (sumRes.data.success) setSummary(sumRes.data.summary);
    } catch (err: any) {
      setError(err.message || 'Failed to load income data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSource]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this income entry?')) return;
    try {
      const res = await api.delete(`/incomes/${id}`);
      if (res.data.success) {
        setIncomes(incomes.filter((i) => i.id !== id));
        fetchData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete income record.');
    }
  };

  const totalFilteredIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-pink-400" />
            <span>Income Management</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Track earnings from Salary, Freelancing, Business, Investments, and Other streams.
          </p>
        </div>

        <button
          onClick={() => onOpenIncomeModal()}
          className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-full transition-all shadow-lg shadow-pink-950/50 border border-pink-400/30 flex items-center justify-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Income</span>
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Income</span>
            <div className="text-xl font-extrabold text-emerald-400 mt-1">₹{summary.totalIncome.toFixed(2)}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Expenses</span>
            <div className="text-xl font-extrabold text-pink-400 mt-1">₹{summary.totalExpense.toFixed(2)}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400">Remaining Balance</span>
            <div className="text-xl font-extrabold text-pink-300 mt-1">₹{summary.remainingBalance.toFixed(2)}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400">Net Savings</span>
            <div className="text-xl font-extrabold text-amber-400 mt-1">₹{summary.savings.toFixed(2)}</div>
          </div>
        </div>
      )}

      {/* Source Filter */}
      <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-pink-400" />
          <span className="text-xs font-bold text-slate-200">Filter by Income Stream:</span>
        </div>
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
        >
          <option value="All" className="bg-slate-900 text-white">All Sources</option>
          {INCOME_SOURCES.map((src) => (
            <option key={src} value={src} className="bg-slate-900 text-white">
              {src}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs font-medium rounded-2xl backdrop-blur-md">
          {error}
        </div>
      )}

      {/* Income Records Table */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h3 className="text-sm font-serif font-bold text-white">Income History ({incomes.length})</h3>
          <span className="text-xs font-extrabold text-pink-300">
            Filtered Total: ₹{totalFilteredIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">Loading income records...</div>
        ) : incomes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 bg-white/5 font-bold">
                  <th className="py-3 px-6 font-bold">Source</th>
                  <th className="py-3 px-4 font-bold">Description</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold text-right">Amount</th>
                  <th className="py-3 px-6 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {incomes.map((inc) => (
                  <tr key={inc.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-6">
                      <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full">
                        {inc.source}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-100">
                      {inc.description || `${inc.source} Payment`}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{inc.date}</td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-400 text-right">
                      +₹{inc.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => onOpenIncomeModal(inc)}
                          title="Edit Income"
                          className="p-1.5 text-slate-400 hover:text-pink-400 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(inc.id)}
                          title="Delete Income"
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            No income entries recorded. Click "+ Add New Income" to log your salary, freelancing, or investments!
          </div>
        )}
      </div>
    </div>
  );
};
