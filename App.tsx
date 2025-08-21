import React, { useState, useCallback, useEffect, useRef } from 'react';
import { OnboardingStep, UserProfile, ComprehensiveAnalysis, ChatMessage, CardInfo, CardComparisonResult, ExpenseProfile, FeedbackData, ExpenseCategorySplit } from './types';
import Header from './components/Header';
import WelcomeStep from './components/WelcomeStep';
import StepIndicator from './components/StepIndicator';
import DemographicsStep from './components/DemographicsStep';
import ExistingCardsStep from './components/ExistingCardsStep';
import ExpensesStep from './components/ExpensesStep';
import NewCardPrefsStep from './components/NewCardPrefsStep';
import PortfolioAnalysis from './components/PortfolioAnalysis';
import { getAnalysis, startChat, getCardComparison } from './services/geminiService';
import { submitFeedback } from './services/feedbackService';
import { Chat } from '@google/genai';
import { AI_SUGGESTION_GOAL, FEE_PREFERENCES, LOADING_TIPS, SALARY_RANGES, FEATURE_FLAG_DEBIT_CARDS_ENABLED } from './constants';
import Feedback from './components/Feedback';

const REANALYZE_TOKEN = "[REANALYZE_SUGGESTION]";
const STORAGE_KEY = FEATURE_FLAG_DEBIT_CARDS_ENABLED ? 'indiaCardAdvisorData' : 'indiaCreditCardAdvisorData';
const DEFAULT_CHAT_PLACEHOLDER = "e.g., I travel internationally twice a year";
const FEATURE_FLAG_FEEDBACK_ENABLED = false;

const initialUserData: UserProfile = {
  salary: '',
  city: '',
  otherCity: '',
  creditScore: 750,
  creditScoreProvider: '',
  creditCards: [],
  debitCards: [],
  expenses: {
    onlineShopping: { total: 2000, upi: 0 },
    offlineShopping: { total: 2000, upi: 0 },
    travel: { total: 1000, upi: 0 },
    fuel: { total: 500, upi: 0 },
    utilities: { total: 1000, upi: 0 },
    entertainment: { total: 500, upi: 0 },
    dining: { total: 1000, upi: 0 },
    health: { total: 500, upi: 0 },
    cashWithdrawals: { total: 500, upi: 0 },
    rent: { total: 0, upi: 0 },
    societyMaintenance: { total: 0, upi: 0 },
    insurance: { total: 0, upi: 0 },
    other: { total: 500, upi: 0 },
  },
  preferences: {
    primaryGoal: [AI_SUGGESTION_GOAL.text],
    feeComfort: '',
    cardType: 'Credit',
    additionalInfo: '',
  },
};


const App: React.FC = () => {
  const getInitialState = () => {
    try {
        const savedDataString = localStorage.getItem(STORAGE_KEY);
        if (savedDataString) {
            const savedState = JSON.parse(savedDataString);
            const savedUserData = savedState.data as Partial<UserProfile> & { preferences?: { primaryGoal?: string | string[] }, expenses?: Partial<{ [K in keyof ExpenseProfile]: number | ExpenseCategorySplit }> & { upi?: any }, paymentDistribution?: any };

            const migratedData: UserProfile = JSON.parse(JSON.stringify(initialUserData));

            if (savedUserData.salary) migratedData.salary = savedUserData.salary;
            if (savedUserData.city) migratedData.city = savedUserData.city;
            if (savedUserData.otherCity) migratedData.otherCity = savedUserData.otherCity;
            migratedData.creditScore = savedUserData.creditScore ?? 750;
            migratedData.creditScoreProvider = savedUserData.creditScoreProvider ?? '';

            if (savedUserData.expenses) {
                const migratedExpenses = { ...migratedData.expenses };
                for (const key in migratedExpenses) {
                    const expenseKey = key as keyof ExpenseProfile;
                    const savedValue = savedUserData.expenses[expenseKey];
                    if (typeof savedValue === 'number') {
                        // Old format: migrate from number to { total, upi }
                        migratedExpenses[expenseKey] = { total: savedValue, upi: 0 };
                    } else if (savedValue && typeof savedValue === 'object' && 'total' in savedValue) {
                        // New format: just merge
                        migratedExpenses[expenseKey] = { ...migratedExpenses[expenseKey], ...savedValue };
                    }
                }
                migratedData.expenses = migratedExpenses;

                if ('upi' in (savedUserData.expenses as any)) {
                    delete (savedUserData.expenses as any).upi;
                }
            }

            if (savedUserData.paymentDistribution) {
                delete (savedUserData as any).paymentDistribution;
            }
            
            if (savedUserData.preferences) {
                migratedData.preferences = { ...migratedData.preferences, ...savedUserData.preferences };
                if (typeof savedUserData.preferences.primaryGoal === 'string') {
                    migratedData.preferences.primaryGoal = [savedUserData.preferences.primaryGoal];
                }
            }
            
            if (!migratedData.preferences.primaryGoal || migratedData.preferences.primaryGoal.length === 0) {
              migratedData.preferences.primaryGoal = [AI_SUGGESTION_GOAL.text];
            }

            const migrateCards = (savedCards: Partial<CardInfo>[] = []): CardInfo[] => {
                return savedCards.map(card => ({
                    id: card.id || Date.now().toString() + Math.random(),
                    bank: card.bank || '',
                    variant: card.variant || '',
                    annualFee: card.annualFee ?? 0,
                    isLTF: card.isLTF ?? false,
                }));
            };

            if (savedUserData.creditCards) {
                migratedData.creditCards = migrateCards(savedUserData.creditCards);
            }
            if (savedUserData.debitCards) {
                migratedData.debitCards = migrateCards(savedUserData.debitCards);
            }
            
            let step = savedState.step;
            if (step === OnboardingStep.Analysis) {
                step = OnboardingStep.NewCardPrefs;
            }

            return { initialStep: step, initialData: migratedData };
        }
    } catch (error) {
        console.error("Failed to parse or migrate saved data, starting fresh.", error);
        localStorage.removeItem(STORAGE_KEY);
    }
    return { initialStep: OnboardingStep.Welcome, initialData: initialUserData };
  };

  const { initialStep, initialData } = getInitialState();

  const [currentStep, setCurrentStep] = useState<OnboardingStep>(initialStep);
  const [userData, setUserData] = useState<UserProfile>(initialData);

  const [analysisResult, setAnalysisResult] = useState<ComprehensiveAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState(LOADING_TIPS[0]);
  const tipIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [comparisonResult, setComparisonResult] = useState<CardComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonError, setComparisonError] = useState<string | null>(null);
  const [chatPlaceholder, setChatPlaceholder] = useState(DEFAULT_CHAT_PLACEHOLDER);
  const [highlightChat, setHighlightChat] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [reanalysisCount, setReanalysisCount] = useState(0);
  
  useEffect(() => {
    try {
        const dataToSave = JSON.stringify({ step: currentStep, data: userData });
        localStorage.setItem(STORAGE_KEY, dataToSave);
    } catch (error) {
        console.error("Failed to save data", error);
    }
  }, [currentStep, userData]);

  const handleUpdate = useCallback(<K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setUserData((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    if (currentStep === OnboardingStep.NewCardPrefs && !userData.preferences.feeComfort && userData.salary) {
      let feeComfort = '';
      const salary = userData.salary;

      switch (salary) {
        case SALARY_RANGES[0]: 
          feeComfort = FEE_PREFERENCES[0]; 
          break;
        case SALARY_RANGES[1]: 
        case SALARY_RANGES[2]: 
          feeComfort = FEE_PREFERENCES[1]; 
          break;
        case SALARY_RANGES[3]: 
        case SALARY_RANGES[4]: 
          feeComfort = FEE_PREFERENCES[2]; 
          break;
        case SALARY_RANGES[5]: 
          feeComfort = FEE_PREFERENCES[3]; 
          break;
        case SALARY_RANGES[6]: 
        case SALARY_RANGES[7]: 
          feeComfort = FEE_PREFERENCES[4]; 
          break;
        default:
          break;
      }

      if (feeComfort) {
        handleUpdate('preferences', { ...userData.preferences, feeComfort });
      }
    }
  }, [currentStep, userData.salary, userData.preferences, handleUpdate]);


  const handleNext = () => {
    setCurrentStep((prev) => (prev < OnboardingStep.Analysis ? prev + 1 : prev));
  };

  const handleBack = () => {
    setCurrentStep((prev) => (prev > OnboardingStep.Welcome ? prev - 1 : prev));
  };
  
  const handleStartOver = () => {
    localStorage.removeItem(STORAGE_KEY);
    
    setCurrentStep(OnboardingStep.Welcome);
    setUserData(JSON.parse(JSON.stringify(initialUserData))); 
    setAnalysisResult(null);
    setError(null);
    setChatSession(null);
    setChatHistory([]);
    setIsChatLoading(false);
    setComparisonResult(null);
    setComparisonError(null);
    setIsComparing(false);
    setChatPlaceholder(DEFAULT_CHAT_PLACEHOLDER);
    setHighlightChat(false);
    setIsDevMode(false);
    setReanalysisCount(0);

    if (tipIntervalRef.current) {
      clearInterval(tipIntervalRef.current);
    }
  };

  const handleToggleDevMode = () => {
    setIsDevMode(prev => !prev);
  };
  
  const handleStepClick = (step: OnboardingStep) => {
    if(step < currentStep) {
        setCurrentStep(step);
    }
  };

  const handleRefineForms = () => {
    setCurrentStep(OnboardingStep.NewCardPrefs);
    setAnalysisResult(null);
    setError(null);
    setChatSession(null);
    setChatHistory([]);
    setChatPlaceholder(DEFAULT_CHAT_PLACEHOLDER);
  };

  const performAnalysis = async (profile: UserProfile, previousAnalysis: ComprehensiveAnalysis | null, history: ChatMessage[] = []) => {
    setIsLoading(true);
    setError(null);
    
    let tipIndex = 0;
    tipIntervalRef.current = setInterval(() => {
        tipIndex = (tipIndex + 1) % LOADING_TIPS.length;
        setLoadingTip(LOADING_TIPS[tipIndex]);
    }, 2500);

    if (!previousAnalysis) {
        setAnalysisResult(null);
    }
    try {
      const analysis = await getAnalysis(profile, previousAnalysis, history);
      setAnalysisResult(analysis);
    } catch (e) {
      const errorMessage = e instanceof Error ? `Failed to get analysis: ${e.message}. Please try again.` : 'An unknown error occurred.';
      setError(errorMessage);
      if (history.length > 0) {
        setChatHistory(prev => [...prev, { role: 'model', id: Date.now().toString(), text: `Sorry, I couldn't update the analysis. Error: ${errorMessage}` }]);
      }
    } finally {
      setIsLoading(false);
      if (tipIntervalRef.current) {
        clearInterval(tipIntervalRef.current);
      }
    }
  };

  const handleCompare = async (cardsToCompare: string[]) => {
      setIsComparing(true);
      setComparisonResult(null);
      setComparisonError(null);
      try {
          const result = await getCardComparison(userData, cardsToCompare);
          setComparisonResult(result);
          setChatPlaceholder(`Ask about this comparison, e.g., Which is better for fuel?`);
          setHighlightChat(true);
          setTimeout(() => setHighlightChat(false), 2000); 
      } catch (e) {
          const errorMessage = e instanceof Error ? `Failed to get comparison: ${e.message}` : 'An unknown error occurred.';
          setComparisonError(errorMessage);
      } finally {
          setIsComparing(false);
      }
  };

  const handleSubmitForAnalysis = async () => {
    setCurrentStep(OnboardingStep.Analysis);
    await performAnalysis(userData, null);
    
    const chat = startChat(userData);
    setChatSession(chat);
    setChatHistory([{ role: 'model', id: Date.now().toString(), text: 'Here is your initial analysis. Ask me anything or provide more details to refine it!' }]);
    setChatPlaceholder(DEFAULT_CHAT_PLACEHOLDER);
  };
  
  const handleReanalysis = async () => {
      setIsChatLoading(true);
      const historyForAnalysis = [...chatHistory];
      setChatHistory(prev => prev.map(m => ({ ...m, offerReanalysis: false })));

      await performAnalysis(userData, analysisResult, historyForAnalysis);
      
      setComparisonResult(null);
      setComparisonError(null);
      setReanalysisCount(prev => prev + 1);
      
      setChatHistory(prev => [...prev, {role: 'model', id: Date.now().toString(), text: "I've updated the analysis above based on our conversation."}]);
      setIsChatLoading(false);
  }

  const handleSendMessage = async (message: string) => {
    if (!chatSession) return;
    
    const userMessage: ChatMessage = { role: 'user', text: message, id: Date.now().toString() };
    setChatHistory(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      const response = await chatSession.sendMessage({ message });
      
      let botText = response.text.trim();
      let offerReanalysis = false;
      
      if (botText.endsWith(REANALYZE_TOKEN)) {
          botText = botText.replace(REANALYZE_TOKEN, '').trim();
          offerReanalysis = true;
      }

      if (!botText) botText = "Sorry, I didn't get that. Could you rephrase?";

      const botMessage: ChatMessage = {
          role: 'model',
          text: botText,
          id: (Date.now() + 1).toString(),
          offerReanalysis: offerReanalysis
      };
      setChatHistory(prev => [...prev, botMessage]);

    } catch (e) {
      const errorMessage = e instanceof Error ? `Chat failed: ${e.message}` : 'An unknown error occurred.';
      setError(errorMessage);
      setChatHistory(prev => [...prev, { role: 'model', id: Date.now().toString(), text: `Sorry, I encountered an error: ${errorMessage}` }]);
      console.error(e);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleFeedbackSubmit = async (feedbackData: FeedbackData) => {
    try {
      const response = await submitFeedback(feedbackData);
      console.log('Feedback submission success:', response.message);
      return { success: true, message: response.message };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error('Feedback submission failed:', errorMessage);
      return { success: false, message: errorMessage };
    }
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case OnboardingStep.Welcome:
        return <WelcomeStep onNext={handleNext} />;
      case OnboardingStep.Demographics:
        return <DemographicsStep data={userData} onUpdate={handleUpdate} onNext={handleNext} onBack={handleBack} />;
      case OnboardingStep.ExistingCards:
        return <ExistingCardsStep 
            data={{
                creditCards: userData.creditCards,
                debitCards: userData.debitCards,
                creditScore: userData.creditScore,
                creditScoreProvider: userData.creditScoreProvider,
            }} 
            onUpdate={handleUpdate} 
            onNext={handleNext} 
            onBack={handleBack} 
        />;
      case OnboardingStep.Expenses:
        return <ExpensesStep 
            expenses={userData.expenses}
            onUpdate={handleUpdate} 
            onNext={handleNext} 
            onBack={handleBack} 
        />;
      case OnboardingStep.NewCardPrefs:
        return <NewCardPrefsStep data={userData.preferences} onUpdate={(value) => handleUpdate('preferences', value)} onSubmit={handleSubmitForAnalysis} onBack={handleBack} />;
      case OnboardingStep.Analysis:
        return (
          <PortfolioAnalysis
            result={analysisResult}
            isLoading={isLoading}
            error={error}
            loadingTip={loadingTip}
            onRefine={handleRefineForms}
            chatHistory={chatHistory}
            isChatLoading={isChatLoading}
            onSendMessage={handleSendMessage}
            onReanalysis={handleReanalysis}
            onCompare={handleCompare}
            comparisonResult={comparisonResult}
            isComparing={isComparing}
            comparisonError={comparisonError}
            chatPlaceholder={chatPlaceholder}
            highlightChat={highlightChat}
            isDevMode={isDevMode}
            onToggleDevMode={handleToggleDevMode}
            reanalysisCount={reanalysisCount}
          />
        );
      default:
        return <WelcomeStep onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onStartOver={handleStartOver} />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        {currentStep > OnboardingStep.Welcome && currentStep < OnboardingStep.Analysis && (
          <StepIndicator currentStep={currentStep} onStepClick={handleStepClick} />
        )}
        <div className="w-full max-w-7xl mt-4">
          {renderStep()}
        </div>
      </main>
      {FEATURE_FLAG_FEEDBACK_ENABLED && <Feedback onSubmit={handleFeedbackSubmit} />}
       <footer className="w-full text-center py-4 text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} CardWise AI. All rights reserved.</p>
        </footer>
    </div>
  );
};

export default App;