import React, { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Pencil, Trash2, AlertCircle, ArrowUpRight, ArrowDownRight, Search, SlidersHorizontal } from 'lucide-react';

export default function TransactionList({ transactions, onEdit, onDelete, editingId }) {
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'expense' | 'income'
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'

  // Handle actual deletion approval
  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      onDelete(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let result = transactions.filter((t) => {
      if (filterType !== 'all' && t.type !== filterType) {
        return false;
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesCategory = t.category.toLowerCase().includes(term);
        const matchesDesc = (t.description || '').toLowerCase().includes(term);
        return matchesCategory || matchesDesc;
      }
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date) || b.id - a.id;
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date) || a.id - b.id;
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [transactions, filterType, searchTerm, sortBy]);

  const incomeCount = transactions.filter(t => t.type === 'income').length;
  const expenseCount = transactions.filter(t => t.type === 'expense').length;

  // Dynamic category emoji mapper
  const getCategoryEmoji = (cat) => {
    switch (cat.toLowerCase()) {
      case 'salary': return '💼';
      case 'freelance': return '💻';
      case 'business': return '🏢';
      case 'investment': return '📊';
      case 'bonus': return '🎁';
      case 'interest': return '🏦';
      case 'food': return '🍔';
      case 'rent': return '🏠';
      case 'shopping': return '🛒';
      case 'utilities': return '⚡';
      case 'travel': return '✈️';
      case 'medical': return '🩺';
      case 'entertainment': return '🎬';
      case 'education': return '📚';
      case 'other income': return '💰';
      case 'other expense': return '📦';
      default: return '🏷️';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-3 sm:p-4 shadow-card flex flex-col">
      
      {/* Header and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5 pb-2 border-b border-border">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full border border-primary/60 bg-primary/20" />
          <h3 className="text-xs sm:text-sm font-bold text-textPrimary tracking-tight">
            Transaction Ledger
          </h3>
          <span className="text-[10px] text-textSecondary font-medium ml-1">
            {transactions.length} entries · latest activity
          </span>
        </div>

        {/* Filter Pills: All | Outflow | Inflow */}
        <div className="flex items-center gap-1 p-0.5 bg-surface-sunken rounded-lg border border-border text-[11px] font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              filterType === 'all'
                ? 'bg-surface text-textPrimary shadow-sm border border-border font-bold'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            All ({transactions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('expense')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              filterType === 'expense'
                ? 'bg-surface text-textPrimary shadow-sm border border-border font-bold'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Outflow ({expenseCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('income')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              filterType === 'income'
                ? 'bg-surface text-textPrimary shadow-sm border border-border font-bold'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Inflow ({incomeCount})
          </button>
        </div>
      </div>

      {/* Compact Search & Sort Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-2.5">
        {/* Search */}
        <div className="sm:col-span-8 relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-textSubtle w-3.5 h-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search category or note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-sunken border border-border rounded-lg pl-7 pr-3 py-1 text-xs text-textPrimary placeholder:text-textSubtle font-medium focus:outline-none focus:border-primary transition-all"
          />
        </div>

        {/* Sort Select */}
        <div className="sm:col-span-4 relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-surface-sunken border border-border rounded-lg px-2.5 py-1 text-xs text-textPrimary font-semibold focus:outline-none focus:border-primary cursor-pointer appearance-none pr-7"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
          <SlidersHorizontal className="w-3 h-3 text-textSubtle absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Two-Column Grid of Transaction Cards (Matching Mockup) */}
      <div className="overflow-y-auto pr-0.5 max-h-[220px] 2xl:max-h-[280px]">
        {filteredAndSortedTransactions.length === 0 ? (
          <div className="h-28 flex flex-col items-center justify-center text-center p-4 bg-surface-sunken/40 rounded-lg border border-dashed border-border select-none">
            <p className="text-xs font-semibold text-textPrimary">No transactions found</p>
            <p className="text-[10px] text-textSecondary mt-0.5">
              {searchTerm || filterType !== 'all' ? 'Try adjusting search or filter' : 'Record an entry to populate the ledger'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filteredAndSortedTransactions.map((t) => {
              const formattedDate = format(parseISO(t.date), 'dd MMM yyyy');
              const isEditing = editingId === t.id;
              const isIncome = t.type === 'income';

              return (
                <div
                  key={t.id}
                  className={`group flex items-center justify-between p-2 rounded-lg border transition-all duration-150 ${
                    isEditing
                      ? 'border-primary bg-primary-container/20 shadow-sm'
                      : 'border-border bg-surface-sunken/30 hover:border-control-border hover:bg-surface-sunken/70'
                  }`}
                >
                  {/* Left side details */}
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm select-none shrink-0">{getCategoryEmoji(t.category)}</span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-textPrimary truncate leading-tight">
                        {t.category}
                      </h4>
                      {t.description && (
                        <p className="text-[10px] text-textSecondary truncate max-w-[130px] sm:max-w-[160px] leading-tight">
                          {t.description}
                        </p>
                      )}
                      <p className="text-[9px] font-medium text-textSubtle leading-tight mt-0.5">
                        {formattedDate}
                      </p>
                    </div>
                  </div>

                  {/* Right side amount and actions */}
                  <div className="flex items-center gap-2 shrink-0 pl-2">
                    <span className="text-xs font-bold font-mono tracking-tight text-textPrimary">
                      <span className={isIncome ? 'text-success font-medium mr-0.5' : 'text-error font-medium mr-0.5'}>
                        {isIncome ? '+' : '-'}
                      </span>
                      ₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>

                    {/* Quick Edit/Delete on Hover */}
                    <div className="flex items-center gap-0.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(t)}
                        title="Edit Entry"
                        aria-label="Edit Entry"
                        className="p-1 rounded text-textSecondary hover:text-textPrimary hover:bg-surface transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(t.id)}
                        title="Delete Entry"
                        aria-label="Delete Entry"
                        className="p-1 rounded text-textSecondary hover:text-error hover:bg-error-bg transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-overlay backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-surface border border-border w-full max-w-sm rounded-xl shadow-popover p-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="bg-error-bg text-error p-2 rounded-lg border border-error/20">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-textPrimary">Delete Transaction?</h4>
                <p className="text-[10px] text-textSecondary">This record will be permanently removed.</p>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="bg-surface-sunken hover:bg-surface text-textSecondary hover:text-textPrimary border border-border px-3 py-1 rounded-md text-xs font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="bg-error hover:bg-error/90 text-white px-3 py-1 rounded-md text-xs font-bold shadow-sm transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
