import { Injectable, signal, effect, inject, untracked } from '@angular/core';
import { UserProfile, Goal, SelfieRecord } from '../models/user.model';
import { AuthService } from './auth.service';
import { IndexedDbService } from './indexed-db.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authService = inject(AuthService);
  private dbService = inject(IndexedDbService);

  readonly userProfile = signal<UserProfile | null>(null);
  readonly score = signal<number>(0);
  readonly selfieHistory = signal<SelfieRecord[]>([]);
  private isDataLoadedForCurrentUser = signal(false);

  constructor() {
    // Effect to load data when user logs in or changes
    effect(() => {
      const currentUser = this.authService.currentUser();
      
      // Reset loading state on user change
      this.isDataLoadedForCurrentUser.set(false);
      
      if (currentUser) {
        // Asynchronously load data and then set the flag to enable saving
        this.loadAllUserData(currentUser.email).then(() => {
          this.isDataLoadedForCurrentUser.set(true);
        });
      } else {
        this.clearUserState();
      }
    }, { allowSignalWrites: true });

    // Effect to save any user data changes to DB
    effect(() => {
      // Read all dependent signals
      const currentUser = this.authService.currentUser();
      const profile = this.userProfile();
      const currentScore = this.score();
      const history = this.selfieHistory();

      // Only save if the current user's data has been loaded to avoid overwriting DB with initial empty state
      if (currentUser && this.isDataLoadedForCurrentUser()) {
        untracked(() => { // Use untracked to prevent this effect from re-triggering itself if save methods were to return signals
            this.saveProfileToDb(currentUser.email, profile);
            this.saveScoreToDb(currentUser.email, currentScore);
            this.saveSelfieHistoryToDb(currentUser.email, history);
        });
      }
    });
  }
  
  private async loadAllUserData(email: string) {
    if (typeof window === 'undefined') return;
    try {
        const [profile, score, history] = await Promise.all([
            this.dbService.get<UserProfile>('userProfiles', email),
            this.dbService.get<number>('userScores', email),
            this.dbService.get<SelfieRecord[]>('selfieHistories', email),
        ]);
        this.userProfile.set(profile ?? null);
        this.score.set(score ?? 0);
        this.selfieHistory.set(history ?? []);
    } catch (error) {
        console.error("Failed to load user data from IndexedDB", error);
        this.clearUserState();
    }
  }

  private async saveProfileToDb(email: string, profile: UserProfile | null) {
    if (typeof window === 'undefined' || !this.authService.isAuthenticated()) return;
    try {
        if (profile === null) {
          await this.dbService.delete('userProfiles', email);
        } else {
          await this.dbService.set('userProfiles', profile, email);
        }
    } catch(e) { console.error("Failed to save profile", e); }
  }
  
  private async saveScoreToDb(email: string, score: number) {
    if (typeof window === 'undefined' || !this.authService.isAuthenticated()) return;
    try {
        await this.dbService.set('userScores', score, email);
    } catch(e) { console.error("Failed to save score", e); }
  }

  private async saveSelfieHistoryToDb(email: string, history: SelfieRecord[]) {
    if (typeof window === 'undefined' || !this.authService.isAuthenticated()) return;
    try {
        await this.dbService.set('selfieHistories', history, email);
    } catch(e) { console.error("Failed to save selfie history", e); }
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

  async resetUser() {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
        const email = currentUser.email;
        await Promise.all([
            this.dbService.delete('userProfiles', email),
            this.dbService.delete('userScores', email),
            this.dbService.delete('selfieHistories', email)
        ]);
    }
    this.clearUserState();
  }
  
  private clearUserState() {
    this.userProfile.set(null);
    this.score.set(0);
    this.selfieHistory.set([]);
  }
}