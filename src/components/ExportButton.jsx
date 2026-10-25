import React, { useState } from 'react';
import { Download, Check } from 'lucide-react';
import { exportTransactions } from '../api';
import toast from 'react-hot-toast';

export default function ExportButton({ selectedMonth }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const csvContent = await exportTransactions(selectedMonth);
      
      const rows = csvContent.split('\n');
      if (rows.length <= 1) {
        toast.error('No transactions available to export for this month.');
        setIsExporting(false);
        return;
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `budget_transactions_${selectedMonth || 'all'}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('CSV exported successfully!');
    } catch (error) {
      console.error('Failed to export CSV:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setTimeout(() => setIsExporting(false), 600);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center justify-center gap-1.5 bg-surface hover:bg-surface-sunken text-textPrimary hover:text-primary border border-border px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all duration-150 shrink-0 active:scale-95 disabled:opacity-50"
      title="Export month data to CSV"
      aria-label="Export month data to CSV"
    >
      {isExporting ? (
        <Check className="w-3.5 h-3.5 text-success shrink-0" />
      ) : (
        <Download className="w-3.5 h-3.5 text-textSecondary group-hover:text-primary shrink-0 transition-colors" />
      )}
      <span>Export CSV</span>
    </button>
  );
}
