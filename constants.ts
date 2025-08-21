

import { ExpenseProfile } from './types';

export const FEATURE_FLAG_DEBIT_CARDS_ENABLED = false;

export const SALARY_RANGES = [
  "Below ₹30k",
  "₹30k-₹50k",
  "₹50k-₹75k",
  "₹75k-₹1 Lakh",
  "₹1 Lakh-₹2 Lakhs",
  "₹2 Lakhs-₹5 Lakhs",
  "₹5 Lakhs-₹10 Lakhs",
  "Above ₹10 Lakhs",
];

export const CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai",
  "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur",
  "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Other"
];

export const CREDIT_SCORE_PROVIDERS = [
  "CIBIL",
  "Experian",
  "Equifax",
  "CRIF High Mark",
  "I don't know / Not applicable"
];

export const BANKS = [
  "American Express", "AU Small Finance Bank", "Axis Bank", "Bank of Baroda", 
  "Bank of India", "Canara Bank", "DCB Bank", "Federal Bank", "HDFC Bank", "HSBC Bank", "ICICI Bank", 
  "IDFC First Bank", "IndusInd Bank", "Kotak Mahindra Bank", "Punjab National Bank", 
  "RBL Bank", "Standard Chartered", "State Bank of India", "Union Bank of India", "Yes Bank"
];

export const CARD_DATABASE: { [bank: string]: string[] } = {
    "HDFC Bank": ['Diners Club Black', 'Diners Club Black Metal', 'Diners Club Privilege', 'Freedom', 'Infinia', 'Marriott Bonvoy', 'Millennia', 'Regalia', 'Regalia Gold', 'Swiggy HDFC', 'Tata Neu Plus', 'Tata NeuCard Infinity'],
    "ICICI Bank": ['Amazon Pay', 'Coral', 'Emeralde', 'HPCL Super Saver', 'MakeMyTrip Platinum', 'MakeMyTrip Signature', 'Manchester United Signature', 'Rubyx', 'Sapphiro'],
    "State Bank of India": ['Aurum', 'Cashback SBI Card', 'Elite', 'IRCTC Platinum', 'IRCTC Premier', 'Prime', 'Pulse', 'SimplyCLICK', 'SimplySAVE', 'Vistara Prime'],
    "Axis Bank": ['Ace', 'Airtel Axis', 'Atlas', 'Flipkart Axis', 'IndianOil Axis Bank', 'Kiwi', 'Magnus', 'My Zone', 'Privilege', 'Reserve', 'Select', 'Vistara Infinite', 'Citi Rewards', 'Citi PremierMiles', 'Citi Cash Back', 'Citi IndianOil Platinum'],
    "Kotak Mahindra Bank": ['IndiGo 6E Rewards XL', 'League Platinum', 'Myntra', 'PVR Kotak', 'Urbane Gold', 'White Reserve', 'Zen Signature'],
    "American Express": ["Membership Rewards", "Platinum Travel", "SmartEarn", "Platinum Charge Card"],
    "Standard Chartered": ['EaseMyTrip', 'Manhattan Platinum', 'Smart Credit Card', 'Ultimate'],
    "IndusInd Bank": ['Celesta', 'EazyDiner', 'Legend', 'Pioneer Heritage', 'Platinum'],
    "RBL Bank": ['BookMyShow Play', 'Monthly Treats', 'Shoprite'],
    "IDFC First Bank": ["Millennia", "Select", "Wealth", "Classic"],
    "Yes Bank": ["Yes First Exclusive", "Yes First Preferred", "Wellness Plus", "BYOC", "Uni"],
    "Bank of Baroda": ["Eterna", "Premier", "Select", "Easy", "HPCL BoB Energie"],
    "Union Bank of India": ["Select", "Platinum", "Signature"],
    "Canara Bank": ["Rupay Select", "Visa Classic"],
    "Punjab National Bank": ["RuPay Select", "PNB Platinum RuPay"],
    "Bank of India": ["BOI Star", "BOI Platinum"],
    "HSBC Bank": ["Cashback Credit Card", "Premier Mastercard", "Platinum"],
    "AU Small Finance Bank": ['Altura Plus', 'LIT', 'Vetta', 'Zenith'],
    "Federal Bank": ["Scapia", "Imperio"],
    "DCB Bank": ["Niyo Global Card"]
};

export const DEBIT_CARD_DATABASE: { [bank: string]: string[] } = {
    "HDFC Bank": ["Millennia Debit Card", "MoneyBack Debit Card", "EasyShop Platinum Debit Card", "EasyShop Rupay Card", "EasyShop Imperia Platinum Chip Debit Card"],
    "ICICI Bank": ["Sapphiro Debit Card", "Rubyx Debit Card", "Coral Debit Card", "Expression Debit Card", "Wealth Debit Card"],
    "State Bank of India": ["Global International Debit Card", "Gold International Debit Card", "Platinum International Debit Card", "My Card International Debit Card"],
    "Axis Bank": ["Priority Debit Card", "Burgundy Debit Card", "Prestige Debit Card", "Liberty Debit Card", "Online Rewards Debit Card"],
    "Kotak Mahindra Bank": ["Silk Debit Card", "Pro Debit Card", "Privy League Platinum Debit Card", "811 Dream Different Debit Card", "Privy League Signature Debit Card"],
    "IndusInd Bank": ["Signature Exclusive Debit Card", "Pioneer World Debit Card", "Titanium Debit Card"],
    "RBL Bank": ["Signature+ Debit Card", "Titanium First Debit Card", "Woman's First Debit Card"],
    "Standard Chartered": ["Priority Infinite Debit Card", "Premium Cashback Debit Card", "Titanium Debit Card"],
    "IDFC First Bank": ["Visa Classic Debit Card", "Visa Platinum Debit Card", "Visa Signature Debit Card"],
    "American Express": [], // AMEX primarily offers credit cards/charge cards
    "Yes Bank": ["Yes First World Debit Card", "Yes Prosperity Platinum Debit Card", "Element Debit Card"],
    "Bank of Baroda": ["RuPay Platinum Debit Card", "Visa Platinum Debit Card", "Baroda Master Platinum Debit Card", "RuPay Classic Debit Card"],
    "Union Bank of India": ["Visa Platinum Debit Card", "RuPay Platinum Debit Card", "Business Platinum Debit Card"],
    "Canara Bank": ["Canara Bank Debit Card Platinum", "RuPay Platinum Debit Card"],
    "Punjab National Bank": ["PNB Platinum Debit Card", "PNB Rupay Select Debit Card"],
    "Bank of India": ["Visa Platinum Contactless International Debit Card", "RuPay Platinum Debit Card"],
    "HSBC Bank": ["HSBC Premier Debit Card", "HSBC Advance Debit Card"],
    "AU Small Finance Bank": ["AU Royale Debit Card", "Platinum Debit Card"]
};

export const COMMON_ANNUAL_FEES = [0, 250, 299, 499, 750, 999, 1499, 2499, 2999, 4999, 7999, 9999, 12500, 50000];

export const CARD_FEES: { [key: string]: number } = {
    // HDFC Bank
    'HDFC Bank Millennia': 999,
    'HDFC Bank Regalia Gold': 2499,
    'HDFC Bank Regalia': 2499,
    'HDFC Bank Freedom': 499,
    'HDFC Bank Infinia': 12500,
    'HDFC Bank Diners Club Black': 9999,
    'HDFC Bank Diners Club Black Metal': 9999,
    'HDFC Bank Diners Club Privilege': 2499,
    'HDFC Bank Tata Neu Plus': 499,
    'HDFC Bank Tata NeuCard Infinity': 1499,
    'HDFC Bank Swiggy HDFC': 499,
    'HDFC Bank Marriott Bonvoy': 2999,
    'HDFC Bank Millennia Debit Card': 499,
    'HDFC Bank MoneyBack Debit Card': 250,
    'HDFC Bank EasyShop Imperia Platinum Chip Debit Card': 750,

    // ICICI Bank
    'ICICI Bank Amazon Pay': 0,
    'ICICI Bank Sapphiro': 6500, // Kept as outlier, will require "Other"
    'ICICI Bank Emeralde': 12500,
    'ICICI Bank Rubyx': 2999,
    'ICICI Bank Coral': 499,
    'ICICI Bank HPCL Super Saver': 499,
    'ICICI Bank Manchester United Signature': 2499,
    'ICICI Bank MakeMyTrip Platinum': 0,
    'ICICI Bank MakeMyTrip Signature': 2499,
    'ICICI Bank Sapphiro Debit Card': 1499,
    'ICICI Bank Rubyx Debit Card': 999,
    'ICICI Bank Coral Debit Card': 499,
    'ICICI Bank Wealth Debit Card': 0,

    // State Bank of India
    'State Bank of India Cashback SBI Card': 999,
    'State Bank of India SimplyCLICK': 499,
    'State Bank of India SimplySAVE': 499,
    'State Bank of India Elite': 4999,
    'State Bank of India Prime': 2999,
    'State Bank of India Pulse': 1499,
    'State Bank of India Aurum': 9999,
    'State Bank of India Vistara Prime': 2999,
    'State Bank of India IRCTC Platinum': 499,
    'State Bank of India IRCTC Premier': 1499,
    'State Bank of India My Card International Debit Card': 250,

    // Axis Bank
    'Axis Bank Ace': 499,
    'Axis Bank Flipkart Axis': 499,
    'Axis Bank My Zone': 499,
    'Axis Bank IndianOil Axis Bank': 499,
    'Axis Bank Privilege': 1499,
    'Axis Bank Magnus': 12500,
    'Axis Bank Reserve': 50000,
    'Axis Bank Atlas': 4999,
    'Axis Bank Vistara Infinite': 9999,
    'Axis Bank Airtel Axis': 499,
    'Axis Bank Select': 2999,
    'Axis Bank Kiwi': 0,
    'Axis Bank Priority Debit Card': 750,
    'Axis Bank Online Rewards Debit Card': 499,
    'Axis Bank Citi Rewards': 1000,
    'Axis Bank Citi PremierMiles': 3000,
    'Axis Bank Citi Cash Back': 500,
    'Axis Bank Citi IndianOil Platinum': 1000,

    // Kotak Mahindra Bank
    'Kotak Mahindra Bank Urbane Gold': 250,
    'Kotak Mahindra Bank League Platinum': 499,
    'Kotak Mahindra Bank Zen Signature': 1499,
    'Kotak Mahindra Bank IndiGo 6E Rewards XL': 1499,
    'Kotak Mahindra Bank PVR Kotak': 0,
    'Kotak Mahindra Bank Myntra': 499,
    'Kotak Mahindra Bank White Reserve': 12500,
    'Kotak Mahindra Bank 811 Dream Different Debit Card': 299,
    'Kotak Mahindra Bank Privy League Signature Debit Card': 750,

    // American Express
    'American Express Membership Rewards': 4999,
    'American Express Platinum Travel': 4999,
    'American Express SmartEarn': 499,
    'American Express Platinum Charge Card': 60000, // Kept as outlier
    
    // Standard Chartered
    'Standard Chartered Ultimate': 4999,
    'Standard Chartered Smart Credit Card': 499,
    'Standard Chartered EaseMyTrip': 499,
    'Standard Chartered Manhattan Platinum': 999,
    'Standard Chartered Titanium Debit Card': 299,

    // IndusInd Bank
    'IndusInd Bank Legend': 9999,
    'IndusInd Bank Pioneer Heritage': 25000, // Kept as outlier
    'IndusInd Bank EazyDiner': 2499,
    'IndusInd Bank Celesta': 50000,
    'IndusInd Bank Platinum': 299,
    'IndusInd Bank Titanium Debit Card': 499,

    // RBL Bank
    'RBL Bank Shoprite': 499,
    'RBL Bank Monthly Treats': 0,
    'RBL Bank BookMyShow Play': 499,
    'RBL Bank Woman\'s First Debit Card': 499,
    
    // Yes Bank
    'Yes Bank Yes First Exclusive': 9999,
    'Yes Bank Yes First Preferred': 2499,
    'Yes Bank Wellness Plus': 1499,
    'Yes Bank BYOC': 499,
    'Yes Bank Uni': 0,
    'Yes Bank Element Debit Card': 499,

    // IDFC First Bank - Mostly LTF
    'IDFC First Bank Millennia': 0,
    'IDFC First Bank Select': 0,
    'IDFC First Bank Wealth': 0,
    'IDFC First Bank Classic': 0,
    'IDFC First Bank Visa Classic Debit Card': 250,
    'IDFC First Bank Visa Platinum Debit Card': 250,
    'IDFC First Bank Visa Signature Debit Card': 499,

    // Bank of Baroda
    'Bank of Baroda Eterna': 2499,
    'Bank of Baroda Premier': 999,
    'Bank of Baroda Select': 750,
    'Bank of Baroda Easy': 499,
    'Bank of Baroda HPCL BoB Energie': 499,
    'Bank of Baroda Baroda Master Platinum Debit Card': 250,
    'Bank of Baroda RuPay Classic Debit Card': 250,

    // Union Bank of India
    'Union Bank of India Select': 499,
    'Union Bank of India Platinum': 299,
    'Union Bank of India Signature': 2499,
    'Union Bank of India Business Platinum Debit Card': 250,

    // Canara Bank
    'Canara Bank Rupay Select': 999,
    'Canara Bank Visa Classic': 0,
    'Canara Bank RuPay Platinum Debit Card': 499,

    // Punjab National Bank
    'Punjab National Bank RuPay Select': 499,
    'Punjab National Bank PNB Platinum RuPay': 0,
    'Punjab National Bank PNB Rupay Select Debit Card': 499,

    // Bank of India
    'Bank of India BOI Star': 0,
    'Bank of India BOI Platinum': 0,
    'Bank of India RuPay Platinum Debit Card': 250,

    // HSBC Bank
    'HSBC Bank Cashback Credit Card': 999,
    'HSBC Bank Premier Mastercard': 0,
    'HSBC Bank Platinum': 0,
    'HSBC Bank HSBC Advance Debit Card': 0,

    // AU Small Finance Bank
    'AU Small Finance Bank Zenith': 7999,
    'AU Small Finance Bank Vetta': 2999,
    'AU Small Finance Bank Altura Plus': 499,
    'AU Small Finance Bank LIT': 0,
    'AU Small Finance Bank Platinum Debit Card': 250,

    // Federal Bank
    'Federal Bank Scapia': 0,
    'Federal Bank Imperio': 499,

    // DCB Bank
    'DCB Bank Niyo Global Card': 0,
};

export const CARD_TIPS: { [key: string]: string[] } = {
    // HDFC Bank
    'HDFC Bank Millennia': [
        "Always route your online shopping through HDFC's SmartBuy portal to get up to 5% CashBack, which is the key to maximizing this card's value.",
        "Check the 'Offers' section in your net banking for targeted discounts at popular merchants like Myntra, Swiggy etc."
    ],
    'HDFC Bank Regalia': [
        "Use the SmartBuy portal for booking flights and hotels to get up to 5x reward points.",
        "Accumulate reward points and transfer them to airline partners like Vistara or Singapore Airlines for better value on flights."
    ],
    'HDFC Bank Regalia Gold': [
        "Use the SmartBuy portal for booking flights and hotels to get 5x reward points, which is its standout feature.",
        "Track your quarterly spending to hit the milestone benefits which provide bonus reward points and complimentary lounge access."
    ],
    'HDFC Bank Infinia': [
        "Always use HDFC's SmartBuy portal for high-value purchases like flights and electronics to get 10x reward points.",
        "Take advantage of the unlimited complimentary lounge access for both primary and add-on cardholders worldwide."
    ],
    'HDFC Bank Diners Club Black': [
        "Maximize your rewards by routing all your major online purchases through the SmartBuy portal for 10x points.",
        "The monthly milestone benefit is key: Spend ₹80,000 in a calendar month to choose vouchers from top brands like Ola, TataCLiQ, etc."
    ],
    'HDFC Bank Diners Club Black Metal': [
        "Maximize your rewards by routing all your major online purchases through the SmartBuy portal for 10x points.",
        "The monthly milestone benefit is key: Spend ₹80,000 in a calendar month to choose vouchers from top brands like Ola, TataCLiQ, etc."
    ],
    'HDFC Bank Tata NeuCard Infinity': [
        "Use this card exclusively on the Tata Neu app for bill payments, groceries (BigBasket), and electronics (Croma) to get 10% back in NeuCoins as a NeuPass member.",
        "Redeem your NeuCoins on the Tata Neu app for flights, hotels, or shopping for maximum value."
    ],
    'HDFC Bank Swiggy HDFC': [
        "This is your dedicated card for food delivery. Use it on Swiggy for food, Instamart, and Dineout to get 10% cashback.",
        "It also offers a strong 5% cashback on many other online platforms like Amazon, Flipkart, making it a good secondary online card."
    ],
    // ICICI Bank
    'ICICI Bank Amazon Pay': [
        "Use the 'Gift Card' hack: Buy gift cards for other brands (like Swiggy, Uber) on Amazon to get 5% cashback on non-Amazon spends.",
        "This is an excellent card for utility bill payments made via Amazon Pay, giving 2% back, which is higher than most cards."
    ],
    'ICICI Bank Sapphiro': [
        "Take full advantage of the 'Dreamfolks' membership for complimentary lounge and spa access at airports.",
        "Use the BookMyShow offer to get 'Buy One Get One' on movie tickets, which can save a significant amount monthly."
    ],
    'ICICI Bank Coral': [
        "Check for the quarterly milestone benefit: Spend ₹2 Lakhs to get bonus reward points and a waiver of the next year's annual fee.",
        "Use the BookMyShow and Inox offers to get up to 25% off on movie tickets."
    ],
    // SBI
    'State Bank of India Cashback SBI Card': [
        "Treat this as your dedicated ONLINE spending card to get the flat 5% cashback. Offline rewards are only 1%.",
        "Don't use it for wallet loads, rent, or utility payments as they are excluded from the 5% cashback benefit."
    ],
    'State Bank of India SimplyCLICK': [
        "Use this card for all purchases on partner websites like Amazon, BookMyShow, and Cleartrip to get 10x reward points.",
        "Aim to meet the annual online spending milestones (₹1 Lakh and ₹2 Lakhs) to receive e-vouchers from Cleartrip/Yatra."
    ],
    'State Bank of India SimplySAVE': [
        "This is your go-to card for dining, movies, departmental stores, and grocery spending to get 10x reward points.",
        "Get a 1% fuel surcharge waiver at any petrol pump for transactions between ₹500 and ₹3,000."
    ],
    'State Bank of India Elite': [
        "Make sure to redeem your welcome e-gift voucher worth ₹5,000 from top brands like Yatra, Hush Puppies, or Shoppers Stop.",
        "Enjoy two complimentary movie tickets every month from BookMyShow, which can save you up to ₹6,000 annually."
    ],
    'State Bank of India Prime': [
        "Maximize value by spending on dining, groceries, and movies to get accelerated reward points.",
        "Aim for the annual spending milestones (e.g., spending ₹5 Lakhs) to get e-gift vouchers from Yatra or Pantaloons."
    ],
    // Axis Bank
    'Axis Bank Ace': [
        "Make this your primary card for utility bill payments (electricity, gas, DTH) through Google Pay to get 5% cashback.",
        "Use it as a 'catch-all' card for its flat 2% cashback on all other un-categorized online and offline spends."
    ],
    'Axis Bank Flipkart Axis': [
        "Your go-to card for all Flipkart purchases to get 5% unlimited cashback.",
        "Extend its value by using it on preferred partner merchants like Swiggy, Uber, PVR, and Cleartrip for 4% cashback."
    ],
    'Axis Bank Magnus': [
        "The key value comes from the monthly milestone: Spend ₹1 Lakh in a month to get 25,000 bonus Edge Reward points.",
        "Utilize the unlimited international lounge access for yourself and a guest with the Priority Pass."
    ],
    'Axis Bank My Zone': [
        "The standout feature is the Buy One Get One on movie tickets via Paytm Movies, which can save you a good amount each month.",
        "Get a complimentary SonyLIV Premium subscription renewed annually with the card."
    ],
    'Axis Bank Airtel Axis': [
        "This is a must-have if you use Airtel services. Use it for Airtel mobile, Wi-Fi, and DTH payments to get 25% cashback.",
        "It also gives 10% cashback on utility bills via the Airtel Thanks app and on preferred food delivery partners like Swiggy and Zomato."
    ],
    'Axis Bank Kiwi': [
        "Link this card to a UPI app like GPay, PhonePe or Paytm to earn flat 1% cashback on all your scan-and-pay transactions.",
        "It functions as a regular credit card for online/offline transactions, so use it where other cards don't offer higher rewards."
    ],
    // IDFC First Bank
    'IDFC First Bank Millennia': [
        "Use this for online purchases up to ₹20,000 per month to get the maximum 10x reward points.",
        "This is a great card for ATM withdrawals as it charges a low interest rate from the day of withdrawal, not a high one-time fee."
    ],
    'IDFC First Bank Select': [
        "Take advantage of the 'Buy One Get One' offer on movie tickets up to ₹250 via the Paytm app twice a month.",
        "Get complimentary domestic airport and railway lounge access each quarter."
    ],
    'IDFC First Bank Wealth': [
        "Enjoy complimentary and unlimited golf rounds and lessons at partner courses.",
        "The low forex markup of 1.5% makes it a good choice for international travel."
    ],
    // American Express
    'American Express Membership Rewards': [
        "The 'Monthly Bonus' is key: Make four separate transactions of at least ₹1,500 each within a calendar month to get 1,000 bonus points.",
        "Never redeem points for statement credit. Transfer them to hotel/airline partners like Marriott Bonvoy or Vistara for much higher value, especially during transfer bonus promotions."
    ],
    'American Express Platinum Travel': [
        "The primary goal is to meet the spending milestones. Spend ₹1.90 Lakhs in a year for bonus points, and spend ₹4 Lakhs for a Taj/ITC voucher and more points.",
        "Use the complimentary domestic lounge access (8 visits/year) to enhance your travel experience."
    ],
    'American Express SmartEarn': [
        "Use this for accelerated 5x rewards on online spending at Flipkart, Amazon, and Uber.",
        "Route your spending on other major categories like Swiggy, BookMyShow, or PVR through this card to get 2x rewards."
    ],
    // Federal Bank
    'Federal Bank Imperio': [
        "Enjoy complimentary domestic airport lounge access each quarter, a great perk for a card in this fee range.",
        "Get accelerated reward points on your grocery and utility bill payments."
    ],
    // Yes Bank
    'Yes Bank Uni': [
        "Leverage the unique pay-in-3 feature, allowing you to split your monthly bill into three parts without any extra charges.",
        "Track your rewards and manage payments seamlessly through the integrated Uni app."
    ],
    // DCB Bank
    'DCB Bank Niyo Global Card': [
        "This is your go-to card for all international transactions, both online and offline, as it has zero foreign currency markup fees.",
        "Load the card with INR before you travel to use it at ATMs and merchants abroad without incurring high conversion charges."
    ]
};

interface ExpenseCategory {
    id: keyof ExpenseProfile;
    label: string;
    description: string;
    tooltip?: string;
}

export const EXPENSE_CATEGORY_GROUPS: { groupTitle: string; categories: ExpenseCategory[] }[] = [
    {
        groupTitle: 'Shopping Expenses',
        categories: [
            { id: 'onlineShopping', label: 'Online Shopping', description: 'Amazon, Flipkart, Myntra, etc.' },
            { id: 'offlineShopping', label: 'Offline Shopping', description: 'Groceries, Apparel, Electronics' },
        ],
    },
    {
        groupTitle: 'Household & Bills',
        categories: [
            { id: 'utilities', label: 'Utility Bills', description: 'Electricity, Water, Mobile, DTH' },
            { id: 'rent', label: 'Rent', description: 'Monthly house rent' },
            { id: 'societyMaintenance', label: 'Society Maintenance', description: 'Monthly society/RWA charges' },
            { id: 'insurance', label: 'Insurance Premiums', description: 'Life, Health, Vehicle insurance' },
        ],
    },
    {
        groupTitle: 'Lifestyle & Travel',
        categories: [
            { id: 'travel', label: 'Travel', description: 'Flights, Hotels, Trains' },
            { id: 'fuel', label: 'Fuel', description: 'Petrol, Diesel, CNG' },
            { id: 'dining', label: 'Dining Out', description: 'Restaurants, Cafes' },
            { id: 'entertainment', label: 'Entertainment', description: 'Movies, OTT, Events' },
            { id: 'health', label: 'Health & Wellness', description: 'Gym, Pharmacy, Hospitals' },
        ],
    },
    {
        groupTitle: 'Miscellaneous',
        categories: [
            { id: 'cashWithdrawals', label: 'Cash Withdrawals', description: 'ATM Withdrawals' },
            { id: 'other', label: 'Other', description: 'Any other expenses' },
        ],
    },
];


export const AI_SUGGESTION_GOAL = {
    text: "Improve my portfolio of cards",
    title: "AI Smart Recommendation",
    description: "Let our AI analyze your complete profile to recommend the single best card that maximizes your savings and fills key gaps in your portfolio."
};

export const SPECIFIC_CARD_GOAL_GROUPS = [
    {
        title: 'Savings & Value',
        goals: [
            { text: "Maximize Cashback" },
            { text: "Low/Zero Annual Fee" },
            { text: "Fuel Surcharge Waiver" },
        ]
    },
    {
        title: 'Travel & Lifestyle',
        goals: [
            { text: "Earn Travel Rewards (Flights/Hotels)" },
            { text: "Airport Lounge Access" },
            { text: "Lifestyle Rewards (Shopping/Dining)" },
            { text: "Free Movies & Lifestyle Perks" },
        ]
    }
];

export const FEE_PREFERENCES = [
    "Zero Annual Fee",
    "Up to ₹500",
    "Up to ₹2,000",
    "Above ₹2,000 (for premium benefits)",
    "Fee is not a factor"
];

export const LOADING_TIPS = [
    "Did you know? The right card can save you over 10% on online shopping.",
    "We're analyzing over 100+ card variants to find your perfect match.",
    "We're checking for hidden fees and charges on your current cards.",
    "Maximizing reward points often beats direct cashback. We'll check that for you.",
    "Pairing specific cards for different categories can double your benefits.",
    "A good travel card can save you thousands on international lounge access alone.",
    "We're evaluating co-branded cards like Amazon Pay and Flipkart Axis for your shopping habits.",
    "Even small, consistent cashback on utility bills adds up significantly over a year.",
    "Some cards offer better rewards when you pay through their specific app or portal.",
    "We're checking for fuel surcharge waivers to save you money at the pump.",
    "A lifetime-free (LTF) card isn't always the best; a paid card can offer much more value.",
    "Look out for accelerated rewards on weekend dining or specific shopping partners."
];

export const TOTAL_STEPS = 4;