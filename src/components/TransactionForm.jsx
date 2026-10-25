import React, { useState, useEffect } from 'react';
import { PlusCircle, Check, X, ArrowUpRight, ArrowDownRight, Tag, Calendar, FileText, IndianRupee, Database } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, subDays } from 'date-fns';

const INCOME_CATEGORIES = [
  { label: 'Salary', icon: '💼' },
  { label: 'Freelance', icon: '💻' },
  { label: 'Business', icon: '🏢' },
  { label: 'Investment', icon: '📊' },
  { label: 'Bonus', icon: '🎁' },
  { label: 'Interest', icon: '🏦' },
  { label: 'Other Income', icon: '💰' }
];

const EXPENSE_CATEGORIES = [
  { label: 'Food', icon: '🍔' },
  { label: 'Rent', icon: '🏠' },
  { label: 'Shopping', icon: '🛒' },
  { label: 'Utilities', icon: '⚡' },
  { label: 'Travel', icon: '✈️' },
  { label: 'Medical', icon: '🩺' },
  { label: 'Entertainment', icon: '🎬' },
  { label: 'Education', icon: '📚' },
  { label: 'Other Expense', icon: '📦' }
];

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

export default function TransactionForm({ onSave, editingTransaction, onCancelEdit }) {
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [description, setDescription] = useState('');

  // Set form values if editingTransaction changes
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      const isIncome = editingTransaction.type === 'income';
      const catList = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
      const commonNames = catList.slice(0, -1).map(c => c.label);
      const otherLabel = isIncome ? 'Other Income' : 'Other Expense';
      
      const isCommon = commonNames.includes(editingTransaction.category);
      if (isCommon) {
        setCategory(editingTransaction.category);
        setIsOtherSelected(false);
        setCustomCategory('');
      } else {
        setCategory(otherLabel);
        setIsOtherSelected(true);
        setCustomCategory(editingTransaction.category);
      }
      setAmount(editingTransaction.amount.toString());
      setDate(editingTransaction.date);
      setDescription(editingTransaction.description || '');
    } else {
      resetForm();
    }
  }, [editingTransaction]);

  const resetForm = () => {
    setType('expense');
    setCategory('');
    setCustomCategory('');
    setIsOtherSelected(false);
    setAmount('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setDescription('');
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory('');
    setCustomCategory('');
    setIsOtherSelected(false);
  };

  const handleQuickAmount = (val) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalCategory = isOtherSelected ? customCategory.trim() : category.trim();

    if (!finalCategory) {
      toast.error('Please choose or enter a category');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Amount must be a positive number greater than zero');
      return;
    }
    if (!date) {
      toast.error('Please select a valid date');
      return;
    }

    const payload = {
      type,
      category: finalCategory,
      amount: numAmount,
      date,
      description: description.trim()
    };

    onSave(payload);
    if (!editingTransaction) {
      resetForm();
    }
  };

  const activeCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const isEditing = Boolean(editingTransaction);

  return (
    <div className="space-y-3">
      {/* Main Form Card */}
      <div className={`bg-surface border rounded-xl p-3.5 sm:p-4 shadow-card transition-all duration-200 ${
        isEditing ? 'border-primary ring-1 ring-primary/20' : 'border-border'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full border border-primary/60 bg-primary/20" />
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-textPrimary tracking-tight">
                {isEditing ? 'Edit Transaction' : 'Record Transaction'}
              </h3>
              <p className="text-[10px] text-textSecondary font-medium">
                Add income or expense in a few seconds
              </p>
            </div>
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="text-[10px] font-semibold text-textSecondary hover:text-textPrimary bg-surface-sunken px-2 py-0.5 rounded border border-border transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          {/* 1. Entry Type Toggle */}
          <div>
            <label className="block text-[10px] font-bold text-textSecondary uppercase tracking-wider mb-1">
              Entry Type
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-0.5 bg-surface-sunken rounded-lg border border-border">
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  type === 'income'
                    ? 'bg-surface text-textPrimary shadow-sm border border-border font-bold'
                    : 'text-textSecondary hover:text-textPrimary'
                }`}
              >
                <ArrowUpRight className={`w-3.5 h-3.5 ${type === 'income' ? 'text-success' : 'text-textSecondary'}`} />
                <span>Income</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  type === 'expense'
                    ? 'bg-surface text-textPrimary shadow-sm border border-border font-bold'
                    : 'text-textSecondary hover:text-textPrimary'
                }`}
              >
                <ArrowDownRight className={`w-3.5 h-3.5 ${type === 'expense' ? 'text-error' : 'text-textSecondary'}`} />
                <span>Expense</span>
              </button>
            </div>
          </div>

          {/* 2. Amount Input & Preset Chips */}
          <div>
            <label htmlFor="amount-input" className="block text-[10px] font-bold text-textSecondary uppercase tracking-wider mb-1">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary font-bold text-xs">
                ₹
              </span>
              <input
                id="amount-input"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-surface-sunken border border-border rounded-lg pl-7 pr-3 py-1.5 text-xs sm:text-sm text-textPrimary font-bold font-mono focus:outline-none focus:border-primary transition-all placeholder:text-textSubtle"
                required
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="grid grid-cols-4 gap-1 mt-1.5">
              {QUICK_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAmount(val)}
                  className="text-[10px] font-semibold text-textSecondary hover:text-textPrimary bg-surface-sunken hover:bg-surface border border-border py-0.5 rounded transition-colors text-center"
                >
                  +₹{val}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Category Select */}
          <div>
            <label htmlFor="category-select" className="block text-[10px] font-bold text-textSecondary uppercase tracking-wider mb-1">
              Category
            </label>
            <div className="relative">
              <select
                id="category-select"
                value={category}
                onChange={(e) => {
                  const val = e.target.value;
                  setCategory(val);
                  const otherValue = type === 'income' ? 'Other Income' : 'Other Expense';
                  if (val === otherValue) {
                    setIsOtherSelected(true);
                  } else {
                    setIsOtherSelected(false);
                    setCustomCategory('');
                  }
                }}
                className="w-full bg-surface-sunken border border-border rounded-lg px-2.5 py-1.5 pr-8 text-xs text-textPrimary font-semibold focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                required
              >
                <option value="" disabled>Select category</option>
                {activeCategories.map((cat) => (
                  <option key={cat.label} value={cat.label}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-textSecondary">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          {/* Custom Category if Other */}
          {isOtherSelected && (
            <div className="animate-fade-in">
              <input
                id="custom-category"
                type="text"
                placeholder="Specify category..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full bg-surface-sunken border border-border rounded-lg px-2.5 py-1 text-xs text-textPrimary placeholder:text-textSubtle font-medium focus:outline-none focus:border-primary transition-all"
                required
              />
            </div>
          )}

          {/* 4. Date */}
          <div>
            <label htmlFor="date-input" className="block text-[10px] font-bold text-textSecondary uppercase tracking-wider mb-1">
              Date
            </label>
            <input
              id="date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-surface-sunken border border-border rounded-lg px-2.5 py-1.5 text-xs text-textPrimary font-medium focus:outline-none focus:border-primary transition-all cursor-pointer"
              required
            />
          </div>

          {/* 5. Note (Optional) */}
          <div>
            <label htmlFor="desc-input" className="block text-[10px] font-bold text-textSecondary uppercase tracking-wider mb-1">
              Note (Optional)
            </label>
            <input
              id="desc-input"
              type="text"
              placeholder="e.g. Grocery store, client retainer"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface-sunken border border-border rounded-lg px-2.5 py-1.5 text-xs text-textPrimary placeholder:text-textSubtle font-medium focus:outline-none focus:border-primary transition-all"
            />
          </div>

          {/* 6. Save Button */}
          <div className="pt-1">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover active:scale-[0.99] text-white py-2 px-3 rounded-lg text-xs font-bold shadow-primary transition-all duration-150"
            >
              {isEditing ? <Check className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
              <span>{isEditing ? 'Update Transaction' : 'Save Transaction'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SQLite Status Card Directly Under Form (Matching Mockup) */}
      <div className="bg-surface border border-border rounded-xl p-3 text-[11px] text-textSecondary flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-success animate-pulse shrink-0" />
        <div>
          <span className="font-bold text-textPrimary block text-xs">SQLite Active</span>
          <span className="text-[10px] text-textSecondary">Encrypted local database · saved in browser</span>
        </div>
      </div>
    </div>
  );
}
