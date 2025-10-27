export type Goal = 'Skincare' | 'Fitness' | 'Style' | 'Confidence';

export interface UserProfile {
  age: number;
  gender: string;
  goal: Goal;
}

export interface SelfieRecord {
  date: string;
  imageUrl: string;
  score: number;
  selfAssessment: string;
  recommendations: string[];
  // Snapshot of the user profile at the time of the selfie
  age: number;
  gender: string;
  goal: Goal;
}
