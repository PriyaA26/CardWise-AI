import React from 'react';
import { UserProfile } from '../types';
import { SALARY_RANGES, CITIES } from '../constants';
import { InfoIcon } from './icons';

interface DemographicsStepProps {
  data: Pick<UserProfile, 'salary' | 'city' | 'otherCity'>;
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


const DemographicsStep: React.FC<DemographicsStepProps> = ({ data, onUpdate, onNext, onBack }) => {
  const canProceed = data.salary && data.city && (data.city !== 'Other' || data.otherCity);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-slide-in-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Tell us about yourself</h2>
      <p className="text-gray-600 mb-6">This helps us understand your eligibility for different cards.</p>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
              Monthly Net Salary
            </label>
            <Tooltip text="Your salary helps us determine which cards you are eligible for. This information is not stored.">
                <InfoIcon className="h-4 w-4 text-gray-400 cursor-pointer" />
            </Tooltip>
          </div>
          <select
            id="salary"
            value={data.salary}
            onChange={(e) => onUpdate('salary', e.target.value)}
            className={`w-full pl-3 pr-10 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              data.salary ? 'text-gray-800' : 'text-gray-500'
            }`}
          >
            <option value="" disabled>Select your salary range</option>
            {SALARY_RANGES.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City of Residence
          </label>
          <select
            id="city"
            value={data.city}
            onChange={(e) => onUpdate('city', e.target.value)}
            className={`w-full pl-3 pr-10 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              data.city ? 'text-gray-800' : 'text-gray-500'
            }`}
          >
            <option value="" disabled>Select your city</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {data.city === 'Other' && (
            <div className="animate-fade-in">
                <label htmlFor="otherCity" className="block text-sm font-medium text-gray-700 mb-1">
                    Please specify your city
                </label>
                <input
                    type="text"
                    id="otherCity"
                    value={data.otherCity || ''}
                    onChange={(e) => onUpdate('otherCity', e.target.value)}
                    placeholder="e.g., Nashik"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
            </div>
        )}
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

export default DemographicsStep;