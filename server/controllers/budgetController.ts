import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { getDB, saveDB } from '../config/db.js';

export const getFinancialSummary = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const db = getDB();

    const user = db.users.find((u) => u.id === userId);
    const userExpenses = db.expenses.filter((e) => e.userId === userId);
    const userIncomes = db.incomes.filter((i) => i.userId === userId);

    const totalIncome = userIncomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = userExpenses.reduce((sum, e) => sum + e.amount, 0);
    const remainingBalance = totalIncome - totalExpense;
    const savings = remainingBalance > 0 ? remainingBalance : 0;

    // Current Month Budget analysis
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthStr = String(now.getMonth() + 1).padStart(2, '0');
    const monthPrefix = `${currentYear}-${currentMonthStr}`;

    const currentMonthExpenses = userExpenses.filter((e) => e.date.startsWith(monthPrefix));
    const currentMonthTotalExpense = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    const monthlyBudget = user?.monthlyBudget || 3000;
    const budgetRemaining = monthlyBudget - currentMonthTotalExpense;
    const budgetPercentageUsed = monthlyBudget > 0 ? (currentMonthTotalExpense / monthlyBudget) * 100 : 0;

    let warningLevel: 'NORMAL' | 'WARNING' | 'EXCEEDED' = 'NORMAL';
    let warningMessage = 'Your monthly spending is well within your budget limit.';

    if (budgetPercentageUsed >= 100) {
      warningLevel = 'EXCEEDED';
      warningMessage = `Warning: You have exceeded your monthly budget of ₹${monthlyBudget.toLocaleString('en-IN')}!`;
    } else if (budgetPercentageUsed >= 80) {
      warningLevel = 'WARNING';
      warningMessage = `Caution: You have used ${budgetPercentageUsed.toFixed(1)}% of your ₹${monthlyBudget.toLocaleString('en-IN')} monthly budget.`;
    }

    // Category breakdown
    const categoryTotals: Record<string, number> = {};
    userExpenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    const categoryBreakdown = Object.keys(categoryTotals).map((cat) => ({
      category: cat,
      amount: categoryTotals[cat],
      percentage: totalExpense > 0 ? (categoryTotals[cat] / totalExpense) * 100 : 0,
    }));

    categoryBreakdown.sort((a, b) => b.amount - a.amount);

    // Income breakdown by source
    const sourceTotals: Record<string, number> = {};
    userIncomes.forEach((i) => {
      sourceTotals[i.source] = (sourceTotals[i.source] || 0) + i.amount;
    });

    const incomeBreakdown = Object.keys(sourceTotals).map((src) => ({
      source: src,
      amount: sourceTotals[src],
      percentage: totalIncome > 0 ? (sourceTotals[src] / totalIncome) * 100 : 0,
    }));

    res.json({
      success: true,
      summary: {
        totalIncome,
        totalExpense,
        remainingBalance,
        savings,
        monthlyBudget,
        currentMonthTotalExpense,
        budgetRemaining,
        budgetPercentageUsed: Number(budgetPercentageUsed.toFixed(1)),
        warningLevel,
        warningMessage,
        categoryBreakdown,
        incomeBreakdown,
        recentExpenses: userExpenses.slice(-5).reverse(),
        recentIncomes: userIncomes.slice(-5).reverse(),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to calculate summary.' });
  }
};

export const updateMonthlyBudget = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { monthlyBudget } = req.body;

    const numBudget = Number(monthlyBudget);
    if (isNaN(numBudget) || numBudget < 0) {
      res.status(400).json({ success: false, message: 'Monthly budget must be a non-negative number.' });
      return;
    }

    const db = getDB();
    const user = db.users.find((u) => u.id === userId);

    if (!user) {
      res.status(404).json({ success: false, message: 'User profile not found.' });
      return;
    }

    user.monthlyBudget = numBudget;
    await saveDB();

    res.json({
      success: true,
      message: 'Monthly budget updated successfully.',
      monthlyBudget: user.monthlyBudget,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update monthly budget.' });
  }
};
