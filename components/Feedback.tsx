
import React, { useState, Fragment } from 'react';
import { FeedbackData } from '../types';
import { StarIcon, MessageSquareIcon, XIcon } from './icons';

interface FeedbackProps {
  onSubmit: (data: FeedbackData) => Promise<{ success: boolean; message: string }>;
}

const Feedback: React.FC<FeedbackProps> = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [wasSuccessful, setWasSuccessful] = useState(false);

  const canSubmit = (rating > 0 || text.trim().length > 0) && email.trim().length > 0 && !isSubmitting;

  const resetForm = () => {
    setRating(0);
    setText('');
    setEmail('');
    setIsSubmitting(false);
    setSubmitMessage('');
    setWasSuccessful(false);
  };

  const handleOpen = () => {
    resetForm();
    setIsOpen(true);
  };
  
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setSubmitMessage('');

    const feedbackData: FeedbackData = {
      rating,
      text: text.trim(),
      email: email.trim(),
    };

    const result = await onSubmit(feedbackData);
    
    setSubmitMessage(result.message);
    setWasSuccessful(result.success);
    setIsSubmitting(false);

    if (result.success) {
      setTimeout(() => {
        handleClose();
      }, 2000); // Close modal after 2 seconds on success
    }
  };

  return (
    <Fragment>
      {/* Floating Action Button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-transform transform hover:scale-110"
        aria-label="Give Feedback"
      >
        <MessageSquareIcon className="h-6 w-6" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in" aria-modal="true" role="dialog">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative animate-slide-in-up">
            <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Close">
              <XIcon className="h-6 w-6" />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Share your Feedback</h2>
              <p className="text-gray-600 mb-6">We value your thoughts! Let us know how we can improve.</p>

              {wasSuccessful ? (
                <div className="text-center py-10">
                    <p className="text-lg font-semibold text-green-600">{submitMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How would you rate your experience?
                    </label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <StarIcon
                            className={`h-8 w-8 transition-colors ${
                              star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                            }`}
                            fill={star <= rating ? 'currentColor' : 'none'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Feedback */}
                  <div>
                    <label htmlFor="feedback-text" className="block text-sm font-medium text-gray-700 mb-2">
                      Your feedback
                    </label>
                    <textarea
                      id="feedback-text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="What did you like or dislike? How can we improve?"
                      rows={5}
                      className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  {/* Email */}
                  <div>
                      <label htmlFor="feedback-email" className="block text-sm font-medium text-gray-700">Your email (required)</label>
                      <input
                        id="feedback-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="mt-1 w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                  </div>
                  
                  {/* Submission */}
                  <div className="pt-4 text-right">
                    {submitMessage && !wasSuccessful && (
                        <p className="text-sm text-red-600 text-left mb-2">{submitMessage}</p>
                    )}
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="px-6 py-2.5 bg-secondary text-white font-bold rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Feedback;
