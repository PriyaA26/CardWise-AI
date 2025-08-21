
import React from 'react';
import { BotMessageSquareIcon, ZapIcon, TargetIcon, UserCheckIcon } from './icons';
import { FEATURE_FLAG_DEBIT_CARDS_ENABLED } from '../constants';

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  const features = [
    { icon: <UserCheckIcon className="h-8 w-8 text-primary"/>, title: "Personalized Portfolio Analysis", description: "Get a 360-degree view of your existing cards. We'll identify strengths, weaknesses, and your current annual savings." },
    { icon: <TargetIcon className="h-8 w-8 text-primary"/>, title: "Data-Driven Recommendations", description: "Discover the best new cards for you. Our AI analyzes 100+ options to find your perfect match based on your goals." },
    { icon: <ZapIcon className="h-8 w-8 text-primary"/>, title: "Optimal Spending Strategy", description: "Stop guessing at the checkout. We'll tell you exactly which card to use for every spending category to maximize your rewards." },
    { icon: <BotMessageSquareIcon className="h-8 w-8 text-primary"/>, title: "Chat with an AI Expert", description: "Refine your results, compare cards head-to-head, and get instant answers to your specific questions from our AI assistant." },
  ];

  return (
    <div className="relative text-center p-8 bg-white rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Unlock Your Card's Full Potential</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Stop guessing. Start saving. Our AI-powered advisor helps you find the best credit {FEATURE_FLAG_DEBIT_CARDS_ENABLED ? 'and debit ' : ''}cards in India for your spending habits.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 text-left">
        {features.map((feature, index) => (
            <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                {feature.icon}
                <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                </div>
            </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="px-8 py-3 bg-primary text-white font-bold rounded-lg text-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-transform animate-pulse-subtle"
      >
        Get Started
      </button>
      <p className="mt-4 text-sm text-gray-500">Takes less than 5 minutes!</p>
    </div>
  );
};

export default WelcomeStep;
