import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { DashboardPage } from './pages/DashboardPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { IncomePage } from './pages/IncomePage';
import { BudgetPage } from './pages/BudgetPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ExpenseModal } from './components/ExpenseModal';
import { IncomeModal } from './components/IncomeModal';
import { Expense, Income, CategoryType, IncomeSourceType } from './types';
import api from './services/api';

const AppContent: React.FC = () => {
  const { user, token, loading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modal states
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3 text-indigo-400">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-300">Initializing Ledger Platform...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return authView === 'login' ? (
      <LoginPage onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <RegisterPage onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  // Expense Modal Handlers
  const handleOpenExpenseModal = (expense?: Expense) => {
    setEditingExpense(expense || null);
    setIsExpenseModalOpen(true);
  };

  const handleExpenseSubmit = async (data: {
    title: string;
    amount: number;
    category: CategoryType;
    date: string;
    notes?: string;
  }) => {
    if (editingExpense) {
      await api.put(`/expenses/${editingExpense.id}`, data);
    } else {
      await api.post('/expenses', data);
    }
    if (activeTab === 'dashboard' || activeTab === 'expenses') {
      setActiveTab(activeTab);
    }
  };

  // Income Modal Handlers
  const handleOpenIncomeModal = (income?: Income) => {
    setEditingIncome(income || null);
    setIsIncomeModalOpen(true);
  };

  const handleIncomeSubmit = async (data: {
    source: IncomeSourceType;
    amount: number;
    date: string;
    description?: string;
  }) => {
    if (editingIncome) {
      await api.put(`/incomes/${editingIncome.id}`, data);
    } else {
      await api.post('/incomes', data);
    }
    if (activeTab === 'dashboard' || activeTab === 'income') {
      setActiveTab(activeTab);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0914] text-slate-100 flex flex-col font-sans relative overflow-x-hidden antialiased selection:bg-pink-500 selection:text-white">
      {/* Warm Twilight Sunset Mesh Ambient Lighting Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Top-center warm sunset glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-rose-600/20 via-pink-600/15 to-transparent blur-[120px] rounded-full" />
        {/* Bottom-right ambient violet glow */}
        <div className="absolute -bottom-20 right-0 w-[600px] h-[500px] bg-gradient-to-t from-purple-800/20 via-pink-900/10 to-transparent blur-[100px] rounded-full" />
        {/* Subtle mesh texture overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02),transparent)]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          onOpenExpenseModal={() => handleOpenExpenseModal()}
          onOpenIncomeModal={() => handleOpenIncomeModal()}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
          {/* Desktop Sidebar / Mobile Menu */}
          <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block shrink-0`}>
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenExpenseModal={() => handleOpenExpenseModal()}
              onOpenIncomeModal={() => handleOpenIncomeModal()}
              closeMobileMenu={() => setMobileMenuOpen(false)}
            />
          </div>

          {/* Main Content Viewport */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
            {activeTab === 'dashboard' && (
              <DashboardPage
                key={Date.now()}
                onOpenExpenseModal={() => handleOpenExpenseModal()}
                onOpenIncomeModal={() => handleOpenIncomeModal()}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'expenses' && (
              <ExpensesPage
                key={Date.now()}
                onOpenExpenseModal={(exp) => handleOpenExpenseModal(exp)}
              />
            )}

            {activeTab === 'income' && (
              <IncomePage
                key={Date.now()}
                onOpenIncomeModal={(inc) => handleOpenIncomeModal(inc)}
              />
            )}

            {activeTab === 'budget' && <BudgetPage key={Date.now()} />}

            {activeTab === 'analytics' && <AnalyticsPage key={Date.now()} />}

            {activeTab === 'ai-insights' && <AIInsightsPage key={Date.now()} />}

            {activeTab === 'profile' && <ProfilePage key={Date.now()} />}
          </main>
        </div>

        {/* Professional Website Footer */}
        <Footer
          setActiveTab={setActiveTab}
          onOpenExpenseModal={() => handleOpenExpenseModal()}
          onOpenIncomeModal={() => handleOpenIncomeModal()}
        />

        {/* Global Modals */}
        <ExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => {
            setIsExpenseModalOpen(false);
            setEditingExpense(null);
          }}
          onSubmit={handleExpenseSubmit}
          initialData={editingExpense}
        />

        <IncomeModal
          isOpen={isIncomeModalOpen}
          onClose={() => {
            setIsIncomeModalOpen(false);
            setEditingIncome(null);
          }}
          onSubmit={handleIncomeSubmit}
          initialData={editingIncome}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
