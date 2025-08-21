
import React from 'react';
import { UserProfile } from '../types';
import { CREDIT_SCORE_PROVIDERS } from '../constants';
import { InfoIcon } from './icons';

interface CreditScoreStepProps {
  data: Pick<UserProfile, 'creditScore' | 'creditScoreProvider'>;
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

const CreditScoreStep: React.FC<CreditScoreStepProps> = ({ data, onUpdate, onNext, onBack }) => {
  const canProceed = data.creditScoreProvider && data.creditScore >= 300 && data.creditScore <= 900;

  const handleScoreChange = (value: string) => {
    const score = parseInt(value, 10);
    if (!isNaN(score)) {
        onUpdate('creditScore', score);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-slide-in-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">What's your credit score?</h2>
      <p className="text-gray-600 mb-6">This helps us recommend cards you're more likely to be approved for.</p>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label htmlFor="creditScore" className="block text-sm font-medium text-gray-700">
              Credit Score
            </label>
            <Tooltip text="Your credit score is a key factor banks use for approvals. A score above 750 is generally considered good. This data is not stored.">
                <InfoIcon className="h-4 w-4 text-gray-400 cursor-pointer" />
            </Tooltip>
          </div>
           <div className="flex items-center gap-4">
               <input
                  type="range"
                  id="creditScoreSlider"
                  min="300"
                  max="900"
                  step="1"
                  value={data.creditScore}
                  onChange={(e) => handleScoreChange(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <input 
                  type="number" 
                  id="creditScore"
                  value={data.creditScore}
                  onChange={(e) => handleScoreChange(e.target.value)}
                  className="w-24 p-2 text-center font-semibold text-primary bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
           </div>
        </div>
        
        <div>
          <label htmlFor="creditScoreProvider" className="block text-sm font-medium text-gray-700 mb-1">
            Credit Score Provider
          </label>
          <select
            id="creditScoreProvider"
            value={data.creditScoreProvider}
            onChange={(e) => onUpdate('creditScoreProvider', e.target.value)}
            className={`w-full pl-3 pr-10 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              data.creditScoreProvider ? 'text-gray-800' : 'text-gray-500'
            }`}
          >
            <option value="" disabled>Select a provider</option>
            {CREDIT_SCORE_PROVIDERS.map((provider) => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
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

export default CreditScoreStep;
