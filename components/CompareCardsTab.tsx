

import React, { useState, useEffect } from 'react';
import { CardComparisonResult, ComparisonSummaryPoint } from '../types';
import Spinner from './Spinner';
import { ScaleIcon, SparklesIcon, CheckCircle2Icon, XCircleIcon } from './icons';
import MarkdownRenderer from './MarkdownRenderer';

interface CompareCardsTabProps {
  availableCards: string[];
  onCompare: (cards: string[]) => Promise<void>;
  result: CardComparisonResult | null;
  isLoading: boolean;
  error: string | null;
  preselectedCards: string[];
}

const CompareCardsTab: React.FC<CompareCardsTabProps> = ({
  availableCards,
  onCompare,
  result,
  isLoading,
  error,
  preselectedCards,
}) => {
  const [selectedCards, setSelectedCards] = useState<(string | null)[]>([null, null, null]);

  useEffect(() => {
    // Pre-populate selectors with recommended cards, but only if the user hasn't made a selection yet.
    // This provides a helpful default without overriding user's manual choices.
    const isSelectionEmpty = selectedCards.every(card => card === null);
    if (isSelectionEmpty && preselectedCards && preselectedCards.length > 0) {
      const newSelection: (string | null)[] = [null, null, null];
      const cardsToSelect = preselectedCards.slice(0, 3);
      
      cardsToSelect.forEach((card, index) => {
        if (availableCards.includes(card)) {
          newSelection[index] = card;
        }
      });
      
      setSelectedCards(newSelection);
    }
  }, [preselectedCards, availableCards, selectedCards]);

  const handleSelectChange = (index: number, value: string | null) => {
    const newSelection = [...selectedCards];
    newSelection[index] = value === 'none' ? null : value;
    setSelectedCards(newSelection);
  };

  const handleCompareClick = () => {
    const cardsToCompare = selectedCards.filter((c): c is string => c !== null);
    if (cardsToCompare.length >= 2) {
      onCompare(cardsToCompare);
    }
  };

  const renderSelector = (index: number) => {
    // Exclude cards that are already selected in other dropdowns
    const filteredOptions = availableCards.filter(
      (card) => !selectedCards.some((selected, i) => i !== index && selected === card)
    );

    return (
      <select
        value={selectedCards[index] || 'none'}
        onChange={(e) => handleSelectChange(index, e.target.value)}
        className="w-full pl-3 pr-10 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
      >
        <option value="none">{index > 1 && !selectedCards[index-1] ? `Select Card ${index}` : `Select Card ${index + 1}`}</option>
        {filteredOptions.map((card) => (
          <option key={card} value={card}>
            {card}
          </option>
        ))}
      </select>
    );
  };

  const canCompare = selectedCards.filter(Boolean).length >= 2;
  
  const groupedSummary = result?.summary.reduce((acc, point) => {
      if (!acc[point.cardName]) {
          acc[point.cardName] = [];
      }
      acc[point.cardName].push(point);
      return acc;
  }, {} as Record<string, ComparisonSummaryPoint[]>);


  const renderResults = () => {
    if (!result) return null;
    const cardHeaders = selectedCards.filter((c): c is string => c !== null);
    
    return (
        <div className="mt-8 animate-fade-in space-y-8">
            {/* Structured Summary */}
            {groupedSummary && Object.keys(groupedSummary).length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <SparklesIcon className="h-5 w-5 mr-2 text-primary" />
                        Comparison Summary
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(groupedSummary).map(([cardName, points]) => (
                            <div key={cardName} className="p-4 bg-gray-50 rounded-lg border">
                                <h4 className="font-bold text-gray-800 mb-2">{cardName}</h4>
                                <ul className="space-y-2">
                                    {points.map((point, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            {point.type === 'Pro' 
                                                ? <CheckCircle2Icon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                : <XCircleIcon className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                            }
                                            <p className="text-sm text-gray-700">{point.point}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            {/* Comparison Table */}
            <div className="overflow-x-auto">
                 <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    Detailed Comparison
                </h3>
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3 rounded-l-lg">Parameter</th>
                            {cardHeaders.map(header => (
                                <th key={header} scope="col" className="px-6 py-3">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {result.comparisonTable.map((row, i) => (
                             <tr key={i} className={`border-b ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {row.parameter}
                                </th>
                                {row.values.map((value, j) => (
                                    <td key={j} className="px-6 py-4">{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             {/* Recommendation */}
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                    <SparklesIcon className="h-5 w-5 mr-2 text-secondary" />
                    Final Recommendation
                </h3>
                <div className="text-gray-700 bg-green-50 p-4 rounded-lg border-l-4 border-secondary">
                    <MarkdownRenderer content={result.recommendation} />
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="animate-fade-in p-1 md:p-4">
      <div className="flex items-center text-gray-800 mb-4">
        <ScaleIcon className="h-8 w-8 text-primary mr-3" />
        <h2 className="text-3xl font-bold">Compare Cards</h2>
      </div>
      <p className="text-lg text-gray-600 mb-6">
        Select 2 or 3 cards to see a personalized, side-by-side comparison based on your spending profile.
      </p>

      {/* Card Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {renderSelector(0)}
        {renderSelector(1)}
        {renderSelector(2)}
      </div>

      <div className="text-center">
        <button
          onClick={handleCompareClick}
          disabled={!canCompare || isLoading}
          className="px-8 py-3 bg-primary text-white font-bold rounded-lg text-lg hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          {isLoading ? 'Comparing...' : 'Compare Cards'}
        </button>
      </div>

      {/* Results Section */}
      <div className="mt-8">
        {isLoading && (
            <div className="text-center py-10">
                <Spinner />
                <p className="mt-2 text-gray-600">Generating personalized comparison...</p>
            </div>
        )}
        {error && <div className="text-center py-10 bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>}
        {result && renderResults()}
      </div>
    </div>
  );
};

export default CompareCardsTab;