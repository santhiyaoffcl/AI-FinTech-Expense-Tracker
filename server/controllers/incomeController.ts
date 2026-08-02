import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { getDB, saveDB, IncomeDoc } from '../config/db.js';

export const getIncomes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { source, startDate, endDate } = req.query;

    const db = getDB();
    let userIncomes = db.incomes.filter((i) => i.userId === userId);

    if (source && typeof source === 'string' && source !== 'All') {
      userIncomes = userIncomes.filter((i) => i.source === source);
    }

    if (startDate && typeof startDate === 'string') {
      userIncomes = userIncomes.filter((i) => i.date >= startDate);
    }
    if (endDate && typeof endDate === 'string') {
      userIncomes = userIncomes.filter((i) => i.date <= endDate);
    }

    userIncomes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json({ success: true, count: userIncomes.length, incomes: userIncomes });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch incomes.' });
  }
};

export const addIncome = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { source, amount, date, description } = req.body;

    const allowedSources = ['Salary', 'Freelancing', 'Business', 'Investment', 'Other'];
    if (!source || !allowedSources.includes(source)) {
      res.status(400).json({
        success: false,
        message: 'Invalid income source. Must be Salary, Freelancing, Business, Investment, or Other.',
      });
      return;
    }

    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      res.status(400).json({ success: false, message: 'Amount must be a positive number.' });
      return;
    }

    if (!date) {
      res.status(400).json({ success: false, message: 'Date is required.' });
      return;
    }

    const newIncome: IncomeDoc = {
      id: 'inc-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      userId: userId!,
      source,
      amount: numAmount,
      date,
      description: description ? description.trim() : '',
      createdAt: new Date().toISOString(),
    };

    const db = getDB();
    db.incomes.push(newIncome);
    await saveDB();

    res.status(201).json({
      success: true,
      message: 'Income added successfully.',
      income: newIncome,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to add income.' });
  }
};

export const updateIncome = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { source, amount, date, description } = req.body;

    const db = getDB();
    const incIndex = db.incomes.findIndex((i) => i.id === id && i.userId === userId);

    if (incIndex === -1) {
      res.status(404).json({ success: false, message: 'Income record not found.' });
      return;
    }

    const existing = db.incomes[incIndex];
    if (source) existing.source = source;
    if (amount !== undefined) {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        res.status(400).json({ success: false, message: 'Amount must be a positive number.' });
        return;
      }
      existing.amount = numAmount;
    }
    if (date) existing.date = date;
    if (description !== undefined) existing.description = description.trim();

    await saveDB();

    res.json({
      success: true,
      message: 'Income updated successfully.',
      income: existing,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update income.' });
  }
};

export const deleteIncome = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const db = getDB();
    const incIndex = db.incomes.findIndex((i) => i.id === id && i.userId === userId);

    if (incIndex === -1) {
      res.status(404).json({ success: false, message: 'Income record not found.' });
      return;
    }

    db.incomes.splice(incIndex, 1);
    await saveDB();

    res.json({ success: true, message: 'Income deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete income.' });
  }
};
