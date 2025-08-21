
export enum OnboardingStep {
  Welcome,
  Demographics,
  ExistingCards,
  Expenses,
  NewCardPrefs,
  Analysis,
}

export interface CardInfo {
  id: string;
  bank: string;
  variant: string;
  annualFee: number;
  isLTF: boolean;
}

export interface ExpenseCategorySplit {
  total: number;
  upi: number;
}

export interface ExpenseProfile {
  onlineShopping: ExpenseCategorySplit;
  offlineShopping: ExpenseCategorySplit;
  travel: ExpenseCategorySplit;
  fuel: ExpenseCategorySplit;
  utilities: ExpenseCategorySplit;
  entertainment: ExpenseCategorySplit;
  dining: ExpenseCategorySplit;
  health: ExpenseCategorySplit;
  cashWithdrawals: ExpenseCategorySplit;
  rent: ExpenseCategorySplit;
  societyMaintenance: ExpenseCategorySplit;
  insurance: ExpenseCategorySplit;
  other: ExpenseCategorySplit;
}

export interface NewCardPreferences {
  primaryGoal: string[];
  feeComfort: string;
  cardType: 'Credit' | 'Debit' | 'Either';
  additionalInfo: string;
}

export interface UserProfile {
  salary: string;
  city: string;
  otherCity?: string;
  creditScore: number;
  creditScoreProvider: string;
  creditCards: CardInfo[];
  debitCards: CardInfo[];
  expenses: ExpenseProfile;
  preferences: NewCardPreferences;
}

export interface SpendingSwitchSuggestion {
    category: string;
    amount: number;
    reason: string;
}

export interface Recommendation {
  cardName: string;
  issuingBank: string;
  recommendationReason:string;
  keyBenefits: string[];
  annualFee: string;
  eligibility: string;
  estimatedAnnualSavings: number;
  spendingToSwitch: SpendingSwitchSuggestion[];
  tipsAndTricks: string[];
}

export interface UsageStrategyItem {
    category: string;
    cardToUse: string;
    reason: string;
    trick?: string;
}

export interface PortfolioAnalysisResult {
    portfolioRating: string;
    summary: string;
    estimatedAnnualSavings: number;
    strengths: string[];
    weaknesses: string[];
    usageStrategy: UsageStrategyItem[];
    tipsAndTricks: string[];
}

export interface ComprehensiveAnalysis {
    portfolioAnalysis: PortfolioAnalysisResult;
    newRecommendations: Recommendation[];
    developerLog?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  id: string;
  offerReanalysis?: boolean;
}

export interface ComparisonTableRow {
    parameter: string;
    values: string[];
}

export interface ComparisonSummaryPoint {
    cardName: string;
    type: 'Pro' | 'Con';
    point: string;
}

export interface CardComparisonResult {
    comparisonTable: ComparisonTableRow[];
    summary: ComparisonSummaryPoint[];
    recommendation: string;
}

export interface ChatbotProps {
  history: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onReanalysis: () => void;
  placeholder: string;
  highlightChat: boolean;
}


export interface PortfolioAnalysisProps {
  result: ComprehensiveAnalysis | null;
  isLoading: boolean;
  error: string | null;
  loadingTip: string;
  onRefine: () => void;
  chatHistory: ChatMessage[];
  isChatLoading: boolean;
  onSendMessage: (message: string) => void;
  onReanalysis: () => void;
  onCompare: (cards: string[]) => Promise<void>;
  comparisonResult: CardComparisonResult | null;
  isComparing: boolean;
  comparisonError: string | null;
  chatPlaceholder: string;
  highlightChat: boolean;
  isDevMode: boolean;
  onToggleDevMode: () => void;
  reanalysisCount: number;
}

export interface FeedbackData {
  rating: number;
  text: string;
  email: string;
}
