
import React from 'react';
import { OnboardingStep } from '../types';
import { TOTAL_STEPS } from '../constants';
import { CheckCircle2Icon } from './icons';

interface StepIndicatorProps {
  currentStep: OnboardingStep;
  onStepClick: (step: OnboardingStep) => void;
}

const steps = [
  "About You",
  "Current Cards",
  "Monthly Spending",
  "Card Goals"
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, onStepClick }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8 animate-fade-in">
      <div className="flex items-center justify-between">
        {steps.map((label, index) => {
           // OnboardingStep enum (Welcome is 0) vs step number (1-4)
           const stepEnum = index + 1;
           const isActive = currentStep === stepEnum;
           const isCompleted = currentStep > stepEnum;
           const isClickable = isCompleted && !!onStepClick;
           
           return (
            <React.Fragment key={stepEnum}>
              <div 
                className={`flex flex-col items-center ${isClickable ? 'cursor-pointer transition-opacity hover:opacity-75' : ''}`}
                onClick={isClickable ? () => onStepClick(stepEnum) : undefined}
                aria-current={isActive ? 'step' : undefined}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                    isActive ? 'bg-primary text-white scale-110' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2Icon className="w-6 h-6" /> : stepEnum}
                </div>
                <p className={`mt-2 text-center text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-600'}`}>{label}</p>
              </div>
              {stepEnum < TOTAL_STEPS && (
                <div className={`flex-1 h-1 mx-2 transition-colors duration-300 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;