import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Expense, EXPENSE_CATEGORIES, CategoryType } from '../types';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Receipt,
  X,
  RefreshCw,
} from 'lucide-react';

interface ExpensesPageProps {
  onOpenExpenseModal: (expense?: Expense) => void;
}

export const ExpensesPage: React.FC<ExpensesPageProps> = ({ onOpenExpenseModal }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search and Filter states
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await api.get(`/expenses?${params.toString()}`);
      if (res.data.success) {
        setExpenses(res.data.expenses);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load expense history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExpenses();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, startDate, endDate]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await api.delete(`/expenses/${id}`);
      if (res.data.success) {
        setExpenses(expenses.filter((e) => e.id !== id));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete expense.');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setStartDate('');
    setEndDate('');
  };

  const totalFilteredAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight flex items-center space-x-2">
            <Receipt className="w-6 h-6 text-pink-400" />
            <span>Expense Management</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Track, filter, search, and manage all your expense records.
          </p>
        </div>

        <button
          onClick={() => onOpenExpenseModal()}
          className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-full transition-all shadow-lg shadow-pink-950/50 border border-pink-400/30 flex items-center justify-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Expense</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
            >
              <option value="All" className="bg-slate-900 text-white">All Categories</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              placeholder="Start Date"
            />
          </div>

          {/* End Date */}
          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              placeholder="End Date"
            />
          </div>
        </div>

        {/* Clear Filter Bar */}
        {(search || selectedCategory !== 'All' || startDate || endDate) && (
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-medium">
            <span className="text-slate-400">
              Filtered Total: <strong className="text-pink-400">₹{totalFilteredAmount.toFixed(2)}</strong> ({expenses.length} records)
            </span>
            <button
              onClick={clearFilters}
              className="text-slate-400 hover:text-white flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs font-medium rounded-2xl backdrop-blur-md">
          {error}
        </div>
      )}

      {/* Expenses History Table */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h3 className="text-sm font-serif font-bold text-white">Expense Records ({expenses.length})</h3>
          <span className="text-xs font-extrabold text-pink-300">
            Total: ₹{totalFilteredAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">Loading expenses...</div>
        ) : expenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 bg-white/5 font-bold">
                  <th className="py-3 px-6 font-bold">Title</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold">Notes</th>
                  <th className="py-3 px-4 font-bold text-right">Amount</th>
                  <th className="py-3 px-6 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-100">{exp.title}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 text-[10px] font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30 rounded-full">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{exp.date}</td>
                    <td className="py-3.5 px-4 text-slate-400 truncate max-w-[200px]">
                      {exp.notes || '-'}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-pink-400 text-right">
                      -₹{exp.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => onOpenExpenseModal(exp)}
                          title="Edit Expense"
                          className="p-1.5 text-slate-400 hover:text-pink-400 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id, exp.title)}
                          title="Delete Expense"
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
            No expenses found matching your criteria. Click "+ Add New Expense" to create one!
          </div>
        )}
      </div>
    </div>
  );
};
