import React, { useEffect } from 'react';
import { NewCardPreferences } from '../types';
import { AI_SUGGESTION_GOAL, SPECIFIC_CARD_GOAL_GROUPS, FEE_PREFERENCES } from '../constants';
import { InfoIcon, SparklesIcon, BotMessageSquareIcon, TargetIcon } from './icons';

interface NewCardPrefsStepProps {
  data: NewCardPreferences;
  onUpdate: (data: NewCardPreferences) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const Tooltip: React.FC<{ text: string, children: React.ReactNode }> = ({ text, children }) => (
    <div className="relative flex items-center group">
        {children}
        <div className="absolute bottom-full mb-2 w-max max-w-xs p-2 text-sm text-white bg-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            {text}
        </div>
    </div>
);

const NewCardPrefsStep: React.FC<NewCardPrefsStepProps> = ({ data, onUpdate, onSubmit, onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const canProceed = data.primaryGoal.length > 0 && data.feeComfort;

  const isAiMode = data.primaryGoal.includes(AI_SUGGESTION_GOAL.text);

  const handleSelectAiMode = () => {
    onUpdate({ ...data, primaryGoal: [AI_SUGGESTION_GOAL.text] });
  };

  const handleSelectSpecificMode = () => {
    // If we're not in AI mode, this button doesn't need to do anything.
    // If we are, clear the goals to switch to specific goal selection.
    if (isAiMode) {
      onUpdate({ ...data, primaryGoal: [] });
    }
  };
  
  const handleGoalToggle = (goal: string) => {
    const currentGoals = data.primaryGoal || [];
    const isSelected = currentGoals.includes(goal);
    let newGoals;

    if (isSelected) {
      newGoals = currentGoals.filter(g => g !== goal);
    } else {
      if (currentGoals.length < 3) {
        newGoals = [...currentGoals, goal];
      } else {
        // Optional: show a small notification that limit is reached
        return; 
      }
    }
    onUpdate({ ...data, primaryGoal: newGoals });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-slide-in-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">What are you looking for?</h2>
      <p className="text-gray-600 mb-6">Tell us your goals for a new card so we can find the perfect match.</p>
      
      <div className="space-y-6">
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What are your primary goals?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button 
                onClick={handleSelectAiMode}
                className={`p-6 border-2 rounded-lg text-left transition-all duration-200 flex flex-col items-start h-full ${isAiMode ? 'border-primary bg-blue-50 ring-2 ring-primary' : 'bg-white hover:border-primary/50'}`}
            >
                <BotMessageSquareIcon className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-bold text-gray-800 text-lg">{AI_SUGGESTION_GOAL.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{AI_SUGGESTION_GOAL.description}</p>
            </button>
             <button 
                onClick={handleSelectSpecificMode}
                className={`p-6 border-2 rounded-lg text-left transition-all duration-200 flex flex-col items-start h-full ${!isAiMode ? 'border-primary bg-blue-50 ring-2 ring-primary' : 'bg-white hover:border-primary/50'}`}
            >
                <TargetIcon className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-bold text-gray-800 text-lg">I'll Choose Specific Goals</h4>
                <p className="text-sm text-gray-600 mt-1">Select up to 3 goals like cashback, travel rewards, or low fees.</p>
            </button>
          </div>
          
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isAiMode ? 'max-h-0' : 'max-h-[500px]'}`}>
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-gray-50 px-3 text-sm font-semibold text-gray-500">Select up to 3 goals below</span>
                </div>
            </div>

            <div className="space-y-6">
                {SPECIFIC_CARD_GOAL_GROUPS.map(group => (
                <div key={group.title}>
                    <h4 className="text-md font-semibold text-gray-700 mb-3">{group.title}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {group.goals.map((goal) => (
                        <button
                        key={goal.text}
                        onClick={() => handleGoalToggle(goal.text)}
                        className={`h-full p-3 border rounded-lg text-center transition-all duration-200 text-sm md:text-base flex items-center justify-center ${
                            data.primaryGoal.includes(goal.text)
                            ? 'bg-primary text-white border-primary-focus ring-2 ring-primary'
                            : 'bg-white hover:bg-gray-100 border-gray-300'
                        }`}
                        >
                        {goal.text}
                        </button>
                    ))}
                    </div>
                </div>
                ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What is your comfort level with annual fees?</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {FEE_PREFERENCES.map((fee) => (
              <button
                key={fee}
                onClick={() => onUpdate({ ...data, feeComfort: fee })}
                className={`h-full p-4 border rounded-lg text-center transition-all duration-200 flex items-center justify-center ${
                  data.feeComfort === fee
                    ? 'bg-primary text-white border-primary-focus ring-2 ring-primary'
                    : 'bg-white hover:bg-gray-100 border-gray-300'
                }`}
              >
                {fee}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <SparklesIcon className="h-6 w-6 mr-2 text-indigo-500" />
                Fine-tune Your Recommendations (Optional)
            </h3>
             <p className="text-sm text-gray-600 mb-4">
                The more details you share, the smarter the AI gets. This is your chance to add any personal context.
            </p>
            <textarea
                value={data.additionalInfo}
                onChange={(e) => onUpdate({ ...data, additionalInfo: e.target.value })}
                placeholder="Type here..."
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={4}
            />
             <div className="mt-3 text-sm text-gray-600 space-y-2">
                <p className="font-semibold text-gray-700">Not sure what to add? Try answering these:</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-500">
                    <li>Do you have any preferred card networks (Visa, Mastercard, RuPay, Amex)?</li>
                    <li>Do you have a specific card you've been considering?</li>
                    <li>Are there any merchants where you spend a lot (e.g., Zomato, BigBasket, specific airlines)?</li>
                    <li>Is any of your existing cards Lifetime Free (LTF) due to a special offer?</li>
                    <li>Do you frequently travel internationally?</li>
                </ul>
            </div>
        </div>
      </div>
      
      <div className="mt-10 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
        <button 
          onClick={onBack} 
          className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition text-center">
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!canProceed}
          className="w-full sm:w-auto px-8 py-3 bg-secondary text-white font-bold rounded-lg text-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
        >
          Analyze & Get Recommendations
        </button>
      </div>
    </div>
  );
};

export default NewCardPrefsStep;