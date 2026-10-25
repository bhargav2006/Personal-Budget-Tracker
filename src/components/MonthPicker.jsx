import React from 'react';
import { Clock, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { format, parse, addMonths, subMonths } from 'date-fns';

export default function MonthPicker({ selectedMonth, onChange }) {
  const currentDate = parse(selectedMonth, 'yyyy-MM', new Date());
  const formattedDisplay = format(currentDate, 'MMM yyyy');

  const todayStr = format(new Date(), 'yyyy-MM');
  const isCurrentMonth = selectedMonth === todayStr;

  const handlePrevMonth = () => {
    const prev = subMonths(currentDate, 1);
    onChange(format(prev, 'yyyy-MM'));
  };

  const handleNextMonth = () => {
    const next = addMonths(currentDate, 1);
    onChange(format(next, 'yyyy-MM'));
  };

  const handleResetCurrent = () => {
    onChange(todayStr);
  };

  return (
    <div className="flex items-center bg-surface border border-border rounded-lg p-0.5 shadow-sm text-xs">
      {/* Prev Month */}
      <button
        type="button"
        onClick={handlePrevMonth}
        className="p-1 sm:p-1.5 rounded text-textSecondary hover:text-textPrimary hover:bg-surface-sunken transition-colors"
        title="Previous Month"
        aria-label="Previous month"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {/* Month Label & Native Picker */}
      <label
        htmlFor="month-select"
        className="relative flex items-center gap-1.5 px-2 py-1 rounded hover:bg-surface-sunken cursor-pointer transition-colors group select-none"
      >
        <Clock className="w-3.5 h-3.5 text-textSecondary group-hover:text-primary transition-colors shrink-0" />
        <span className="text-xs font-semibold text-textPrimary tracking-tight whitespace-nowrap">
          {formattedDisplay}
        </span>
        <input
          id="month-select"
          type="month"
          value={selectedMonth}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
      </label>

      {/* Next Month */}
      <button
        type="button"
        onClick={handleNextMonth}
        className="p-1 sm:p-1.5 rounded text-textSecondary hover:text-textPrimary hover:bg-surface-sunken transition-colors"
        title="Next Month"
        aria-label="Next month"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      {/* Jump to Today */}
      {!isCurrentMonth && (
        <button
          type="button"
          onClick={handleResetCurrent}
          className="hidden xl:flex items-center gap-0.5 text-[10px] font-semibold text-primary bg-primary-container px-1.5 py-0.5 rounded transition-colors ml-0.5 mr-0.5"
          title="Jump to current month"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span>Today</span>
        </button>
      )}
    </div>
  );
}
