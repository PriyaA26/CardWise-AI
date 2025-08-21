import { FeedbackData } from '../types';

/**
 * Submits feedback data.
 *
 * IMPORTANT SECURITY NOTE:
 * Sending email directly from a client-side application (like this one) is not secure
 * because it would require exposing API keys or email credentials to the user's browser.
 *
 * The correct and secure architecture is to send the feedback data from the client
 * to a backend server via a secure API endpoint (e.g., POST /api/feedback).
 * The backend server would then be responsible for sending the email.
 * This ensures that all credentials remain private on the server.
 *
 * This function simulates that client-to-backend API call.
 * In a real application, this function would contain:
 *
 * const response = await fetch('/api/feedback', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify(feedbackData)
 * });
 *
 * The backend would then receive this data and use a service (like Nodemailer, SendGrid, etc.)
 * to send an email to the designated recipient (spri@google.com).
 */
export const submitFeedback = async (
  feedbackData: FeedbackData
): Promise<{ success: boolean; message: string }> => {
  console.log('--- Simulating Feedback Submission to Backend ---');
  console.log('Recipient would be: spri@google.com');
  console.log('Data being sent:');
  console.log('Rating:', feedbackData.rating);
  console.log('Text:', feedbackData.text);
  console.log('Sender Email:', feedbackData.email);
  console.log('---------------------------------------------');

  // Simulate network delay of an API call
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real scenario, you would handle potential errors from the API.
  // For now, we'll always assume the simulated API call is successful.
  return {
    success: true,
    message: 'Feedback submitted successfully. Thank you!',
  };
};
