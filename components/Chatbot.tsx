
import React, { useState, useRef, useEffect } from 'react';
import { ChatbotProps } from '../types';
import { SendIcon, BotMessageSquareIcon, UserCheckIcon } from './icons';
import MarkdownRenderer from './MarkdownRenderer';

const Chatbot: React.FC<ChatbotProps> = ({ history, isLoading, onSendMessage, onReanalysis, placeholder, highlightChat }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Using { block: 'nearest' } prevents the entire page from scrolling down
    // when the chatbot's content is updated. It only scrolls the nearest scrollable ancestor.
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 animate-fade-in flex flex-col ${highlightChat ? 'animate-pulse-once' : ''}`}>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center flex-shrink-0">
        <BotMessageSquareIcon className="h-6 w-6 text-primary mr-2" />
        Refine with AI Chat
      </h3>
      
      <div className="overflow-y-auto mb-4 pr-2" style={{ maxHeight: '45vh' }}>
        <div className="space-y-4">
            {history.map((msg) => (
            <div key={msg.id} className="space-y-2">
                <div className={`flex items-start gap-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'model' && <BotMessageSquareIcon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />}
                <div className={`max-w-md p-3 rounded-lg ${
                    msg.role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}>
                    {msg.role === 'model' ? <MarkdownRenderer content={msg.text} /> : <p className="text-sm">{msg.text}</p>}
                </div>
                {msg.role === 'user' && <UserCheckIcon className="h-6 w-6 text-gray-500 flex-shrink-0 mt-1" />}
                </div>
                {msg.offerReanalysis && !isLoading && (
                <div className="flex justify-start pl-9">
                    <button
                    onClick={onReanalysis}
                    className="px-4 py-1.5 bg-secondary text-white font-semibold text-sm rounded-lg hover:bg-green-600 transition"
                    >
                    Yes, Update My Analysis
                    </button>
                </div>
                )}
            </div>
            ))}
            {isLoading && (
                <div className="flex items-start gap-3">
                    <BotMessageSquareIcon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div className="max-w-md p-3 rounded-lg bg-gray-200 text-gray-800">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 bg-primary rounded-full animate-bounce"></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-primary text-white p-3 rounded-lg hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center transition"
        >
          <SendIcon className="h-6 w-6" />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;