import { Injectable, signal, effect, inject } from '@angular/core';
import { UserProfile, Goal, SelfieRecord } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authService = inject(AuthService);

  readonly userProfile = signal<UserProfile | null>(null);
  readonly score = signal<number>(0);
  readonly selfieHistory = signal<SelfieRecord[]>([]);

  constructor() {
    effect(() => {
      const currentUser = this.authService.currentUser();
      if (currentUser) {
        const email = currentUser.email;
        this.userProfile.set(this.loadProfileFromStorage(email));
        this.score.set(this.loadScoreFromStorage(email));
        this.selfieHistory.set(this.loadSelfieHistoryFromStorage(email));
      } else {
        this.clearUserState();
      }
    });

    effect(() => {
      const currentUser = this.authService.currentUser();
      if (currentUser) {
        const email = currentUser.email;
        this.saveProfileToStorage(email, this.userProfile());
        this.saveScoreToStorage(email, this.score());
        this.saveSelfieHistoryToStorage(email, this.selfieHistory());
      }
    });
  }

  private getKey(prefix: string, email: string): string {
    return `${prefix}_${email}`;
  }

  private loadProfileFromStorage(email: string): UserProfile | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedProfile = localStorage.getItem(this.getKey('userProfile', email));
      return storedProfile ? JSON.parse(storedProfile) : null;
    }
    return null;
  }

  private saveProfileToStorage(email: string, profile: UserProfile | null) {
    if (typeof window !== 'undefined' && window.localStorage && this.authService.isAuthenticated()) {
      localStorage.setItem(this.getKey('userProfile', email), JSON.stringify(profile));
    }
  }
  
  private loadScoreFromStorage(email: string): number {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedScore = localStorage.getItem(this.getKey('userScore', email));
      return storedScore ? parseInt(storedScore, 10) : 0;
    }
    return 0;
  }

  private saveScoreToStorage(email: string, score: number) {
    if (typeof window !== 'undefined' && window.localStorage && this.authService.isAuthenticated()) {
      localStorage.setItem(this.getKey('userScore', email), score.toString());
    }
  }

  private loadSelfieHistoryFromStorage(email: string): SelfieRecord[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedHistory = localStorage.getItem(this.getKey('selfieHistory', email));
      return storedHistory ? JSON.parse(storedHistory) : [];
    }
    return [];
  }

  private saveSelfieHistoryToStorage(email: string, history: SelfieRecord[]) {
    if (typeof window !== 'undefined' && window.localStorage && this.authService.isAuthenticated()) {
      localStorage.setItem(this.getKey('selfieHistory', email), JSON.stringify(history));
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
  }
  
  deleteSelfieRecord(date: string) {
    this.selfieHistory.update(history => history.filter(record => record.date !== date));

    const latestHistory = this.selfieHistory();
    if (latestHistory.length > 0) {
        const latestRecord = latestHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
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
    const currentUser = this.authService.currentUser();
    if (currentUser) {
        const email = currentUser.email;
        localStorage.removeItem(this.getKey('userProfile', email));
        localStorage.removeItem(this.getKey('userScore', email));
        localStorage.removeItem(this.getKey('selfieHistory', email));
    }
    this.clearUserState();
  }
  
  private clearUserState() {
    this.userProfile.set(null);
    this.score.set(0);
    this.selfieHistory.set([]);
  }
}