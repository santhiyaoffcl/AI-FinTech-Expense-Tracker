export interface User {
  id: string;
  name: string;
  email: string;
  monthlyBudget: number;
}

export type CategoryType =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Medical'
  | 'Education'
  | 'Bills'
  | 'Entertainment'
  | 'Investment'
  | 'Others';

export const EXPENSE_CATEGORIES: CategoryType[] = [
  'Food',
  'Transport',
  'Shopping',
  'Medical',
  'Education',
  'Bills',
  'Entertainment',
  'Investment',
  'Others',
];

export type IncomeSourceType = 'Salary' | 'Freelancing' | 'Business' | 'Investment' | 'Other';

export const INCOME_SOURCES: IncomeSourceType[] = [
  'Salary',
  'Freelancing',
  'Business',
  'Investment',
  'Other',
];

export interface Expense {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: CategoryType;
  date: string; // YYYY-MM-DD
  notes?: string;
  createdAt?: string;
}

export interface Income {
  id: string;
  userId: string;
  source: IncomeSourceType;
  amount: number;
  date: string; // YYYY-MM-DD
  description?: string;
  createdAt?: string;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface IncomeBreakdown {
  source: string;
  amount: number;
  percentage: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  remainingBalance: number;
  savings: number;
  monthlyBudget: number;
  currentMonthTotalExpense: number;
  budgetRemaining: number;
  budgetPercentageUsed: number;
  warningLevel: 'NORMAL' | 'WARNING' | 'EXCEEDED';
  warningMessage: string;
  categoryBreakdown: CategoryBreakdown[];
  incomeBreakdown: IncomeBreakdown[];
  recentExpenses: Expense[];
  recentIncomes: Income[];
}

export interface UnnecessaryExpenseItem {
  title: string;
  amount: number;
  category: string;
  reason: string;
}

export interface AIInsightsData {
  spendingAnalysis: string;
  unnecessaryExpenses: UnnecessaryExpenseItem[];
  potentialMonthlySavings: number;
  unusualSpendingAlerts: string[];
  financialAdvice: string[];
}
