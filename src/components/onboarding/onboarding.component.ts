import { Component, signal, inject } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { LanguageService } from '../../services/language.service';
import { GeminiService } from '../../services/gemini.service';
import { Goal, UserProfile } from '../../models/user.model';
import { SelfieAnalyzerComponent } from '../selfie-analyzer/selfie-analyzer.component';
import { TermsComponent } from '../terms/terms.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, SelfieAnalyzerComponent, TermsComponent],
})
export class OnboardingComponent {
  userService = inject(UserService);
  languageService = inject(LanguageService);
  geminiService = inject(GeminiService);

  currentStep = signal(1);
  age = signal<number | null>(null);
  gender = signal<string>('');
  goal = signal<Goal | ''>('');
  isAnalyzing = signal(false);
  showTerms = signal(false);

  goals: Goal[] = ['Skincare', 'Fitness', 'Style', 'Confidence'];

  nextStep() {
    if (this.currentStep() < 6) {
      this.currentStep.update(step => step + 1);
    }
  }

  previousStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(step => step - 1);
    }
  }

  setGender(gender: string) {
    this.gender.set(gender);
  }

  setGoal(goal: Goal) {
    this.goal.set(goal);
  }

  async handleOnboardingSelfie(imageBase64: string) {
    this.currentStep.set(6); // Move to analyzing screen
    this.isAnalyzing.set(true);

    const profile: UserProfile = {
      age: this.age()!,
      gender: this.gender()!,
      goal: this.goal()! as Goal,
    };

    try {
      const result = await this.geminiService.analyzeSelfie(profile, imageBase64);
      this.userService.completeOnboarding(profile, result, imageBase64);
      // App will transition automatically now that userProfile is set
    } catch (e) {
      console.error("Onboarding analysis failed", e);
      // Let user go back and try again from the goal selection step
      this.currentStep.set(4);
      // TODO: Show an error message to the user
    } finally {
      this.isAnalyzing.set(false);
    }
  }

  get progressPercentage(): string {
    return `${(this.currentStep() / 6) * 100}%`;
  }
}