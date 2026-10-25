import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { getDB } from './db';
import { getTransactions, getSummary, addTransaction, updateTransaction, deleteTransaction } from './api';
import { initializeTheme, toggleTheme as helperToggleTheme } from './theme';
import MonthPicker from './components/MonthPicker';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import { MetricCards, SpendingAnalytics } from './components/Dashboard';
import ExportButton from './components/ExportButton';
import ThemeToggle from './components/ThemeToggle';
import { Sparkles, BarChart2, Plus, X, LayoutGrid, ListFilter } from 'lucide-react';

export default function App() {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.dataset.theme || 'dark';
    }
    return 'dark';
  });

  // Workspace View Mode: 'overview' (default) | 'ledger' | 'analytics'
  const [workspaceMode, setWorkspaceMode] = useState('overview');

  // Mobile Slide-up Drawer State for Add Transaction
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    const initial = initializeTheme();
    setThemeState(initial);

    const onThemeChange = (e) => {
      setThemeState(e.detail?.theme || 'dark');
    };
    window.addEventListener('themechange', onThemeChange);
    return () => window.removeEventListener('themechange', onThemeChange);
  }, []);

  const handleToggleTheme = () => {
    const next = helperToggleTheme();
    setThemeState(next);
  };

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  });

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    expensesByCategory: []
  });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isDbReady, setIsDbReady] = useState(false);

  // Initialize SQLite DB
  useEffect(() => {
    getDB()
      .then(() => {
        setIsDbReady(true);
      })
      .catch((err) => {
        console.error('Failed to initialize database:', err);
        toast.error('Failed to initialize SQLite database.');
      });
  }, []);

  // Fetch transactions and summary
  const loadData = async () => {
    try {
      const txs = await getTransactions(selectedMonth);
      const sum = await getSummary(selectedMonth);
      setTransactions(txs);
      setSummary(sum);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load transaction data.');
    }
  };

  useEffect(() => {
    if (isDbReady) {
      loadData();
    }
  }, [selectedMonth, isDbReady]);

  // Handle Form Saves
  const handleSaveTransaction = async (data) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, data);
        toast.success('Transaction updated!');
        setEditingTransaction(null);
      } else {
        await addTransaction(data);
        toast.success('Transaction added!');
      }
      loadData();
      setIsMobileDrawerOpen(false);
    } catch (err) {
      console.error('Save failed:', err);
      toast.error(err.message || 'Failed to save transaction');
    }
  };

  // Handle Deletion
  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      toast.success('Transaction deleted!');
      if (editingTransaction && editingTransaction.id === id) {
        setEditingTransaction(null);
      }
      loadData();
    } catch (err) {
      console.error('Deletion failed:', err);
      toast.error('Failed to delete transaction.');
    }
  };

  // Seed Sample Data (Matching the reference mockup figures)
  const handleSeedDemoData = async () => {
    try {
      const demoItems = [
        { type: 'income', category: 'Salary', amount: 85000, date: `${selectedMonth}-01`, description: 'Monthly primary salary' },
        { type: 'income', category: 'Freelance', amount: 24000, date: `${selectedMonth}-05`, description: 'Design engineering consulting' },
        { type: 'expense', category: 'Rent', amount: 28000, date: `${selectedMonth}-02`, description: 'Apartment monthly lease' },
        { type: 'expense', category: 'Food', amount: 14200, date: `${selectedMonth}-07`, description: 'Supermarket & dining' },
        { type: 'expense', category: 'Shopping', amount: 6800, date: `${selectedMonth}-14`, description: 'Office supplies & hardware' },
        { type: 'expense', category: 'Utilities', amount: 4600, date: `${selectedMonth}-10`, description: 'Electricity & fiber broadband' },
        { type: 'expense', category: 'Travel', amount: 3500, date: `${selectedMonth}-18`, description: 'Fuel & public transit pass' },
      ];

      for (const item of demoItems) {
        await addTransaction(item);
      }
      toast.success('Sample budget figures loaded!');
      loadData();
    } catch (err) {
      console.error('Failed to seed demo data:', err);
      toast.error('Could not load sample data.');
    }
  };

  const handleEdit = (tx) => {
    setEditingTransaction(tx);
    // On mobile, open the slide-up drawer for editing
    if (window.innerWidth < 1024) {
      setIsMobileDrawerOpen(true);
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setIsMobileDrawerOpen(false);
  };

  if (!isDbReady) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 select-none relative">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-12 h-12 border-2 border-border border-t-primary rounded-full animate-spin"></div>
          <div className="absolute text-base">🌱</div>
        </div>
        <h2 className="text-xs font-bold text-textPrimary tracking-tight">Initializing SQLite Engine</h2>
        <p className="text-[11px] text-textSecondary mt-1 font-medium">
          Loading WebAssembly SQLite in browser...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col text-textPrimary antialiased selection:bg-primary/20 selection:text-primary">
      {/* Toast Notifications */}
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          duration: 2500,
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-popover)',
            fontSize: '11px',
            fontWeight: 600,
            borderRadius: '8px',
            padding: '8px 12px',
          }
        }} 
      />

      {/* 1. Compact Header (Single Horizontal Line) */}
      <header className="sticky top-0 bg-surface/95 backdrop-blur-md border-b border-border z-40 px-3 sm:px-6 py-2 transition-colors">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-2">
          
          {/* Left: Brand, Title, Version Badge & Subtitle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div 
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
              style={{ borderRadius: '50%' }}
            >
              <img 
                src="/Bhargav_KB_Logo.png" 
                alt="Budget Tracker Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <h1 className="text-xs sm:text-sm font-bold tracking-tight text-textPrimary">
                  Budget Tracker
                </h1>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded border border-border text-textSecondary bg-surface-sunken">
                  Verdant v1.2
                </span>
              </div>
              <p className="text-[10px] text-textSecondary font-medium leading-none mt-0.5 hidden xs:block">
                Private Client-Side SQLite WASM
              </p>
            </div>
          </div>

          {/* Right: Month Selector, CSV Export & Theme Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <MonthPicker selectedMonth={selectedMonth} onChange={setSelectedMonth} />
            <ExportButton selectedMonth={selectedMonth} />
            <ThemeToggle theme={theme} toggleTheme={handleToggleTheme} />

            {transactions.length === 0 && (
              <button
                type="button"
                onClick={handleSeedDemoData}
                className="hidden md:flex items-center gap-1 text-[11px] font-semibold text-textSecondary hover:text-textPrimary bg-surface-sunken hover:bg-surface border border-border px-2.5 py-1 rounded-lg transition-all"
                title="Populate test transactions"
              >
                <Sparkles className="w-3 h-3 text-tertiary" />
                <span>Demo Data</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Single-Screen Workspace Container */}
      <main className="flex-grow max-w-[1600px] w-full mx-auto px-3 sm:px-6 py-3 flex flex-col justify-between">
        
        {/* 2. One-Row Financial Summary (4 Equal Cards) */}
        <MetricCards summary={summary} />

        {/* 3. Main Workspace Grid (~28% Left Column, ~72% Right Column) */}
        <div className="grid grid-cols-1 lg:grid-cols-[28%_1fr] gap-3.5 items-start flex-grow">
          
          {/* Left Column (~28%): Compact Record Transaction Form & SQLite Status */}
          <section className="hidden lg:block">
            <TransactionForm
              onSave={handleSaveTransaction}
              editingTransaction={editingTransaction}
              onCancelEdit={handleCancelEdit}
            />
          </section>

          {/* Right Column (~72%): Workspace Hub with View Switcher */}
          <section className="flex flex-col space-y-3">
            
            {/* Workspace Mode Switcher Bar */}
            <div className="flex items-center justify-between bg-surface border border-border rounded-xl px-3 py-1.5 shadow-card">
              <span className="text-[10px] sm:text-xs font-bold text-textSecondary uppercase tracking-wider">
                WORKSPACE
              </span>
              <div className="flex items-center gap-1 p-0.5 bg-surface-sunken rounded-lg border border-border text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setWorkspaceMode('overview')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                    workspaceMode === 'overview'
                      ? 'bg-surface text-textPrimary shadow-sm border border-border font-bold'
                      : 'text-textSecondary hover:text-textPrimary'
                  }`}
                  title="Overview: Chart & Ledger stacked"
                >
                  <LayoutGrid className="w-3 h-3" />
                  <span>Overview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWorkspaceMode('ledger')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                    workspaceMode === 'ledger'
                      ? 'bg-surface text-textPrimary shadow-sm border border-border font-bold'
                      : 'text-textSecondary hover:text-textPrimary'
                  }`}
                  title="Full Transaction Ledger"
                >
                  <ListFilter className="w-3 h-3" />
                  <span>Ledger ({transactions.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWorkspaceMode('analytics')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                    workspaceMode === 'analytics'
                      ? 'bg-surface text-textPrimary shadow-sm border border-border font-bold'
                      : 'text-textSecondary hover:text-textPrimary'
                  }`}
                  title="Full Category Visualizer"
                >
                  <BarChart2 className="w-3 h-3" />
                  <span>Analytics</span>
                </button>
              </div>
            </div>

            {/* Overview Mode: Spending Breakdown above Transaction Ledger */}
            {workspaceMode === 'overview' && (
              <div className="space-y-3 animate-fade-in">
                <SpendingAnalytics summary={summary} />
                <TransactionList
                  transactions={transactions}
                  onEdit={handleEdit}
                  onDelete={handleDeleteTransaction}
                  editingId={editingTransaction?.id}
                />
              </div>
            )}

            {/* Ledger Only Mode */}
            {workspaceMode === 'ledger' && (
              <div className="animate-fade-in">
                <TransactionList
                  transactions={transactions}
                  onEdit={handleEdit}
                  onDelete={handleDeleteTransaction}
                  editingId={editingTransaction?.id}
                />
              </div>
            )}

            {/* Analytics Only Mode */}
            {workspaceMode === 'analytics' && (
              <div className="animate-fade-in">
                <SpendingAnalytics summary={summary} />
              </div>
            )}

          </section>

        </div>

        {/* 5. Minimal Footer and Status */}
        <footer className="mt-3 pt-2 text-[10px] text-textSubtle border-t border-border flex flex-col sm:flex-row items-center justify-between gap-1 select-none">
          <p>© {new Date().getFullYear()} Personal Budget Tracker · Verdant Signal v1.2.0</p>
          <p className="font-mono">100% Client-Side SQLite · Zero Telemetry</p>
        </footer>

      </main>

      {/* 6. Mobile Floating Action Button (FAB) & Slide-up Drawer */}
      <div className="lg:hidden">
        {/* Floating Add Entry Button */}
        <button
          type="button"
          onClick={() => {
            setEditingTransaction(null);
            setIsMobileDrawerOpen(true);
          }}
          className="fixed bottom-5 right-5 z-40 bg-primary hover:bg-primary-hover active:scale-95 text-white shadow-lg shadow-primary/30 px-4 py-2.5 rounded-full flex items-center gap-1.5 font-bold text-xs transition-all duration-200"
          aria-label="Add New Transaction"
        >
          <Plus className="w-4 h-4" />
          <span>New Entry</span>
        </button>

        {/* Slide-Up Bottom Sheet Drawer */}
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg bg-surface border-t border-border rounded-t-2xl p-4 shadow-popover max-h-[90vh] overflow-y-auto animate-slide-up">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                <h3 className="text-xs font-bold text-textPrimary">
                  {editingTransaction ? 'Edit Transaction' : 'Record Transaction'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    setEditingTransaction(null);
                  }}
                  className="p-1 rounded-md text-textSecondary hover:text-textPrimary bg-surface-sunken"
                  aria-label="Close form drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <TransactionForm
                onSave={handleSaveTransaction}
                editingTransaction={editingTransaction}
                onCancelEdit={handleCancelEdit}
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
