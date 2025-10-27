import { Component, inject, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { GeminiService } from '../../services/gemini.service';
import { LanguageService } from '../../services/language.service';
import { Goal, UserProfile, SelfieRecord } from '../../models/user.model';
import { SelfieAnalyzerComponent } from '../selfie-analyzer/selfie-analyzer.component';
import { ProgressChartComponent } from '../progress-chart/progress-chart.component';
import { TermsComponent } from '../terms/terms.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, SelfieAnalyzerComponent, ProgressChartComponent, TermsComponent, ConfirmationModalComponent],
})
export class DashboardComponent {
  userService = inject(UserService);
  geminiService = inject(GeminiService);
  languageService = inject(LanguageService);

  userProfile = this.userService.userProfile;
  score = this.userService.score;
  selfieHistory = this.userService.selfieHistory;
  
  advice = signal<string[]>([]);
  isLoading = signal<boolean>(false);
  isAnalyzing = signal(false);
  showTerms = signal(false);
  recordToDelete = signal<SelfieRecord | null>(null);

  goals: Goal[] = ['Skincare', 'Fitness', 'Style', 'Confidence'];

  constructor() {
    effect(() => {
      const profile = this.userProfile();
      if (profile) {
        this.getAdvice(profile);
      }
    }, { allowSignalWrites: true });
  }

  async getAdvice(profile: UserProfile) {
    this.isLoading.set(true);
    this.advice.set([]);
    const generatedAdvice = await this.geminiService.generateAdvice(profile);
    this.advice.set(generatedAdvice);
    this.isLoading.set(false);
  }

  startNewAssessment() {
    this.userService.startNewAssessment();
  }

  deleteRecord(record: SelfieRecord) {
    this.recordToDelete.set(record);
  }
  
  confirmDelete() {
    if (this.recordToDelete()) {
      this.userService.deleteSelfieRecord(this.recordToDelete()!.date);
      this.recordToDelete.set(null);
    }
  }

  cancelDelete() {
    this.recordToDelete.set(null);
  }
  
  reset() {
      if (confirm(this.languageService.translate('dashboard.resetConfirmation'))) {
          this.userService.resetUser();
      }
  }
}