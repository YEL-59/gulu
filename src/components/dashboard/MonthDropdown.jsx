'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getAvailableMonths } from '@/lib/data/monthlyData';

const MonthDropdown = ({ selectedMonth, onMonthChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const months = getAvailableMonths();

  const handleMonthSelect = (month) => {
    onMonthChange(month);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {selectedMonth}
        <ChevronDown 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 z-20 w-40 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="py-1 max-h-60 overflow-y-auto">
              {months.map((month) => (
                <button
                  key={month}
                  onClick={() => handleMonthSelect(month)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 ${
                    selectedMonth === month 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-700'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthDropdown;