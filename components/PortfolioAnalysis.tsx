import React, { useState, useMemo, useRef, useEffect } from 'react';
import { PortfolioAnalysisProps, CardComparisonResult } from '../types';
import Spinner from './Spinner';
import RecommendationCard from './RecommendationCard';
import UsageStrategyTable from './UsageStrategyTable';
import { CheckCircle2Icon, XCircleIcon, SparklesIcon, TrendingUpIcon, LightbulbIcon, ClipboardListIcon, Wand2Icon, IndianRupeeIcon, BarChartIcon, ScaleIcon, ArrowRightIcon, TerminalIcon } from './icons';
import Chatbot from './Chatbot';
import CompareCardsTab from './CompareCardsTab';
import MarkdownRenderer from './MarkdownRenderer';
import { CARD_DATABASE, DEBIT_CARD_DATABASE } from '../constants';


type AnalysisTab = 'summary' | 'strategy' | 'recommendations' | 'compare' | 'developer';

const InsightCard: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex-shrink-0 mr-3 mt-1">{icon}</div>
        <div className="text-gray-700">
          <MarkdownRenderer content={text} />
        </div>
    </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center py-4 px-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">{message}</p>
    </div>
);

const PortfolioAnalysis: React.FC<PortfolioAnalysisProps> = ({
  result,
  isLoading,
  error,
  loadingTip,
  onRefine,
  chatHistory,
  isChatLoading,
  onSendMessage,
  onReanalysis,
  onCompare,
  comparisonResult,
  isComparing,
  comparisonError,
  chatPlaceholder,
  highlightChat,
  isDevMode,
  onToggleDevMode,
  reanalysisCount,
}) => {
  const [activeTab, setActiveTab] = useState<AnalysisTab>('summary');
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  
  const devClickCount = useRef(0);
  const devClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Switch to the recommendations tab after a re-analysis.
    if (reanalysisCount > 0) {
      setActiveTab('recommendations');
    }
  }, [reanalysisCount]);

  const handleDevModeClick = () => {
      if (devClickTimer.current) {
          clearTimeout(devClickTimer.current);
      }
      devClickCount.current += 1;
      if (devClickCount.current >= 5) {
          onToggleDevMode();
          devClickCount.current = 0;
      }
      devClickTimer.current = setTimeout(() => {
          devClickCount.current = 0;
      }, 2000); // Reset count after 2 seconds
  };
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (devClickTimer.current) {
        clearTimeout(devClickTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    // This effect ensures that when a tab is changed, the view scrolls so that
    // the tab navigation bar is positioned correctly at the top, just below the sticky header.
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    
    if (tabsContainerRef.current) {
      const topOfTabs = tabsContainerRef.current.getBoundingClientRect().top;
      const currentScrollY = window.scrollY;
      const targetScrollY = topOfTabs + currentScrollY - headerHeight;
      
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth',
      });
    }
  }, [activeTab]);

  const handleHideDevTab = () => {
    onToggleDevMode();
    setActiveTab('summary');
  };


  const TabButton = ({ tabId, currentTab, setTab, children }: { tabId: AnalysisTab, currentTab: AnalysisTab, setTab: (id: AnalysisTab) => void, children: React.ReactNode }) => (
    <button
      onClick={() => setTab(tabId)}
      className={`px-4 py-2.5 font-semibold transition-all duration-300 text-center flex items-center justify-center gap-2 rounded-lg text-sm sm:text-base whitespace-nowrap ${
        currentTab === tabId
        ? 'bg-primary text-white shadow-md'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {children}
    </button>
  );

  const availableCardsForComparison = useMemo(() => {
    if (!result) return [];
    
    const allCards = new Set<string>();
    
    // Add user's existing cards
    result.portfolioAnalysis.usageStrategy.forEach(item => {
        if (item.cardToUse && item.cardToUse !== 'None Recommended' && item.cardToUse !== 'Use UPI/Netbanking/Cash') {
            allCards.add(item.cardToUse);
        }
    });

    // Add recommended cards
    result.newRecommendations.forEach(rec => {
        allCards.add(`${rec.issuingBank} ${rec.cardName}`);
    });
    
    // Add all cards from database
    Object.entries(CARD_DATABASE).forEach(([bank, variants]) => {
        variants.forEach(variant => allCards.add(`${bank} ${variant}`));
    });
    Object.entries(DEBIT_CARD_DATABASE).forEach(([bank, variants]) => {
        variants.forEach(variant => allCards.add(`${bank} ${variant}`));
    });

    return Array.from(allCards).sort();
  }, [result]);

  const recommendedCardNamesForComparison = useMemo(() => {
    if (!result) return [];
    return result.newRecommendations.map(rec => `${rec.issuingBank} ${rec.cardName}`);
  }, [result]);
  
  const renderLoadingState = () => (
    <div className="text-center py-20 col-span-full">
        <Spinner />
        <h2 className="mt-4 text-2xl font-semibold text-gray-700">Analyzing your profile...</h2>
        <p className="text-gray-500 mt-2">Our AI is crunching the numbers. This might take a moment.</p>
        <p className="text-sm text-primary font-medium mt-4 h-5 animate-fade-in">{loadingTip}</p>
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center py-20 bg-red-50 border border-red-200 rounded-lg p-6 animate-fade-in col-span-full">
        <h2 className="text-2xl font-semibold text-red-700">Analysis Failed</h2>
        <p className="text-red-600 mt-2">{error}</p>
        <div className="mt-6 flex justify-center gap-4">
        <button onClick={onRefine} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition">Try Again</button>
        </div>
    </div>
  );

  if (isLoading && !result) {
      return renderLoadingState();
  }

  if (error && !result) {
      return renderErrorState();
  }

  if (!result) {
    return (
        <div className="text-center py-20 bg-yellow-50 border border-yellow-200 rounded-lg p-6 animate-fade-in">
            <h2 className="text-2xl font-semibold text-yellow-800">Analysis Incomplete</h2>
            <p className="text-yellow-700 mt-2">We couldn't generate an analysis based on your profile. You may want to refine your preferences.</p>
        </div>
    );
  }

  const { portfolioAnalysis, newRecommendations, developerLog } = result;
  const totalPotentialSavings = newRecommendations.reduce((sum, card) => sum + (card.estimatedAnnualSavings || 0), 0);
  
  const renderSummaryTab = () => (
    <div className="animate-fade-in p-1 md:p-4">
      <div className="flex items-center text-gray-800 mb-4">
        <SparklesIcon className="h-8 w-8 text-primary mr-3" />
        <h2 className="text-3xl font-bold">Your Portfolio Summary</h2>
      </div>
      <div className="text-lg text-gray-600 mb-6 prose max-w-none">
        <MarkdownRenderer content={portfolioAnalysis.summary} />
      </div>

      {newRecommendations && newRecommendations.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 border-l-4 border-primary rounded-r-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in shadow-sm">
          <div className="flex items-center">
            <TrendingUpIcon className="h-10 w-10 text-primary mr-4 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-lg text-gray-800">New Card Recommendations Inside!</h4>
              <p className="text-gray-600">We've found cards that could boost your savings. Explore them now.</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('recommendations')}
            className="self-end sm:self-center px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-transform transform hover:scale-105 whitespace-nowrap flex items-center gap-2"
          >
            <span>View Cards</span>
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center"><CheckCircle2Icon className="h-6 w-6 text-green-500 mr-2" />Strengths</h3>
          <div className="space-y-3">
            {portfolioAnalysis.strengths && portfolioAnalysis.strengths.length > 0 ? (
                portfolioAnalysis.strengths.map((item, i) => (
                    <InsightCard key={`s-${i}`} text={item} icon={<CheckCircle2Icon className="h-5 w-5 text-green-500" />} />
                ))
            ) : (
                <EmptyState message="No specific strengths identified." />
            )}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center"><XCircleIcon className="h-6 w-6 text-red-500 mr-2" />Areas for Improvement</h3>
          <div className="space-y-3">
            {portfolioAnalysis.weaknesses && portfolioAnalysis.weaknesses.length > 0 ? (
                 portfolioAnalysis.weaknesses.map((item, i) => (
                    <InsightCard key={`w-${i}`} text={item} icon={<XCircleIcon className="h-5 w-5 text-red-500" />} />
                ))
           ) : (
            <EmptyState message="No specific areas for improvement found." />
          )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStrategyTab = () => (
     <div className="animate-fade-in p-1 md:p-4">
        <div className="flex items-center text-gray-800 mb-4">
            <LightbulbIcon className="h-8 w-8 text-yellow-500 mr-3"/>
            <h3 className="text-3xl font-bold">Your Optimal Usage Strategy</h3>
        </div>
        <p className="text-lg text-gray-600 mb-6">To maximize savings with your current cards, use them like this:</p>
        {portfolioAnalysis.usageStrategy && portfolioAnalysis.usageStrategy.length > 0 ? (
            <UsageStrategyTable strategy={portfolioAnalysis.usageStrategy} />
        ) : (
            <EmptyState message="No specific usage strategies were generated." />
        )}
        
        {portfolioAnalysis.tipsAndTricks && portfolioAnalysis.tipsAndTricks.length > 0 && (
            <div className="mt-8">
                <h4 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                    <Wand2Icon className="h-6 w-6 text-purple-500 mr-2" />
                    General Tips & Tricks
                </h4>
                <div className="space-y-3">
                    {portfolioAnalysis.tipsAndTricks.map((tip, i) => (
                        <InsightCard key={`t-${i}`} text={tip} icon={<Wand2Icon className="h-5 w-5 text-purple-500" />} />
                    ))}
                </div>
            </div>
        )}
    </div>
  );

  const renderRecommendationsTab = () => (
    <div className="animate-fade-in p-1 md:p-4">
        <div className="flex items-center text-gray-800 mb-2">
            <TrendingUpIcon className="h-8 w-8 text-secondary mr-3" />
            <h2 className="text-3xl font-bold">New Card Recommendations</h2>
        </div>
        {newRecommendations && newRecommendations.length > 0 ? (
            <>
                <p className="text-lg text-gray-600 mb-2">Based on your portfolio gaps, here are cards to boost your savings:</p>
                <p className="text-xl font-bold text-primary mb-8">
                    Potential Additional Annual Savings: ₹{totalPotentialSavings.toLocaleString('en-IN')}
                </p>
                <div className="space-y-8">
                    {newRecommendations.map((rec, index) => (
                        <RecommendationCard key={index} recommendation={rec} />
                    ))}
                </div>
                <div className="mt-10 p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
                    <div className="flex items-center">
                        <ScaleIcon className="h-10 w-10 text-indigo-500 mr-4 flex-shrink-0" />
                        <div>
                        <h4 className="font-bold text-lg text-gray-800">Want a Deeper Dive?</h4>
                        <p className="text-gray-600">Compare these recommendations head-to-head with your existing cards or any other card on the market.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setActiveTab('compare')}
                        className="self-end sm:self-center px-5 py-2.5 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-transform transform hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    >
                        <span>Compare Cards</span>
                        <ArrowRightIcon className="h-4 w-4" />
                    </button>
                </div>
            </>
        ) : (
            <EmptyState message="No new card recommendations based on your current profile. Your portfolio seems optimized for your goals!" />
        )}
    </div>
  );

  const renderDeveloperTab = () => (
    <div className="animate-fade-in p-1 md:p-4">
      <div className="flex justify-between items-center text-gray-800 mb-4">
        <div className="flex items-center">
            <TerminalIcon className="h-8 w-8 text-slate-500 mr-3" />
            <h2 className="text-3xl font-bold">Developer Mode</h2>
        </div>
        <button
          onClick={handleHideDevTab}
          className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition text-sm"
        >
          Hide Developer Tab
        </button>
      </div>
      <p className="text-lg text-gray-600 mb-6">
        This tab shows the detailed reasoning from the AI for the analysis.
      </p>
      <div className="bg-slate-900 text-slate-300 rounded-lg p-4 font-mono text-xs overflow-x-auto max-h-[60vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-slate-100 mb-2 border-b border-slate-700 pb-2">AI Developer Log</h3>
        <pre className="whitespace-pre-wrap break-words">{developerLog || 'No developer log available.'}</pre>
      </div>
    </div>
  );


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg relative">
                {isLoading && <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center rounded-xl z-10"><Spinner/></div>}
                
                <div className="p-2 bg-gray-100 rounded-t-xl border-b border-gray-200" ref={tabsContainerRef}>
                    <div className="overflow-x-auto -mb-2 pb-2">
                        <div className="flex gap-2">
                            <TabButton tabId="summary" currentTab={activeTab} setTab={setActiveTab}><ClipboardListIcon className="h-5 w-5" />Summary</TabButton>
                            <TabButton tabId="strategy" currentTab={activeTab} setTab={setActiveTab}><LightbulbIcon className="h-5 w-5" />Usage Strategy</TabButton>
                            <TabButton tabId="recommendations" currentTab={activeTab} setTab={setActiveTab}><TrendingUpIcon className="h-5 w-5" />New Cards</TabButton>
                            <TabButton tabId="compare" currentTab={activeTab} setTab={setActiveTab}><ScaleIcon className="h-5 w-5" />Compare Cards</TabButton>
                            {isDevMode && <TabButton tabId="developer" currentTab={activeTab} setTab={setActiveTab}><TerminalIcon className="h-5 w-5" />Developer</TabButton>}
                        </div>
                    </div>
                </div>

                <div className="p-4 md:p-8">
                    {activeTab === 'summary' && renderSummaryTab()}
                    {activeTab === 'strategy' && renderStrategyTab()}
                    {activeTab === 'recommendations' && renderRecommendationsTab()}
                    {activeTab === 'compare' && (
                        <CompareCardsTab
                            availableCards={availableCardsForComparison}
                            onCompare={onCompare}
                            result={comparisonResult}
                            isLoading={isComparing}
                            error={comparisonError}
                            preselectedCards={recommendedCardNamesForComparison}
                        />
                    )}
                    {activeTab === 'developer' && renderDeveloperTab()}
                </div>
            </div>
            <div className="mt-8 flex justify-center gap-4 animate-fade-in">
                <button onClick={onRefine} className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">Refine Form</button>
            </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="sticky top-8">
                {/* Portfolio Snapshot */}
                <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
                    <div onClick={handleDevModeClick}>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <BarChartIcon className="h-6 w-6 text-primary mr-2" />
                            Portfolio Snapshot
                        </h3>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-4">
                            <BarChartIcon className="h-8 w-8 text-blue-500"/>
                            <div>
                                <p className="text-sm text-blue-800 font-semibold">Portfolio Rating</p>
                                <p className="text-lg font-bold text-blue-900">{portfolioAnalysis.portfolioRating}</p>
                            </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg flex items-center gap-4">
                             <IndianRupeeIcon className="h-8 w-8 text-green-600"/>
                             <div>
                                 <p className="text-sm text-green-800 font-semibold">Current Annual Savings</p>
                                 <p className="text-lg font-bold text-green-900">₹{portfolioAnalysis.estimatedAnnualSavings.toLocaleString('en-IN')}</p>
                             </div>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-lg flex items-center gap-4">
                             <TrendingUpIcon className="h-8 w-8 text-emerald-600"/>
                             <div>
                                 <p className="text-sm text-emerald-800 font-semibold">Potential New Savings</p>
                                 <p className="text-lg font-bold text-emerald-900">₹{totalPotentialSavings.toLocaleString('en-IN')}</p>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Chatbot */}
                <div className="mt-8">
                    <Chatbot 
                        history={chatHistory}
                        isLoading={isChatLoading}
                        onSendMessage={onSendMessage}
                        onReanalysis={onReanalysis}
                        placeholder={chatPlaceholder}
                        highlightChat={highlightChat}
                    />
                </div>
            </div>
        </div>
    </div>
  );
};

export default PortfolioAnalysis;