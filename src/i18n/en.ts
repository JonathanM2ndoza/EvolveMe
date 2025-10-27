export const en = {
  // Onboarding Component
  onboarding: {
    welcomeTitle: 'Welcome to EvolveMe',
    welcomeSubtitle: 'Your AI-powered guide to self-improvement.',
    getStarted: "Let's Get Started",
    ageTitle: 'How old are you?',
    agePlaceholder: 'Enter your age',
    continue: 'Continue',
    back: 'Back',
    ageDisclaimer: 'You must be 13 or older to use this service.',
    genderTitle: 'What is your gender?',
    genders: {
      male: 'Male',
      female: 'Female',
      other: 'Other'
    },
    goalTitle: "What's your primary goal?",
    goals: {
      Skincare: 'Skincare',
      Fitness: 'Fitness',
      Style: 'Style',
      Confidence: 'Confidence'
    },
    selfieTitle: 'Your First Analysis',
    selfieSubtitle: 'Let\'s get a baseline. Take a selfie for your initial assessment.',
    finalizeTitle: 'Analyzing...',
    finalizeSubtitle: "We're creating your personalized plan. This might take a moment.",
    viewDashboard: 'View My Dashboard',
    language: 'Español'
  },

  // Dashboard Component
  dashboard: {
    headerTitle: 'Your Dashboard',
    headerSubtitle: "Welcome back, let's evolve together.",
    scoreLabel: 'Evolve Score',
    analyzeSelfie: 'New Assessment',
    resetProfile: 'Reset Profile',
    currentGoal: 'Your Current Goal:',
    changeGoal: 'Change Goal',
    cancel: 'Cancel',
    selectNewGoal: 'Select your new primary goal:',
    scoreProgression: 'Score Progression',
    timeframes: {
      day: 'Day',
      week: 'Week',
      month: 'Month',
      year: 'Year'
    },
    notEnoughData: "Not enough data to display chart.",
    notEnoughDataSubtitle: "Analyze at least two selfies to see your progress.",
    progressHistory: 'Progress History',
    analyzing: 'Analyzing your selfie with AI... This might take a moment.',
    noHistory: "You haven't analyzed any selfies yet.",
    noHistorySubtitle: 'Click "New Assessment" to get your first score and feedback!',
    selfieFrom: 'User selfie from',
    selfAssessment: 'Self-Assessment',
    recommendations: 'Recommendations',
    aiTips: 'Personalized AI Tips',
    disclaimer: 'Disclaimer: These tips are for informational purposes only and are not a substitute for professional medical advice. Always consult with a qualified healthcare provider for any medical concerns.',
    resetConfirmation: 'Are you sure you want to reset your profile and start over?',
    deleteRecordTitle: 'Delete Record',
    deleteConfirmation: 'Are you sure you want to permanently delete this record? This action cannot be undone.',
    confirmDelete: 'Delete'
  },

  // Selfie Analyzer Component
  selfie: {
    title: 'Analyze Selfie',
    errorTitle: 'Error',
    errorPermission: 'Camera permission denied. Please allow camera access in your browser settings.',
    errorAccess: "Could not access the camera. Please ensure it's not being used by another application.",
    errorUnknown: 'An unknown error occurred while accessing the camera.',
    errorNoSupport: 'Your browser does not support camera access.',
    capture: 'Capture & Analyze',
    bestResults: 'Center your face in the frame for the best results.'
  },

  // Terms & Conditions
  terms: {
    trigger: 'Terms & Conditions',
    title: 'Health Information Disclaimer',
    close: 'Close',
    content: `All content provided in the [EvolveMe] application, including text, graphics, images, and any other material, is offered for informational and educational purposes only.
This content is not intended to be a substitute for, and does not substitute for, professional medical advice, diagnosis, or treatment. Reliance on any information provided by this application is solely at your own risk.
[EvolveMe] does not provide medical advice. We strongly recommend that you seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or treatment.
Do not delay or disregard seeking professional medical advice because of information obtained through this application. In the event of a medical emergency, call your doctor or local emergency services immediately.`
  },

  // Gemini Service Prompts
  prompts: {
    advice: "You are an expert wellness and self-improvement coach. Your advice must be highly personalized. A user, who is a {age}-year-old {gender}, has a primary goal of improving their '{goal}'. Provide 5 actionable, easy-to-follow tips specifically tailored to their age and stated goal. For example, skincare advice for a teenager should differ from that for a 40-year-old. Present the tips as a numbered list starting with \"1.\". Each tip should be concise (1-2 sentences). Do not add any introductory or concluding paragraphs, just the list. Respond in {language}.",
    selfieAnalysis: "You are an AI beauty and wellness analyst. Your analysis must be personalized and constructive. Based on this selfie of a {age}-year-old {gender} whose primary goal is '{goal}', provide a numerical score out of 100, a brief self-assessment, and a list of 2-3 actionable recommendations. The recommendations must be highly relevant to their age and specific goal. Be encouraging and objective. The score should be based on visible factors relevant to the goal (e.g., for Skincare, look at skin clarity and age-appropriateness; for Style, look at grooming and if the fashion choice is suitable for their context). Respond in {language}."
  }
};