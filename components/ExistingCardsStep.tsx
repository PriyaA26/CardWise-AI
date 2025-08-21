
import React, { useState, useEffect } from 'react';
import { UserProfile, CardInfo } from '../types';
import { BANKS, CARD_DATABASE, DEBIT_CARD_DATABASE, COMMON_ANNUAL_FEES, CARD_FEES, FEATURE_FLAG_DEBIT_CARDS_ENABLED, CREDIT_SCORE_PROVIDERS } from '../constants';
import { PlusCircleIcon, Trash2Icon, InfoIcon } from './icons';

interface ExistingCardsStepProps {
  data: Pick<UserProfile, 'creditCards' | 'debitCards' | 'creditScore' | 'creditScoreProvider'>;
  onUpdate: <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

interface CardInputProps {
    card: CardInfo;
    onUpdate: (card: CardInfo) => void;
    onRemove: () => void;
    cardType: 'credit' | 'debit';
}

const Tooltip: React.FC<{ text: string, children: React.ReactNode }> = ({ text, children }) => (
    <div className="relative flex items-center group">
        {children}
        <div className="absolute left-0 bottom-full mb-2 w-max max-w-xs p-2 text-sm text-white bg-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            {text}
        </div>
    </div>
);

const CardInput: React.FC<CardInputProps> = ({ card, onUpdate, onRemove, cardType }) => {
    const [customFeeString, setCustomFeeString] = useState('');
    const [isCustomFee, setIsCustomFee] = useState(false);

    useEffect(() => {
        const isInitiallyCustom = card.annualFee > 0 && !COMMON_ANNUAL_FEES.includes(card.annualFee);
        if (isInitiallyCustom) {
            setIsCustomFee(true);
            setCustomFeeString(card.annualFee.toString());
        } else {
            setIsCustomFee(false);
            setCustomFeeString('');
        }
    }, [card.annualFee]);
    
    const handleBankChange = (bank: string) => {
        onUpdate({ ...card, bank, variant: '', isLTF: false, annualFee: 0 });
    }

    const handleVariantChange = (variant: string) => {
        const feeKey = `${card.bank} ${variant}`;
        const defaultFee = CARD_FEES[feeKey];
        const newCardData: CardInfo = { ...card, variant };

        if (defaultFee !== undefined) {
            newCardData.annualFee = defaultFee;
            newCardData.isLTF = defaultFee === 0;
        }
        
        onUpdate(newCardData);
    };

    const handleLtfChange = (isLTF: boolean) => {
        onUpdate({ ...card, isLTF, annualFee: isLTF ? 0 : card.annualFee });
    };

    const handleFeeSelect = (value: string) => {
        if (value === 'other') {
            setIsCustomFee(true);
            setCustomFeeString('');
            onUpdate({ ...card, annualFee: 0, isLTF: false });
        } else {
            const fee = parseInt(value, 10);
            setIsCustomFee(false);
            onUpdate({ ...card, annualFee: fee, isLTF: fee === 0 });
        }
    };

    const handleCustomFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^[0-9]+$/.test(value)) {
            setCustomFeeString(value);
            onUpdate({ ...card, annualFee: value === '' ? 0 : parseInt(value, 10), isLTF: false });
        }
    };

    const cardDb = cardType === 'credit' ? CARD_DATABASE : DEBIT_CARD_DATABASE;
    const availableVariants = card.bank ? cardDb[card.bank] || [] : [];
    const feeSelectValue = isCustomFee ? 'other' : card.annualFee.toString();

    return (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4 animate-fade-in">
            <div className="flex flex-wrap items-end gap-4">
                <div className="flex-grow min-w-[180px] md:flex-grow-0 md:w-48">
                    <label htmlFor={`bank-${card.id}`} className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
                    <select id={`bank-${card.id}`} value={card.bank} onChange={(e) => handleBankChange(e.target.value)} className="w-full pl-3 pr-10 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                        <option value="" disabled>Select Bank</option>
                        {BANKS.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                    </select>
                </div>
                <div className="flex-grow min-w-[180px] md:flex-grow-0 md:w-56">
                    <label htmlFor={`variant-${card.id}`} className="block text-sm font-medium text-gray-700 mb-1">Card Variant</label>
                    <select id={`variant-${card.id}`} value={card.variant} onChange={(e) => handleVariantChange(e.target.value)} className="w-full pl-3 pr-10 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" disabled={!card.bank}>
                        <option value="" disabled>Select Variant</option>
                        {availableVariants.map(variant => <option key={variant} value={variant}>{variant}</option>)}
                        {card.bank && availableVariants.length === 0 && <option value="" disabled>No {cardType} cards listed</option>}
                    </select>
                </div>
                <div className="flex items-end gap-2 flex-wrap">
                    <div>
                        <label htmlFor={`fee-select-${card.id}`} className="block text-sm font-medium text-gray-700 mb-1">Annual Fee (₹)</label>
                        <select id={`fee-select-${card.id}`} value={feeSelectValue} onChange={(e) => handleFeeSelect(e.target.value)} className="w-32 pl-3 pr-10 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary disabled:bg-gray-200" disabled={card.isLTF}>
                            {COMMON_ANNUAL_FEES.map(fee => <option key={fee} value={fee}>{fee === 0 ? "0 (Free)" : `₹${fee}`}</option>)}
                            <option value="other">Other...</option>
                        </select>
                    </div>
                    {isCustomFee && !card.isLTF && (
                        <div className="animate-fade-in">
                             <input id={`fee-custom-${card.id}`} type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Custom" value={customFeeString} onChange={handleCustomFeeChange} className="w-24 p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" autoFocus />
                        </div>
                    )}
                </div>
                <div className="flex items-center pb-3">
                    <input id={`ltf-${card.id}`} type="checkbox" checked={card.isLTF} onChange={(e) => handleLtfChange(e.target.checked)} className="h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary" />
                    <label htmlFor={`ltf-${card.id}`} className="ml-2 text-sm font-medium text-gray-700 whitespace-nowrap">Lifetime Free (LTF)</label>
                </div>
                <div className="ml-auto flex-shrink-0 pb-3">
                    <button onClick={onRemove} className="text-red-500 hover:text-red-700 transition" title="Remove Card">
                        <Trash2Icon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const ExistingCardsStep: React.FC<ExistingCardsStepProps> = ({ data, onUpdate, onNext, onBack }) => {
  const { creditCards, debitCards, creditScore, creditScoreProvider } = data;
  const [knowsCreditScore, setKnowsCreditScore] = useState(data.creditScoreProvider !== '' || data.creditScore !== 750);

  const handleKnowsScoreToggle = (knows: boolean) => {
    setKnowsCreditScore(knows);
    if (!knows) {
        // Reset to default optional state when user opts out
        onUpdate('creditScore', 750);
        onUpdate('creditScoreProvider', '');
    }
  };

  const addCard = (type: 'creditCards' | 'debitCards') => {
    const newCard: CardInfo = { id: Date.now().toString() + Math.random(), bank: '', variant: '', annualFee: 0, isLTF: false };
    onUpdate(type, [...data[type], newCard]);
  };
  
  const updateCard = (type: 'creditCards' | 'debitCards', updatedCard: CardInfo) => {
    onUpdate(type, data[type].map(c => c.id === updatedCard.id ? updatedCard : c));
  };
  
  const removeCard = (type: 'creditCards' | 'debitCards', id: string) => {
    onUpdate(type, data[type].filter(c => c.id !== id));
  };

  const isCardIncomplete = (card: CardInfo) => !card.bank || !card.variant;
  
  const handleScoreChange = (value: string) => {
    const score = parseInt(value, 10);
    if (!isNaN(score)) {
        onUpdate('creditScore', score);
    }
  };

  const hasIncompleteCards = creditCards.some(isCardIncomplete) || (FEATURE_FLAG_DEBIT_CARDS_ENABLED && debitCards.some(isCardIncomplete));
  const hasIncompleteCreditScore = knowsCreditScore && (creditScore < 300 || creditScore > 900);
  const canProceed = !hasIncompleteCards && !hasIncompleteCreditScore;


  const AddCardButton: React.FC<{ onClick: () => void, label: string }> = ({ onClick, label }) => (
    <button
      onClick={onClick}
      className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
    >
      <PlusCircleIcon className="w-5 h-5 mr-2 text-primary" /> {label}
    </button>
  );

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-slide-in-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Your Financial Profile</h2>
      <p className="text-gray-600 mb-6">Let's get a picture of your current financial tools.</p>
      
      <div className="space-y-8">
        {/* Credit Score Section */}
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Credit Score (Optional)</h3>
            <div className="flex items-center mb-4">
                <input
                    id="knowsCreditScore"
                    type="checkbox"
                    checked={knowsCreditScore}
                    onChange={(e) => handleKnowsScoreToggle(e.target.checked)}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <label htmlFor="knowsCreditScore" className="ml-2 block text-sm font-medium text-gray-700">
                    I know my credit score
                </label>
            </div>
            {knowsCreditScore && (
                <div className="space-y-6 pt-4 animate-fade-in">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <label htmlFor="creditScore" className="block text-sm font-medium text-gray-700">
                            Your Score
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
                                value={creditScore}
                                onChange={(e) => handleScoreChange(e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            <input 
                                type="number" 
                                id="creditScore"
                                value={creditScore}
                                onChange={(e) => handleScoreChange(e.target.value)}
                                className="w-24 p-2 text-center font-semibold text-primary bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="creditScoreProvider" className="block text-sm font-medium text-gray-700 mb-1">
                            Score Provider
                        </label>
                        <select
                            id="creditScoreProvider"
                            value={creditScoreProvider}
                            onChange={(e) => onUpdate('creditScoreProvider', e.target.value)}
                            className={`w-full pl-3 pr-10 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                            creditScoreProvider ? 'text-gray-800' : 'text-gray-500'
                            }`}
                        >
                            <option value="">Select a provider (optional)</option>
                            {CREDIT_SCORE_PROVIDERS.map((provider) => (
                            <option key={provider} value={provider}>{provider}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Credit Cards</h3>
          {creditCards.length > 0 ? creditCards.map(card => <CardInput key={card.id} card={card} cardType="credit" onUpdate={(c) => updateCard('creditCards', c)} onRemove={() => removeCard('creditCards', card.id)} />) : <p className="text-sm text-gray-500 mb-4">No credit cards added.</p>}
          <AddCardButton onClick={() => addCard('creditCards')} label={creditCards.length > 0 ? 'Add Another Credit Card' : 'Add Credit Card'} />
        </div>

        {FEATURE_FLAG_DEBIT_CARDS_ENABLED && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Debit Cards</h3>
            {debitCards.length > 0 ? debitCards.map(card => <CardInput key={card.id} card={card} cardType="debit" onUpdate={(c) => updateCard('debitCards', c)} onRemove={() => removeCard('debitCards', card.id)} />) : <p className="text-sm text-gray-500 mb-4">No debit cards added.</p>}
            <AddCardButton onClick={() => addCard('debitCards')} label={debitCards.length > 0 ? 'Add Another Debit Card' : 'Add Debit Card'} />
          </div>
        )}
      </div>
      
      <div className="mt-8">
        <div className="flex justify-between items-center">
            <button onClick={onBack} className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">
                Back
            </button>
            <div className="flex items-center gap-4">
                {(hasIncompleteCards || hasIncompleteCreditScore) && (
                <p className="hidden md:block text-sm text-red-600 font-medium animate-fade-in">
                    {hasIncompleteCards ? 'Please complete all card details.' : 'Credit score must be between 300 and 900.'}
                </p>
                )}
                <button
                onClick={onNext}
                disabled={!canProceed}
                className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                Next
                </button>
            </div>
        </div>
        {(hasIncompleteCards || hasIncompleteCreditScore) && (
            <p className="md:hidden text-center text-sm text-red-600 font-medium animate-fade-in mt-4">
                 {hasIncompleteCards ? 'Please complete all card details.' : 'Credit score must be between 300 and 900.'}
            </p>
        )}
      </div>
    </div>
  );
};

export default ExistingCardsStep;