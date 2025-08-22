

import React, { useState, useEffect } from 'react';
import { ExpenseProfile, UserProfile } from '../types';
import { EXPENSE_CATEGORY_GROUPS } from '../constants';
import { InfoIcon } from './icons';

interface ExpensesStepProps {
  expenses: ExpenseProfile;
  onUpdate: <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

const ExpensesStep: React.FC<ExpensesStepProps> = ({ expenses, onUpdate, onNext, onBack }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  const [editingCategory, setEditingCategory] = useState<keyof ExpenseProfile | null>(null);
  const [editValue, setEditValue] = useState('');
  const [groupUpiSplits, setGroupUpiSplits] = useState<{ [groupTitle: string]: number }>({});

  // Initialize and synchronize group-level UPI percentage splits from the detailed expense data
  useEffect(() => {
    const newSplits: { [groupTitle: string]: number } = {};
    EXPENSE_CATEGORY_GROUPS.forEach(({ groupTitle, categories }) => {
        const groupTotal = categories.reduce((sum, cat) => sum + (expenses[cat.id]?.total || 0), 0);
        const groupUpi = categories.reduce((sum, cat) => sum + (expenses[cat.id]?.upi || 0), 0);
        newSplits[groupTitle] = groupTotal > 0 ? Math.round((groupUpi / groupTotal) * 100) : 0;
    });
    setGroupUpiSplits(newSplits);
  }, [expenses]);


  const handleTotalChange = (id: keyof ExpenseProfile, value: number) => {
    // When total changes in basic view, maintain the UPI split percentage set in advanced view
    const group = EXPENSE_CATEGORY_GROUPS.flatMap(g => g.categories.map(c => ({...c, groupTitle: g.groupTitle}))).find(c => c.id === id);
    const currentSplitPercent = group ? (groupUpiSplits[group.groupTitle] || 0) : 0;
    const newUpiValue = Math.round(value * (currentSplitPercent / 100));

    onUpdate('expenses', { ...expenses, [id]: { total: value, upi: newUpiValue } });
  };
  
  const handleGroupUpiSplitChange = (groupTitle: string, newPercentage: number) => {
    // Update the UI state for the slider's position
    setGroupUpiSplits(prev => ({ ...prev, [groupTitle]: newPercentage }));

    // Create a copy of the current expenses to modify
    const newExpenses = { ...expenses };
    
    // Find the group and apply the new percentage to all categories within it
    const group = EXPENSE_CATEGORY_GROUPS.find(g => g.groupTitle === groupTitle);
    if (group) {
        group.categories.forEach(cat => {
            const categoryTotal = newExpenses[cat.id]?.total || 0;
            const newUpiValue = Math.round(categoryTotal * (newPercentage / 100));
            newExpenses[cat.id] = { ...newExpenses[cat.id], total: categoryTotal, upi: newUpiValue };
        });
    }

    // Propagate the changes up to the App component
    onUpdate('expenses', newExpenses);
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

  const TabButton: React.FC<{ tabId: 'basic' | 'advanced'; label: string; description: string }> = ({ tabId, label, description }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`flex-1 p-4 rounded-lg text-left transition-all duration-300 border-2 ${
        activeTab === tabId
        ? 'bg-blue-50 border-primary ring-2 ring-primary'
        : 'bg-gray-100 hover:bg-gray-200 border-gray-200'
      }`}
    >
      <span className="font-bold text-gray-800 text-lg">{label}</span>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </button>
  );

  const renderBasicTab = () => (
     <div className="space-y-8 mt-6 animate-fade-in">
        {EXPENSE_CATEGORY_GROUPS.map(({ groupTitle, categories }) => (
            <div key={groupTitle}>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">{groupTitle}</h3>
                <div className="space-y-6">
                    {categories.map(({ id, label, description }) => {
                      const categorySpend = expenses[id];
                      return (
                      <div key={id} className="py-2">
                        <div className="flex justify-between items-baseline">
                            <div>
                                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                                    {label}
                                </label>
                                <p className="text-xs text-gray-500">{description}</p>
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
                      </div>
                    )})}
                </div>
            </div>
        ))}
      </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-8 mt-6 animate-fade-in">
      {EXPENSE_CATEGORY_GROUPS.map(({ groupTitle, categories }) => {
        const groupTotal = categories.reduce((sum, cat) => sum + expenses[cat.id].total, 0);
        const upiPercentage = groupUpiSplits[groupTitle] || 0;
        const groupUpiTotal = Math.round(groupTotal * (upiPercentage / 100));
        const groupCardTotal = groupTotal - groupUpiTotal;

        if (groupTotal === 0) return null;

        return (
          <div key={groupTitle} className="p-6 bg-gray-50 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{groupTitle}</h3>
            <p className="text-sm text-gray-500 mb-4">Total Spend: ₹{groupTotal.toLocaleString('en-IN')}</p>

            <div className="flex justify-between items-center text-sm font-medium mb-2">
              <span className="text-gray-700">
                Card: <span className="font-bold text-blue-600">
                  {100 - upiPercentage}% (₹{groupCardTotal.toLocaleString('en-IN')})
                </span>
              </span>
              <span className="text-gray-700">
                UPI: <span className="font-bold text-green-600">
                  {upiPercentage}% (₹{groupUpiTotal.toLocaleString('en-IN')})
                </span>
              </span>
            </div>
            
            <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={upiPercentage}
                onChange={(e) => handleGroupUpiSplitChange(groupTitle, parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gradient-to-r from-blue-200 to-green-200 rounded-lg appearance-none cursor-pointer accent-gray-500"
                title={`Drag to set UPI portion (${upiPercentage}%)`}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-slide-in-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Your Monthly Spending</h2>
      <p className="text-gray-600 mb-6">First, set your total spends in 'Basic', then optionally refine your Card vs. UPI split in 'Advanced'.</p>
      
      <div className="flex gap-4 mb-6">
        <TabButton tabId="basic" label="Basic" description="Set total spend per category" />
        <TabButton tabId="advanced" label="Advanced" description="Adjust Card vs. UPI payment split" />
      </div>

      {activeTab === 'basic' ? renderBasicTab() : renderAdvancedTab()}
      
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
