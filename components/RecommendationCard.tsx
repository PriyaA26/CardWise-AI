
import React, { useState } from 'react';
import { Recommendation } from '../types';
import { CheckCircle2Icon, StarIcon, IndianRupeeIcon, InfoIcon, TrendingUpIcon, Wand2Icon, ChevronDownIcon } from './icons';
import MarkdownRenderer from './MarkdownRenderer';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-slide-in-up">
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
                <h3 className="text-2xl font-bold text-gray-800">{recommendation.cardName}</h3>
                <p className="text-md text-gray-600">{recommendation.issuingBank}</p>
            </div>
            <div className="text-right flex-shrink-0 mt-2 sm:mt-0">
                <p className="text-sm text-green-700 font-semibold">Estimated Savings</p>
                <p className="text-xl font-bold text-secondary">₹{recommendation.estimatedAnnualSavings.toLocaleString('en-IN')}/year</p>
            </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
            <div className="flex items-center text-primary mb-2">
                <StarIcon className="h-5 w-5 mr-2" />
                <h4 className="text-lg font-semibold">Why it's recommended for you</h4>
            </div>
            <div className="text-gray-700 bg-blue-50 p-3 rounded-lg border-l-4 border-primary">
                <MarkdownRenderer content={recommendation.recommendationReason} />
            </div>
        </div>

        {/* Collapsible Section */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100 pt-6' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-6">
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Key Benefits</h4>
                    <ul className="space-y-2">
                        {recommendation.keyBenefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                            <CheckCircle2Icon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                        </li>
                        ))}
                    </ul>
                </div>
                
                {recommendation.spendingToSwitch && recommendation.spendingToSwitch.length > 0 && (
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                           <TrendingUpIcon className="h-5 w-5 text-secondary mr-2" />
                           Your Action Plan
                        </h4>
                        <div className="space-y-3">
                            {recommendation.spendingToSwitch.map((item, index) => (
                                <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-secondary shadow-sm">
                                   <p className="font-semibold text-green-800">Move ~₹{item.amount.toLocaleString('en-IN')} of your <span className="font-bold">{item.category}</span> spending to this card.</p>
                                   <p className="text-sm text-green-700 mt-1">{item.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {recommendation.tipsAndTricks && recommendation.tipsAndTricks.length > 0 && (
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <Wand2Icon className="h-5 w-5 mr-2 text-purple-500"/>
                            Pro Tips & Tricks
                        </h4>
                        <ul className="space-y-2">
                            {recommendation.tipsAndTricks.map((tip, index) => (
                            <li key={index} className="flex items-start">
                                <div className="text-purple-500 mr-2 mt-0.5 flex-shrink-0"><Wand2Icon className="h-5 w-5" /></div>
                                <span className="text-gray-700">{tip}</span>
                            </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center text-gray-700 font-semibold mb-1">
                            <IndianRupeeIcon className="h-5 w-5 mr-2"/>
                            <span>Fees & Charges</span>
                        </div>
                        <p className="text-gray-600">{recommendation.annualFee}</p>
                    </div>
                     <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center text-gray-700 font-semibold mb-1">
                            <InfoIcon className="h-5 w-5 mr-2"/>
                            <span>Eligibility</span>
                        </div>
                        <p className="text-gray-600">{recommendation.eligibility}</p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(`${recommendation.issuingBank} ${recommendation.cardName}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full md:w-auto px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition"
                    >
                        Learn More
                    </a>
                </div>
            </div>
        </div>
        
        {/* Toggle Button */}
        <div className="mt-4 border-t pt-4">
             <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-center w-full text-center text-sm font-semibold text-primary hover:text-primary-hover transition"
             >
                <span>{isExpanded ? 'Hide Details' : 'Show Full Details'}</span>
                <ChevronDownIcon className={`w-5 h-5 ml-2 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
             </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
