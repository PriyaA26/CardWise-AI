# Milestone: MVP (Minimum Viable Product) - 2025-08-13

This document marks the state of the **India Card Advisor AI** as of its MVP release. This version is considered feature-complete for its initial launch and serves as a stable baseline for future development.

## Core Features at MVP

The application provides a comprehensive, end-to-end user journey for personalized financial advice on Indian credit and debit cards.

### 1. User Onboarding & Data Collection
- A guided, multi-step form to collect user data:
    - **Welcome:** An engaging introduction to the tool's capabilities.
    - **Demographics:** Salary and City to determine card eligibility.
    - **Existing Cards:** An intuitive interface to add current credit and debit cards, including their annual fees and LTF status.
    - **Monthly Spending:** A detailed breakdown of expenses across various categories, using a combination of sliders and manual input for accuracy.
    - **Card Preferences:** A clear choice between an AI-driven recommendation or user-selected goals, along with fee comfort levels.
- All user data is persisted in the browser's `localStorage` for seamless reloads and continued sessions.

### 2. AI-Powered Analysis & Results
- A sophisticated, multi-column analysis dashboard that presents the AI's findings.
- **Portfolio Snapshot:** A persistent sidebar showing the overall portfolio rating and estimated annual savings at a glance.
- **Analysis Tabs:**
    - **Summary:** A high-level overview of the portfolio, including a narrative summary, strengths, and areas for improvement.
    - **Usage Strategy:** A clear, actionable table advising which existing card to use for each spending category, including a "Net Gain Analysis" to recommend UPI/Cash when card fees outweigh rewards.
    - **New Recommendations:** Detailed recommendation cards for new products that fill gaps in the user's portfolio, complete with estimated additional savings, key benefits, and pro tips.
    - **Compare Cards:** A powerful, on-demand feature allowing users to compare any 2 or 3 cards (existing, recommended, or from the database) in a personalized, side-by-side table.

### 3. Interactive AI Chatbot
- A persistent chat interface available on the analysis screen.
- **Contextual Conversation:** The chat is primed with the user's profile and allows for follow-up questions on the analysis or comparisons.
- **Intelligent Re-analysis:** The AI can detect when a user's request warrants a full re-analysis and offers to update the results, creating a "human-in-the-loop" refinement process.
- **Contextual Nudges:** The chat placeholder text updates dynamically to guide the user on what they can ask next, avoiding intrusive pop-ups.

### 4. Developer & UX Polish
- **Robust Data Handling:** A data migration system ensures backward compatibility with data saved from previous versions of the tool.
- **UI/UX Best Practices:** The application incorporates modern UI elements, tooltips for guidance, logical grouping of information, and responsive design for both mobile and desktop.
- **Developer Mode:** A hidden "Developer" tab to inspect the raw AI output for debugging and transparency.

This MVP version represents a stable, valuable, and user-friendly tool ready for its initial audience.
