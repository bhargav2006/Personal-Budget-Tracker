import React from 'react';
import { Calendar } from 'lucide-react';

export default function MonthPicker({ selectedMonth, onChange }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-3 bg-card border border-border px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl shadow-sm hover:border-textSecondary/30 transition-colors">
      <Calendar className="text-textSecondary w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
      <div className="flex flex-col min-w-0">
        <label htmlFor="month-select" className="text-[8px] sm:text-[10px] uppercase tracking-wider font-semibold text-textSecondary select-none truncate">
          Active Month
        </label>
        <input
          id="month-select"
          type="month"
          value={selectedMonth}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-textPrimary font-semibold text-xs sm:text-sm focus:outline-none cursor-pointer w-full min-w-[100px] sm:min-w-[120px]"
        />
      </div>
    </div>
  );
}
