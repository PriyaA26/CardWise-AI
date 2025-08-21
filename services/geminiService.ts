

import { GoogleGenAI, Type, Chat } from "@google/genai";
import { UserProfile, ComprehensiveAnalysis, ChatMessage, CardComparisonResult } from "../types";
import { CARD_DATABASE, CARD_TIPS, FEATURE_FLAG_DEBIT_CARDS_ENABLED } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const REANALYZE_TOKEN = "[REANALYZE_SUGGESTION]";

const usageStrategySchema = {
    type: Type.OBJECT,
    properties: {
        category: { type: Type.STRING, description: "The spending category (e.g., 'Online Shopping')." },
        cardToUse: { type: Type.STRING, description: "The specific existing card to use for this category (e.g., 'HDFC Diners Club Black'). If no existing card is good, state 'None Recommended'. If using any card is a net loss, state 'Use UPI/Netbanking/Cash'." },
        reason: { type: Type.STRING, description: "A brief reason for the recommendation (e.g., 'To get 5% cashback.' or 'To avoid net loss from 2% convenience fee.')." },
        trick: { type: Type.STRING, description: "An optional advanced trick for this category (e.g., 'Load Amazon Pay wallet to get 5x points, then pay bills.'). Leave empty if no trick applies."}
    },
    required: ["category", "cardToUse", "reason"]
};

const portfolioAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        portfolioRating: { type: Type.STRING, description: "A one-word rating for the user's current card portfolio (e.g., 'Excellent', 'Good', 'Average', 'Needs Improvement')." },
        summary: { type: Type.STRING, description: "A concise summary of the current portfolio's performance. Use short sentences and newlines for paragraphs. Use bullet points starting with '-' for lists. If new cards are recommended, you may briefly mention that new cards could improve their savings, but do NOT explicitly instruct the user to go to another tab. The UI will handle that call-to-action separately. Avoid long blocks of text." },
        estimatedAnnualSavings: { type: Type.NUMBER, description: "An estimated total amount in INR the user is currently saving annually with their existing cards, AFTER DEDUCTING annual fees." },
        strengths: {
            type: Type.ARRAY,
            description: "A list of 2-3 key strengths of the current portfolio, written as short, bullet-point-like sentences.",
            items: { type: Type.STRING }
        },
        weaknesses: {
            type: Type.ARRAY,
            description: "A list of 2-3 key weaknesses or gaps in the current portfolio, written as short, bullet-point-like sentences.",
            items: { type: Type.STRING }
        },
        usageStrategy: {
            type: Type.ARRAY,
            description: "A list of strategies for the user to maximize savings with their existing cards. For each major spending category where the user has expenses, recommend which of their *existing* cards they should use and why.",
            items: usageStrategySchema
        },
        tipsAndTricks: {
            type: Type.ARRAY,
            description: "A list of 2-3 general, advanced tips for the user's existing portfolio, such as using specific platform vouchers.",
            items: { type: Type.STRING }
        },
    },
    required: ["portfolioRating", "summary", 'estimatedAnnualSavings', "strengths", "weaknesses", "usageStrategy", "tipsAndTricks"]
};

const spendingSwitchSuggestionSchema = {
    type: Type.OBJECT,
    properties: {
        category: { type: Type.STRING, description: "The specific spending category from the user's profile to switch (e.g., 'Online Shopping', 'UPI Payments on Dining')." },
        amount: { type: Type.NUMBER, description: "The amount from that spending category that should be switched." },
        reason: { type: Type.STRING, description: "A brief, compelling reason why switching this spend to the new card is beneficial (e.g., 'to earn 5% cashback instead of 0% on UPI')." }
    },
    required: ["category", "amount", "reason"]
};

const recommendationSchema = {
  type: Type.OBJECT,
  properties: {
    cardName: { type: Type.STRING, description: "The name of the recommended card, e.g., 'Millennia'. MUST be one of the card names from the provided database for the specified bank." },
    issuingBank: { type: Type.STRING, description: "The name of the bank issuing the card, e.g., 'HDFC Bank'." },
    recommendationReason: { type: Type.STRING, description: "A personalized explanation of why this card is a good fit. Use short sentences. Use **double asterisks** to bold key terms. For example: 'This card is excellent for your **online shopping** expenses.'" },
    keyBenefits: {
      type: Type.ARRAY,
      description: "A list of 3-5 key benefits most relevant to the user's profile.",
      items: { type: Type.STRING }
    },
    annualFee: { type: Type.STRING, description: "Annual fee details, including any waiver conditions. E.g., '₹499 + GST (Waived on spending ₹1,00,000 annually)'." },
    eligibility: { type: Type.STRING, description: "A brief summary of the eligibility criteria, such as minimum salary. E.g., 'Minimum monthly net salary of ₹30,000.'" },
    estimatedAnnualSavings: { type: Type.NUMBER, description: "An estimated additional amount in INR the user could save annually by using this card, based on their spending profile." },
    spendingToSwitch: {
        type: Type.ARRAY,
        description: "An actionable plan telling the user which expenses to move to this new card. Identify 1-2 key spending categories from the user's profile to switch.",
        items: spendingSwitchSuggestionSchema
    },
    tipsAndTricks: {
        type: Type.ARRAY,
        description: "A list of 2-3 advanced tips for this specific recommended card. These MUST be taken from the provided Card-Specific Tips Database.",
        items: { type: Type.STRING }
    }
  },
  required: ["cardName", "issuingBank", "recommendationReason", "keyBenefits", "annualFee", "eligibility", 'estimatedAnnualSavings', "spendingToSwitch", "tipsAndTricks"]
};

const comprehensiveAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        portfolioAnalysis: portfolioAnalysisSchema,
        newRecommendations: {
            type: Type.ARRAY,
            items: recommendationSchema
        },
        developerLog: {
            type: Type.STRING,
            description: "A detailed, step-by-step developer-focused log explaining the reasoning behind the analysis and recommendations. Use markdown for formatting, including headers, lists, and bold text. Be technical and thorough."
        }
    },
    required: ["portfolioAnalysis", "newRecommendations"]
};

const comparisonTableRowSchema = {
    type: Type.OBJECT,
    properties: {
        parameter: { type: Type.STRING, description: "The comparison parameter, e.g., 'Annual Fee', 'Online Shopping Cashback', 'Lounge Access'." },
        values: {
            type: Type.ARRAY,
            description: "A list of values for the parameter, one for each card being compared, in the same order as the input cards. If a value is not applicable, use 'N/A'.",
            items: { type: Type.STRING }
        }
    },
    required: ["parameter", "values"]
};

const comparisonSummaryPointSchema = {
    type: Type.OBJECT,
    properties: {
        cardName: { type: Type.STRING, description: "The full name of the card this point applies to (e.g., 'Axis Bank Ace')." },
        type: { type: Type.STRING, enum: ['Pro', 'Con'], description: "Whether this point is a Pro or a Con for the user." },
        point: { type: Type.STRING, description: "The specific pro or con as a short, clear sentence, personalized to the user's spending." }
    },
    required: ["cardName", "type", "point"]
};

const cardComparisonSchema = {
    type: Type.OBJECT,
    properties: {
        comparisonTable: {
            type: Type.ARRAY,
            description: "A detailed, side-by-side comparison table of the selected cards.",
            items: comparisonTableRowSchema
        },
        summary: {
            type: Type.ARRAY,
            description: "A structured list of individual pros and cons for each card, personalized to the user. Do not combine them into one paragraph.",
            items: comparisonSummaryPointSchema
        },
        recommendation: {
            type: Type.STRING,
            description: "A final, conclusive recommendation on which card is best for the user and why. Use short sentences and newlines for readability."
        }
    },
    required: ["comparisonTable", "summary", "recommendation"]
};

const getAnalysisPrompt = (userProfile: UserProfile, previousAnalysis: ComprehensiveAnalysis | null, history: ChatMessage[]) => {
    const creditScoreLine = userProfile.creditScoreProvider
        ? `- Credit Score: ${userProfile.creditScore} (${userProfile.creditScoreProvider})`
        : `- Credit Score: Not provided by the user.`;

    let prompt = `
        You are an expert ${FEATURE_FLAG_DEBIT_CARDS_ENABLED ? 'card' : 'credit card'} advisor for the Indian market. Your goal is to provide a personalized, data-driven analysis to help a user optimize their card portfolio for maximum savings and benefits.

        **Card Database for Reference:**
        ${JSON.stringify(CARD_DATABASE, null, 2)}

        **Card-Specific Tips Database:**
        Use these expert tips to populate the 'tipsAndTricks' section for your recommendations. Select only the tips that are most relevant to the user's spending profile.
        ${JSON.stringify(CARD_TIPS, null, 2)}

        **User Profile:**
        - Monthly Net Salary: ${userProfile.salary}
        - City: ${userProfile.city === 'Other' ? userProfile.otherCity : userProfile.city}
        ${creditScoreLine}
        - Existing Credit Cards: ${userProfile.creditCards.length > 0 ? JSON.stringify(userProfile.creditCards, null, 2) : 'None'}
        ${FEATURE_FLAG_DEBIT_CARDS_ENABLED ? `- Existing Debit Cards: ${userProfile.debitCards.length > 0 ? JSON.stringify(userProfile.debitCards, null, 2) : 'None'}` : ''}
        - Monthly Expenses (with UPI split): ${JSON.stringify(userProfile.expenses, null, 2)}
        - New Card Goals: ${userProfile.preferences.primaryGoal.join(', ')}
        - Annual Fee Comfort: ${userProfile.preferences.feeComfort}
        - Additional Info: ${userProfile.preferences.additionalInfo || 'None'}

        ---
        **Core Instructions (Follow these for all analyses):**

        1.  **Analyze Existing Portfolio:**
            -   Rate the user's current portfolio (Excellent, Good, Average, Needs Improvement).
            -   Calculate their current estimated annual savings AFTER deducting any annual fees. This should be based on their CARD spending (total - upi).
            -   Provide a brief summary.
            -   List 2-3 key strengths and weaknesses. High UPI spending in a rewardable category is a key weakness.
            -   Create a "Usage Strategy" table recommending which *existing* card to use for each major spending category. This is the most important part.
            -   **Net Gain Analysis (Crucial):** For categories like 'Rent' or 'Society Maintenance' that often have convenience fees (~2%), or 'Fuel' with surcharges, if the rewards from using a card are LESS than the fees, you MUST recommend 'Use UPI/Netbanking/Cash' and state the reason is to 'avoid net loss'.

        2.  **Recommend New Cards:**
            -   **Analyze Payment Methods (Crucial):** The user's 'expenses' object shows the 'total' spend and the 'upi' portion. The remaining amount ('total' - 'upi') is card spend. Your analysis MUST:
                -   Identify categories with significant UPI spending that could be earning rewards.
                -   In your "New Recommendations", create "spendingToSwitch" plans that specifically suggest moving this UPI spend to the new card. For example, suggest switching "₹5,000 of UPI spends on Dining".
            -   **Credit Score Handling (Crucial):**
                -   If a credit score is provided by the user, use it to tailor recommendations. A higher score (750+) suggests eligibility for premium cards, while a score below 650 might require recommending cards with more lenient approval criteria. Mention the credit score as a factor in the 'eligibility' section for recommended cards.
                -   **If the credit score is NOT provided, you MUST NOT make any assumptions about their creditworthiness or score.** Do not mention a score of 750 or 'excellent credit' in your reasoning or summary. Base eligibility recommendations solely on their provided salary and city.
            -   Based on the user's goals and portfolio gaps, recommend **at least 2 new cards**. You should only recommend one card if the user's profile is extremely well-optimized or so niche that a second recommendation would provide genuinely negligible or negative value. If you recommend fewer than two cards, you must explicitly state the reason in the main summary.
            -   For each recommendation, provide a detailed breakdown including why it's recommended for them, key benefits, fees, eligibility, an estimated *additional* annual savings (from switching card and UPI spend), and an actionable plan for switching spends.
            -   For the 'tipsAndTricks' array, you MUST use the provided 'Card-Specific Tips Database'. Select 1-2 of the most relevant tips for the recommended card. DO NOT invent your own tips. If no tips are available for a card in the database, leave the array empty.
            -   Ensure the recommended card names and banks are from the provided database.

        3.  **Generate Developer Log:** Create a detailed, step-by-step log for developers explaining your thought process. Cover how you evaluated existing cards against spending, how you identified gaps (especially UPI spending opportunities), and how you selected the new recommendations based on goals and eligibility. Be technical and detailed. Use markdown formatting.
        ---
    `;

    if (previousAnalysis) {
        prompt += `
            **Your Task: Update Previous Analysis**
            You have already provided the following analysis. The user has provided additional context via chat.
            Previous Analysis: ${JSON.stringify(previousAnalysis, null, 2)}
            Chat History:
            ${history.map(m => `${m.role}: ${m.text}`).join('\n')}

            **Instructions:**
            Update the previous analysis based on the new information from the chat history, following all the **Core Instructions** above. DO NOT start from scratch. Make only the necessary changes to the existing analysis. Preserve recommendations and strategies that are still valid. For example, if the user mentions a new small expense, you might only need to adjust one part of the usage strategy and recalculate savings, leaving the rest of the analysis intact. If the user asks for more recommendations, add them without altering the existing valid ones unless necessary. You must also regenerate the developer log with your new reasoning.
        `;
    } else {
        prompt += `
            **Your Task: Perform Initial Analysis**
            Perform a comprehensive analysis of the user's profile, following all the **Core Instructions** above.
        `;
    }

    prompt += `
        **Output Formatting Rules:**
        - Adhere strictly to the provided JSON schema.
        - For all summaries and reasons, use short, clear sentences. Use **double asterisks** for bolding key terms. Use newlines for paragraphs. Use bullet points starting with '-' for lists.
    `;
    return prompt;
};

export const getAnalysis = async (userProfile: UserProfile, previousAnalysis: ComprehensiveAnalysis | null = null, history: ChatMessage[] = []): Promise<ComprehensiveAnalysis> => {
  const prompt = getAnalysisPrompt(userProfile, previousAnalysis, history);
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
        responseMimeType: 'application/json',
        responseSchema: comprehensiveAnalysisSchema
    }
  });

  try {
    return JSON.parse(response.text.trim()) as ComprehensiveAnalysis;
  } catch (e) {
      console.error("Failed to parse analysis JSON:", response.text);
      throw new Error("Received an invalid format from the AI. Please try again.");
  }
};


export const startChat = (userProfile: UserProfile): Chat => {
    const systemInstruction = `You are a helpful and concise ${FEATURE_FLAG_DEBIT_CARDS_ENABLED ? 'card' : 'credit card'} assistant. Your name is '${FEATURE_FLAG_DEBIT_CARDS_ENABLED ? 'Card' : 'Credit Card'} Advisor AI'. You are chatting with a user whose profile you have already analyzed. 
    User Profile:
    - Monthly Net Salary: ${userProfile.salary}
    - City: ${userProfile.city === 'Other' ? userProfile.otherCity : userProfile.city}
    - Existing Credit Cards: ${userProfile.creditCards.length > 0 ? JSON.stringify(userProfile.creditCards.map(c => c.variant)) : 'None'}
    ${FEATURE_FLAG_DEBIT_CARDS_ENABLED ? `- Existing Debit Cards: ${userProfile.debitCards.length > 0 ? JSON.stringify(userProfile.debitCards.map(c => c.variant)) : 'None'}` : ''}
    - Spending: ${JSON.stringify(userProfile.expenses)}
    - Goals: ${userProfile.preferences.primaryGoal.join(', ')}

    Your primary goal is to answer the user's questions about the analysis and help them refine it.
    - Be brief and clear. Use simple markdown (bolding with **, bullet points with -) for readability. Avoid long paragraphs.
    - If the user provides significant new information that would change the analysis (e.g., "I forgot to mention I spend 20k on international travel"), OR if they directly ask you to change the analysis or recommendations (e.g., "Update my recommendations", "Can you recommend three cards instead of one?"), you MUST end your response with the exact token: ${REANALYZE_TOKEN}
    - Do not suggest re-analysis for minor clarifications. Only for substantial changes or direct requests to update.
    `;
    
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction
        }
    });
};

export const getCardComparison = async (userProfile: UserProfile, cardsToCompare: string[]): Promise<CardComparisonResult> => {
    const prompt = `
        You are an expert credit card comparison engine for the Indian market.
        Your task is to create a personalized, side-by-side comparison of the following cards for a specific user.

        **User Profile:**
        - Monthly Net Salary: ${userProfile.salary}
        - City: ${userProfile.city === 'Other' ? userProfile.otherCity : userProfile.city}
        - Monthly Expenses: ${JSON.stringify(userProfile.expenses, null, 2)}
        - New Card Goals: ${userProfile.preferences.primaryGoal.join(', ')}

        **Cards to Compare:**
        ${cardsToCompare.join('\n')}

        **Your Task:**
        1.  **Create a Comparison Table:** Generate a table comparing the cards across parameters most relevant to the user. Parameters MUST include:
            - Annual Fee
            - Forex Markup
            - Key reward rates on the user's TOP 3-4 spending categories (e.g., 'Cashback on Online Shopping', 'Rewards on Travel').
            - Lounge Access (Domestic & International)
            - Other key features (e.g., Golf access, Movie benefits)
        2.  **Create a Structured Summary:** Provide a list of individual pros and cons for EACH card from the user's perspective. Do not write a single paragraph. Instead, create a list of points. For each point, specify which card it's for and whether it's a 'Pro' or 'Con'.
        3.  **Provide a Final Recommendation:** Based on the personalized comparison, give a clear, final recommendation on which card is the best overall choice for this user and why. Keep it concise.
        
        **Output Formatting Rules:**
        - Adhere strictly to the provided JSON schema.
        - Use short, clear sentences. Use **double asterisks** for bolding.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
            responseMimeType: 'application/json',
            responseSchema: cardComparisonSchema,
        }
    });

    try {
        return JSON.parse(response.text.trim()) as CardComparisonResult;
    } catch (e) {
        console.error("Failed to parse comparison JSON:", response.text);
        throw new Error("Received an invalid format from the AI. Please try again.");
    }
};