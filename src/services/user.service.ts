import { Injectable, signal, effect } from '@angular/core';
import { UserProfile, Goal, SelfieRecord } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly userProfile = signal<UserProfile | null>(this.loadProfileFromStorage());
  readonly score = signal<number>(this.loadScoreFromStorage());
  readonly selfieHistory = signal<SelfieRecord[]>(this.loadSelfieHistoryFromStorage());

  constructor() {
    effect(() => {
      this.saveProfileToStorage(this.userProfile());
      this.saveScoreToStorage(this.score());
      this.saveSelfieHistoryToStorage(this.selfieHistory());
    });
  }

  private loadProfileFromStorage(): UserProfile | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedProfile = localStorage.getItem('userProfile');
      return storedProfile ? JSON.parse(storedProfile) : null;
    }
    return null;
  }

  private saveProfileToStorage(profile: UserProfile | null) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }
  }
  
  private loadScoreFromStorage(): number {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedScore = localStorage.getItem('userScore');
      return storedScore ? parseInt(storedScore, 10) : 0;
    }
    return 0;
  }

  private saveScoreToStorage(score: number) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('userScore', score.toString());
    }
  }

  private loadSelfieHistoryFromStorage(): SelfieRecord[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedHistory = localStorage.getItem('selfieHistory');
      return storedHistory ? JSON.parse(storedHistory) : [];
    }
    return [];
  }

  private saveSelfieHistoryToStorage(history: SelfieRecord[]) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('selfieHistory', JSON.stringify(history));
    }
  }

  completeOnboarding(profileData: UserProfile, analysisResult: { score: number; selfAssessment: string; recommendations: string[] }, imageBase64: string) {
    const newRecord: SelfieRecord = {
      date: new Date().toISOString(),
      imageUrl: `data:image/jpeg;base64,${imageBase64}`,
      score: analysisResult.score,
      selfAssessment: analysisResult.selfAssessment,
      recommendations: analysisResult.recommendations,
      age: profileData.age,
      gender: profileData.gender,
      goal: profileData.goal,
    };
    
    this.selfieHistory.update(history => 
      [newRecord, ...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
    
    this.userProfile.set(profileData);
    this.score.set(newRecord.score);
  }
  
  startNewAssessment() {
    this.userProfile.set(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('userProfile');
    }
  }
  
  deleteSelfieRecord(date: string) {
    this.selfieHistory.update(history => history.filter(record => record.date !== date));

    const latestHistory = this.selfieHistory();
    if (latestHistory.length > 0) {
        const latestRecord = latestHistory[0];
        this.score.set(latestRecord.score);
        this.userProfile.set({
            age: latestRecord.age,
            gender: latestRecord.gender,
            goal: latestRecord.goal,
        });
    } else {
        this.resetUser();
    }
  }

  resetUser() {
    this.userProfile.set(null);
    this.score.set(0);
    this.selfieHistory.set([]);
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userScore');
        localStorage.removeItem('selfieHistory');
    }
  }
}
