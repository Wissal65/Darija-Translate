
export const TRANSLATION_CONTEXTS = {
  CASUAL: {
    id: 'casual',
    label: 'Casual/Daily',
    icon: '💬',
    description: 'Everyday conversations with friends and family',
    examples: ['Greetings', 'Small talk', 'Catching up']
  },
  FORMAL: {
    id: 'formal',
    label: 'Formal/Business',
    icon: '💼',
    description: 'Professional or official settings',
    examples: ['Job interviews', 'Business meetings', 'Official letters']
  },
  MEDICAL: {
    id: 'medical',
    label: 'Medical/Health',
    icon: '🏥',
    description: 'Healthcare and wellness conversations',
    examples: ['Doctor visits', 'Pharmacy', 'Symptoms description']
  },
  SHOPPING: {
    id: 'shopping',
    label: 'Shopping/Market',
    icon: '🛒',
    description: 'Buying goods and bargaining',
    examples: ['Souks', 'Bargaining', 'Grocery shopping']
  },
  RESTAURANT: {
    id: 'restaurant',
    label: 'Food/Dining',
    icon: '🍽️',
    description: 'Restaurants, cafes, and food ordering',
    examples: ['Ordering food', 'Asking for bill', 'Food preferences']
  },
  TRAVEL: {
    id: 'travel',
    label: 'Travel/Transport',
    icon: '✈️',
    description: 'Getting around and navigation',
    examples: ['Taxis', 'Directions', 'Hotels', 'Airports']
  },
  EMERGENCY: {
    id: 'emergency',
    label: 'Emergency/Urgent',
    icon: '🚨',
    description: 'Critical and urgent situations',
    examples: ['Police', 'Accidents', 'Lost items', 'Help needed']
  },
  SOCIAL: {
    id: 'social',
    label: 'Social/Family',
    icon: '👨‍👩‍👧‍👦',
    description: 'Family gatherings and social events',
    examples: ['Weddings', 'Celebrations', 'Condolences', 'Family talk']
  },
  BUSINESS: {
    id: 'business',
    label: 'Business',
    icon: '💼',
    description: 'Business negotiations and meetings',
    examples: ['Negotiations', 'Proposals', 'Contracts']
  }
};

// Simple context detection based on keywords
export const detectContext = (text) => {
  const lowerText = text.toLowerCase();
  
  // Medical keywords
  if (lowerText.match(/\b(doctor|sick|pain|medicine|hospital|health|hurt|fever|headache)\b/)) {
    return 'medical';
  }
  
  // Emergency keywords
  if (lowerText.match(/\b(help|emergency|police|urgent|danger|accident)\b/)) {
    return 'emergency';
  }
  
  // Shopping keywords
  if (lowerText.match(/\b(buy|price|how much|cost|shop|market|expensive|cheap)\b/)) {
    return 'shopping';
  }
  
  // Restaurant keywords
  if (lowerText.match(/\b(food|eat|menu|order|drink|hungry|bill|restaurant)\b/)) {
    return 'restaurant';
  }
  
  // Travel keywords
  if (lowerText.match(/\b(taxi|hotel|airport|train|bus|direction|where is|ticket)\b/)) {
    return 'travel';
  }
  
  // Business keywords
  if (lowerText.match(/\b(business|meeting|contract|proposal|negotiate|deal)\b/)) {
    return 'business';
  }
  
  // Formal keywords
  if (lowerText.match(/\b(sir|madam|mr|mrs|professional|appointment|interview)\b/)) {
    return 'formal';
  }
  
  // Social keywords
  if (lowerText.match(/\b(wedding|celebration|party|congratulations|family|gathering)\b/)) {
    return 'social';
  }
  
  // Default to casual
  return 'casual';
};