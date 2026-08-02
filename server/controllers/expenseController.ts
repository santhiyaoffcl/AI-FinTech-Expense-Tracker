import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { getDB, saveDB, ExpenseDoc } from '../config/db.js';

export const getExpenses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { search, category, startDate, endDate } = req.query;

    const db = getDB();
    let userExpenses = db.expenses.filter((e) => e.userId === userId);

    // Search filter
    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      userExpenses = userExpenses.filter(
        (e) => e.title.toLowerCase().includes(q) || (e.notes && e.notes.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (category && typeof category === 'string' && category !== 'All') {
      userExpenses = userExpenses.filter((e) => e.category === category);
    }

    // Date filters
    if (startDate && typeof startDate === 'string') {
      userExpenses = userExpenses.filter((e) => e.date >= startDate);
    }
    if (endDate && typeof endDate === 'string') {
      userExpenses = userExpenses.filter((e) => e.date <= endDate);
    }

    // Sort by date descending
    userExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json({ success: true, count: userExpenses.length, expenses: userExpenses });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch expenses.' });
  }
};

export const addExpense = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title, amount, category, date, notes } = req.body;

    if (!title || !amount || !category || !date) {
      res.status(400).json({ success: false, message: 'Title, amount, category, and date are required.' });
      return;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      res.status(400).json({ success: false, message: 'Amount must be a positive number.' });
      return;
    }

    const newExpense: ExpenseDoc = {
      id: 'exp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      userId: userId!,
      title: title.trim(),
      amount: numAmount,
      category,
      date,
      notes: notes ? notes.trim() : '',
      createdAt: new Date().toISOString(),
    };

    const db = getDB();
    db.expenses.push(newExpense);
    await saveDB();

    res.status(201).json({
      success: true,
      message: 'Expense added successfully.',
      expense: newExpense,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to add expense.' });
  }
};

export const updateExpense = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { title, amount, category, date, notes } = req.body;

    const db = getDB();
    const expIndex = db.expenses.findIndex((e) => e.id === id && e.userId === userId);

    if (expIndex === -1) {
      res.status(404).json({ success: false, message: 'Expense record not found.' });
      return;
    }

    const existing = db.expenses[expIndex];
    if (title) existing.title = title.trim();
    if (amount !== undefined) {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        res.status(400).json({ success: false, message: 'Amount must be a positive number.' });
        return;
      }
      existing.amount = numAmount;
    }
    if (category) existing.category = category;
    if (date) existing.date = date;
    if (notes !== undefined) existing.notes = notes.trim();

    await saveDB();

    res.json({
      success: true,
      message: 'Expense updated successfully.',
      expense: existing,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update expense.' });
  }
};

export const deleteExpense = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const db = getDB();
    const expIndex = db.expenses.findIndex((e) => e.id === id && e.userId === userId);

    if (expIndex === -1) {
      res.status(404).json({ success: false, message: 'Expense record not found.' });
      return;
    }

    db.expenses.splice(expIndex, 1);
    await saveDB();

    res.json({ success: true, message: 'Expense deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete expense.' });
  }
};
