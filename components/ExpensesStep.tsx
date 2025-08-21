

import React, { useState } from 'react';
import { ExpenseProfile, UserProfile } from '../types';
import { EXPENSE_CATEGORY_GROUPS } from '../constants';
import { InfoIcon } from './icons';

interface ExpensesStepProps {
  expenses: ExpenseProfile;
  onUpdate: <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

const Tooltip: React.FC<{ text: string, children: React.ReactNode }> = ({ text, children }) => (
    <div className="relative flex items-center group">
        {children}
        <div className="absolute left-0 bottom-full mb-2 w-max max-w-xs p-2 text-sm text-white bg-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            {text}
        </div>
    </div>
);

const ExpensesStep: React.FC<ExpensesStepProps> = ({ expenses, onUpdate, onNext, onBack }) => {
  const [editingCategory, setEditingCategory] = useState<keyof ExpenseProfile | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleTotalChange = (id: keyof ExpenseProfile, value: number) => {
    // When total changes, reset UPI split to 0 to avoid invalid state (upi > total)
    // and force user to re-evaluate the split.
    onUpdate('expenses', { ...expenses, [id]: { total: value, upi: 0 } });
  };
  
  const handleUpiSplitChange = (id: keyof ExpenseProfile, upiValue: number) => {
    onUpdate('expenses', { ...expenses, [id]: { ...expenses[id], upi: upiValue }});
  };

  const handleEditClick = (id: keyof ExpenseProfile) => {
    setEditingCategory(id);
    setEditValue(expenses[id].total.toString());
  };
  
  const handleEditChange = (value: string) => {
      setEditValue(value);
  }

  const commitEdit = () => {
    if (editingCategory) {
      const numericValue = parseInt(editValue, 10);
      if (!isNaN(numericValue)) {
        handleTotalChange(editingCategory, numericValue);
      }
    }
    setEditingCategory(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          commitEdit();
      }
      if (e.key === 'Escape') {
        setEditingCategory(null);
        setEditValue('');
      }
  };

  const totalExpenses = Object.values(expenses).reduce((sum, value) => sum + value.total, 0);
  const canProceed = true;

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-slide-in-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Your Monthly Spending</h2>
      <p className="text-gray-600 mb-6">Estimate your total monthly spend per category. For each, you can specify what portion is paid via UPI.</p>
      
      <div className="space-y-8">
        {EXPENSE_CATEGORY_GROUPS.map(({ groupTitle, categories }) => (
            <div key={groupTitle}>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">{groupTitle}</h3>
                <div className="space-y-6">
                    {categories.map(({ id, label, description, tooltip }) => {
                      const categorySpend = expenses[id];
                      const cardSpend = categorySpend.total - categorySpend.upi;

                      return (
                      <div key={id} className="py-2">
                        <div className="flex justify-between items-baseline">
                            <div className="flex items-center gap-2">
                                <div>
                                    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                                        {label}
                                    </label>
                                    <p className="text-xs text-gray-500">{description}</p>
                                </div>
                                {tooltip && (
                                    <Tooltip text={tooltip}>
                                        <InfoIcon className="h-4 w-4 text-gray-400 cursor-pointer" />
                                    </Tooltip>
                                )}
                            </div>
                            {editingCategory === id ? (
                                <input
                                    type="number"
                                    value={editValue}
                                    onChange={(e) => handleEditChange(e.target.value)}
                                    onBlur={commitEdit}
                                    onKeyDown={handleKeyDown}
                                    className="w-24 p-1 text-right font-semibold text-primary bg-white border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    autoFocus
                                />
                            ) : (
                                <span 
                                  className="font-semibold text-primary cursor-pointer hover:bg-gray-100 p-1 rounded-md"
                                  onClick={() => handleEditClick(id)}
                                  title="Click to edit total spend"
                                >
                                  ₹{categorySpend.total.toLocaleString('en-IN')}
                                </span>
                            )}
                        </div>
                        <input
                          type="range"
                          id={id}
                          min="0"
                          max={id === 'rent' ? 200000 : 100000}
                          step="1000"
                          value={categorySpend.total}
                          onChange={(e) => handleTotalChange(id, parseInt(e.target.value, 10))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                        />
                        {categorySpend.total > 0 && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
                              <label className="block text-xs font-medium text-gray-600 mb-2">Payment Split (Optional)</label>
                               <div className="flex justify-between items-center text-sm font-medium">
                                  <span className="text-gray-700">Card: <span className="font-bold text-blue-600">₹{cardSpend.toLocaleString('en-IN')}</span></span>
                                  <span className="text-gray-700">UPI: <span className="font-bold text-green-600">₹{categorySpend.upi.toLocaleString('en-IN')}</span></span>
                               </div>
                              <input
                                  type="range"
                                  min="0"
                                  max={categorySpend.total}
                                  step={Math.max(1, Math.round(categorySpend.total / 100))}
                                  value={categorySpend.upi}
                                  onChange={(e) => handleUpiSplitChange(id, parseInt(e.target.value, 10))}
                                  className="w-full h-2 bg-gradient-to-r from-blue-200 to-green-200 rounded-lg appearance-none cursor-pointer accent-gray-500 mt-2"
                                  title="Drag to set UPI portion"
                              />
                          </div>
                        )}
                      </div>
                    )})}
                </div>
            </div>
        ))}
      </div>
      
      <div className="mt-8 pt-4 border-t">
          <p className="text-lg font-bold text-gray-800 text-right">Total Estimated Monthly Spend: <span className="text-secondary">₹{totalExpenses.toLocaleString('en-IN')}</span></p>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button onClick={onBack} className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">
          Back
        </button>
        <button 
            onClick={onNext} 
            disabled={!canProceed}
            className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ExpensesStep;
