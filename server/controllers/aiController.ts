import { Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { getDB } from '../config/db.js';

export const getSmartInsights = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const db = getDB();

    const user = db.users.find((u) => u.id === userId);
    const userExpenses = db.expenses.filter((e) => e.userId === userId);
    const userIncomes = db.incomes.filter((i) => i.userId === userId);

    if (userExpenses.length === 0) {
      res.json({
        success: true,
        insights: {
          spendingAnalysis: 'No expense records found yet. Start adding expenses to receive AI insights!',
          unnecessaryExpenses: [],
          potentialMonthlySavings: 0,
          unusualSpendingAlerts: [],
          financialAdvice: [
            'Add your recurring daily expenses to track your spending habits.',
            'Set up a monthly budget target in your profile settings.',
          ],
        },
      });
      return;
    }

    const totalIncome = userIncomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = userExpenses.reduce((sum, e) => sum + e.amount, 0);
    const monthlyBudget = user?.monthlyBudget || 3000;

    const expenseSummary = userExpenses.map((e) => ({
      title: e.title,
      amount: e.amount,
      category: e.category,
      date: e.date,
      notes: e.notes || '',
    }));

    // Helper for Rule-Based / Deterministic Fallback Analysis
    const generateFallbackInsights = () => {
      const categoryTotals: Record<string, number> = {};
      expenseSummary.forEach((e) => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
      });

      const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
      const unnecessary = userExpenses.filter(
        (e) => (e.category === 'Entertainment' || e.category === 'Shopping') && e.amount > 50
      );

      const potentialSavings = unnecessary.reduce((s, e) => s + e.amount * 0.4, 0);

      return {
        spendingAnalysis: `Your total spending is ₹${totalExpense.toFixed(2)}. Your largest expenditure category is ${topCategory ? topCategory[0] : 'General'} with ₹${topCategory ? topCategory[1].toFixed(2) : '0'}.`,
        unnecessaryExpenses: unnecessary.map((e) => ({
          title: e.title,
          amount: e.amount,
          category: e.category,
          reason: `Discretionary ${e.category.toLowerCase()} spending that could be reduced or optimized.`,
        })),
        potentialMonthlySavings: Math.round(potentialSavings || totalExpense * 0.15),
        unusualSpendingAlerts: userExpenses
          .filter((e) => e.amount > 150)
          .map((e) => `High transaction alert: ₹${e.amount} spent on "${e.title}" (${e.category}) on ${e.date}.`),
        financialAdvice: [
          `Consider capping non-essential ${topCategory ? topCategory[0] : 'Shopping'} expenses to boost savings.`,
          `Build an emergency fund covering 3-6 months of essential living costs (₹${(totalExpense * 3).toFixed(0)}).`,
          `Allocate 20% of income (₹${(totalIncome * 0.2).toFixed(0)}) directly to high-yield savings or index investments.`,
        ],
      };
    };

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const prompt = `
You are an expert FinTech AI Financial Advisor analyzing a user's income and expense data. All currency figures are in Indian Rupees (₹ / INR).

User Profile & Totals:
- User Name: ${user?.name || 'User'}
- Total Monthly Income: ₹${totalIncome}
- Total Expenses: ₹${totalExpense}
- Monthly Budget Limit: ₹${monthlyBudget}

Expense Data JSON:
${JSON.stringify(expenseSummary, null, 2)}

Provide a comprehensive smart financial insight analysis strictly as JSON matching this format:
{
  "spendingAnalysis": "3-4 sentence evaluation of spending behavior in Rupees (₹), top categories, and budget alignment.",
  "unnecessaryExpenses": [
    {
      "title": "Expense Title",
      "amount": 100,
      "category": "Shopping",
      "reason": "Why this appears non-essential or overpriced"
    }
  ],
  "potentialMonthlySavings": 250,
  "unusualSpendingAlerts": [
    "Alert message highlighting spike or unusual high value transaction"
  ],
  "financialAdvice": [
    "Personalized, actionable financial tip 1",
    "Personalized, actionable financial tip 2",
    "Personalized, actionable financial tip 3"
  ]
}
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                spendingAnalysis: { type: Type.STRING },
                unnecessaryExpenses: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      amount: { type: Type.NUMBER },
                      category: { type: Type.STRING },
                      reason: { type: Type.STRING },
                    },
                    required: ['title', 'amount', 'category', 'reason'],
                  },
                },
                potentialMonthlySavings: { type: Type.NUMBER },
                unusualSpendingAlerts: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                financialAdvice: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                'spendingAnalysis',
                'unnecessaryExpenses',
                'potentialMonthlySavings',
                'unusualSpendingAlerts',
                'financialAdvice',
              ],
            },
          },
        });

        const rawText = response.text || '';
        const cleanText = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
        const parsed = JSON.parse(cleanText);

        if (parsed && typeof parsed === 'object') {
          res.json({
            success: true,
            insights: parsed,
          });
          return;
        }
      } catch (geminiErr: any) {
        console.warn('Gemini API execution error, switching to rule-based analysis engine:', geminiErr?.message || geminiErr);
      }
    }

    // Return fallback rule-based insights if GEMINI_API_KEY is unset or API call failed
    res.json({
      success: true,
      insights: generateFallbackInsights(),
    });
  } catch (err: any) {
    console.error('Fatal Smart Insights Controller Error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to generate AI financial insights.',
    });
  }
};

