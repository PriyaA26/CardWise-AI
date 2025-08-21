import React, { useState, useRef, useEffect } from 'react';
import { CreditCardIcon, RefreshCwIcon } from './icons';
import { FEATURE_FLAG_DEBIT_CARDS_ENABLED } from '../constants';

interface HeaderProps {
    onStartOver?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onStartOver }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const confirmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelConfirmation = () => {
    if (confirmTimeoutRef.current) {
      clearTimeout(confirmTimeoutRef.current);
      confirmTimeoutRef.current = null;
    }
    setIsConfirming(false);
  };

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (confirmTimeoutRef.current) {
        clearTimeout(confirmTimeoutRef.current);
      }
    };
  }, []);

  const handleStartOverClick = () => {
    if (!onStartOver) return;

    if (isConfirming) {
      onStartOver();
      cancelConfirmation();
    } else {
      setIsConfirming(true);
      confirmTimeoutRef.current = setTimeout(() => {
        setIsConfirming(false);
      }, 4000); // Revert after 4 seconds
    }
  };
  
  const buttonClass = isConfirming
        ? 'bg-red-500 hover:bg-red-600 text-white'
        : 'bg-gray-200 hover:bg-gray-300 text-gray-700';


  return (
    <header className="bg-gray-100 shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
            <CreditCardIcon className="h-8 w-8 text-primary" />
            <h1 className="ml-3 text-2xl font-bold text-gray-800">
              CardWise <span className="text-primary">AI</span>
            </h1>
        </div>
        {onStartOver && (
            <button 
                onClick={handleStartOverClick}
                onMouseLeave={isConfirming ? cancelConfirmation : undefined}
                className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg transition text-sm ${buttonClass}`}
                title={isConfirming ? "Click again to confirm starting over" : "Start Over"}
            >
                <RefreshCwIcon className="w-4 h-4" />
                <span>{isConfirming ? "Confirm?" : "Start Over"}</span>
            </button>
        )}
      </div>
    </header>
  );
};

export default Header;