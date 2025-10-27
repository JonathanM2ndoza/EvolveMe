// Fix: Created the full implementation for the DashboardComponent, which was previously missing.
import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';
import { GeminiService } from '../../services/gemini.service';
import { Goal, SelfieRecord, UserProfile } from '../../models/user.model';
import { ProgressChartComponent } from '../progress-chart/progress-chart.component';
import { SelfieAnalyzerComponent } from '../selfie-analyzer/selfie-analyzer.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ProgressChartComponent,
    SelfieAnalyzerComponent,
    ConfirmationModalComponent,
  ],
  template: `
@if (currentUser(); as user) {
<div class="bg-gray-900 text-white min-h-screen font-sans">
  <!-- Header -->
  <header class="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-40">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.745 3.745 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
          </div>
          <div class="ml-4">
            <h1 class="text-xl font-bold tracking-tight">{{ languageService.translate('dashboard.headerTitle') }}</h1>
            <p class="text-sm text-gray-400">{{ languageService.translate('dashboard.headerSubtitle') }}</p>
          </div>
        </div>
        <div class="relative">
          <button (click)="showUserMenu.set(!showUserMenu())" type="button" class="flex items-center justify-center h-10 w-10 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition">
            <span class="sr-only">{{ languageService.translate('dashboard.userMenu') }}</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </button>
          @if (showUserMenu()) {
          <div class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in" role="menu" aria-orientation="vertical">
            <div class="py-1" role="none">
              <div class="px-4 py-2 text-sm text-gray-400">
                <p>{{ languageService.translate('dashboard.signedInAs') }}</p>
                <p class="font-medium text-white truncate">{{ user.email }}</p>
              </div>
              <button (click)="languageService.toggleLanguage()" class="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors" role="menuitem">
                {{ languageService.language() === 'en' ? 'Español' : 'English' }}
              </button>
              <button (click)="showScoreInfo.set(true); showUserMenu.set(false);" class="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors" role="menuitem">
                {{ languageService.translate('dashboard.scoreInfoButton') }}
              </button>
              <button (click)="showResetConfirmation.set(true); showUserMenu.set(false);" class="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white transition-colors" role="menuitem">
                {{ languageService.translate('dashboard.resetProfile') }}
              </button>
              <button (click)="authService.logout()" class="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors" role="menuitem">
                {{ languageService.translate('dashboard.signOut') }}
              </button>
            </div>
          </div>
          }
        </div>
      </div>
    </div>
  </header>

  <main class="container mx-auto p-4 sm:p-6 lg:p-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Score & Goal -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-between animate-slide-in-down">
            <div>
              <p class="text-sm font-medium text-gray-400">{{ languageService.translate('dashboard.scoreLabel') }}</p>
              <p class="text-5xl font-bold text-indigo-400">{{ score() }} <span class="text-3xl text-gray-500">/ 100</span></p>
            </div>
            <button (click)="showSelfieAnalyzer.set(true)" class="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-2">
                <path d="M15.5 2.75a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z" />
                <path d="M8.61 4.39a.75.75 0 0 0-1.22 0l-3.25 5.5a.75.75 0 0 0 .61 1.11h6.5a.75.75 0 0 0 .61-1.11l-3.25-5.5Z" />
                <path d="M5.341 12.25a.75.75 0 0 0 0 1.5h9.318a.75.75 0 0 0 0-1.5H5.341Z" />
              </svg>
              {{ languageService.translate('dashboard.analyzeSelfie') }}
            </button>
          </div>
          <div class="bg-gray-800 p-6 rounded-2xl shadow-lg animate-slide-in-down [animation-delay:100ms]">
            <p class="text-sm font-medium text-gray-400">{{ languageService.translate('dashboard.currentGoal') }}</p>
            <p class="text-2xl font-bold text-white capitalize">{{ userProfile()?.goal }}</p>
            @if (isChangingGoal()) {
            <div class="mt-4">
              <p class="text-sm text-gray-300 mb-2">{{ languageService.translate('dashboard.selectNewGoal') }}</p>
              <div class="grid grid-cols-2 gap-2">
                @for (goal of goals; track goal) {
                  <button (click)="changeGoal(goal)" class="text-left w-full p-2 rounded-lg text-sm transition-colors"
                    [class]="userProfile()?.goal === goal ? 'bg-indigo-600 text-white font-semibold' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'">
                    {{ languageService.translate('onboarding.goals.' + goal) }}
                  </button>
                }
              </div>
              <button (click)="isChangingGoal.set(false)" class="mt-3 text-sm text-gray-400 hover:text-white transition-colors">
                {{ languageService.translate('dashboard.cancel') }}
              </button>
            </div>
            } @else {
              <button (click)="isChangingGoal.set(true)" class="mt-4 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors flex items-center">
                {{ languageService.translate('dashboard.changeGoal') }}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 ml-1">
                  <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
                </svg>
              </button>
            }
          </div>
        </div>

        <!-- Score Progression -->
        <div class="bg-gray-800 p-6 rounded-2xl shadow-lg animate-fade-in [animation-delay:200ms]">
          <h2 class="text-lg font-semibold text-white mb-4">{{ languageService.translate('dashboard.scoreProgression') }}</h2>
          @if (selfieHistory().length > 1) {
            <app-progress-chart [history]="selfieHistory()"></app-progress-chart>
          } @else {
            <div class="h-64 flex flex-col items-center justify-center text-center text-gray-400 border-2 border-dashed border-gray-700 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mb-2 text-gray-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12A2.25 2.25 0 0 0 20.25 14.25V3m-15.75 0h15.75M3 3a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 3 21h18a2.25 2.25 0 0 0 2.25-2.25V5.25A2.25 2.25 0 0 0 18 3m-15 0H6.75m0 0v.01M6 6.75v.01M6.75 6.75v.01m0 3.75v.01m-1.5-.01v.01m1.5 0v.01m6-3.75v.01m1.5 0v.01m-1.5 0v.01m1.5 0v.01m-1.5 0v.01m0 3.75v.01m-1.5-.01v.01m1.5 0v.01m0 0v.01m1.5-3.76v.01m0 3.75v.01" />
              </svg>
              <p class="font-semibold text-white">{{ languageService.translate('dashboard.notEnoughData') }}</p>
              <p class="text-sm">{{ languageService.translate('dashboard.notEnoughDataSubtitle') }}</p>
            </div>
          }
        </div>
      </div>

      <!-- Right Column -->
      <div class="lg:col-span-1 space-y-6">
        <!-- AI Tips -->
        <div class="bg-gray-800 p-6 rounded-2xl shadow-lg animate-fade-in [animation-delay:300ms]">
          <h2 class="text-lg font-semibold text-white mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-2 text-indigo-400">
              <path fill-rule="evenodd" d="M10 2c-1.751 0-3.33.924-4.218 2.375-.888 1.45-1.047 3.235-.46 4.825A5.002 5.002 0 0 0 10 12.5a5.002 5.002 0 0 0 4.678-3.3c.587-1.59.428-3.375-.46-4.825C13.33 2.924 11.751 2 10 2ZM8.27 13.92a.75.75 0 0 1-.22.53l-.5 2.5a.75.75 0 0 1-1.42-.28l.5-2.5a.75.75 0 0 1 .53-.53l2.5-.5a.75.75 0 0 1 .28 1.42l-2.5.5ZM12.45 14.45a.75.75 0 0 0-.28 1.42l2.5.5a.75.75 0 0 0 .53-.53l.5-2.5a.75.75 0 0 0-1.42-.28l-.5 2.5a.75.75 0 0 0-.22.53Z" clip-rule="evenodd" />
              <path d="M11.66 11.23a.75.75 0 0 0 1.06 1.06l.24-.24a3.5 3.5 0 0 1 4.88 5.03l-1.01 1.01a.75.75 0 1 0 1.06 1.06l1.01-1.01a5 5 0 0 0-7.23-6.88l-.24.24Zm-3.32-8.46a.75.75 0 0 0-1.06-1.06l-.24.24a3.5 3.5 0 0 1-4.88-5.03l1.01-1.01a.75.75 0 1 0-1.06-1.06l-1.01 1.01a5 5 0 0 0 7.23 6.88l.24-.24Z" />
            </svg>
            {{ languageService.translate('dashboard.aiTips') }}
          </h2>
          @if (isLoadingTips()) {
          <div class="space-y-3">
            @for (i of [1,2,3]; track i) {
              <div class="animate-pulse flex space-x-4">
                <div class="rounded-full bg-gray-700 h-5 w-5"></div>
                <div class="flex-1 space-y-3 py-1">
                  <div class="h-2 bg-gray-700 rounded"></div>
                  <div class="h-2 bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            }
          </div>
          } @else {
          <ul class="space-y-3 text-gray-300">
            @for (tip of aiTips(); track tip) {
            <li class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-indigo-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>{{ tip }}</span>
            </li>
            }
          </ul>
          <p class="mt-4 text-xs text-gray-500 italic">{{ languageService.translate('dashboard.disclaimer') }}</p>
          }
        </div>
      </div>
    </div>

    <!-- Progress History -->
    <div class="mt-6 bg-gray-800 p-6 rounded-2xl shadow-lg animate-fade-in [animation-delay:400ms]">
      <h2 class="text-lg font-semibold text-white mb-4">{{ languageService.translate('dashboard.progressHistory') }}</h2>
      @if (isAnalyzing()) {
        <div class="text-center p-8 rounded-lg bg-gray-700/50">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-indigo-400 motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p class="mt-4 text-gray-300">{{ languageService.translate('dashboard.analyzing') }}</p>
        </div>
      }
      @if (sortedHistory().length > 0) {
      <div class="space-y-6">
        @for (record of sortedHistory(); track record.date) {
        <div class="bg-gray-700/50 rounded-lg p-4 md:flex md:items-start md:gap-6">
          <div class="md:w-1/4 flex-shrink-0 mb-4 md:mb-0">
            <img [src]="record.imageUrl" alt="{{ languageService.translate('dashboard.selfieFrom') }} {{ formatDate(record.date) }}" class="rounded-lg aspect-square object-cover w-full">
            <p class="text-sm text-gray-400 mt-2 text-center">{{ formatDate(record.date) }}</p>
          </div>
          <div class="flex-grow">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-gray-400">{{ languageService.translate('dashboard.scoreLabel') }}</p>
                <p class="text-2xl font-bold text-indigo-400">{{ record.score }} / 100</p>
              </div>
              <button (click)="recordToDelete.set(record)" class="text-gray-500 hover:text-red-400 transition-colors" [title]="languageService.translate('dashboard.deleteRecordTitle')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                  <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193v-.443A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div class="mt-4 border-t border-gray-600 pt-4">
              <h4 class="font-semibold text-white">{{ languageService.translate('dashboard.selfAssessment') }}</h4>
              <p class="text-gray-300 mt-1">{{ record.selfAssessment }}</p>
            </div>
            
            <div class="mt-4">
              <h4 class="font-semibold text-white">{{ languageService.translate('dashboard.recommendations') }}</h4>
              <ul class="list-disc list-inside mt-1 space-y-1 text-gray-300">
                @for (rec of record.recommendations; track rec) {
                  <li>{{ rec }}</li>
                }
              </ul>
            </div>
          </div>
        </div>
        }
      </div>
      } @else if (!isAnalyzing()) {
        <div class="text-center p-8 rounded-lg border-2 border-dashed border-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto text-gray-600">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <p class="mt-4 font-semibold text-white">{{ languageService.translate('dashboard.noHistory') }}</p>
          <p class="mt-1 text-sm text-gray-400">{{ languageService.translate('dashboard.noHistorySubtitle') }}</p>
        </div>
      }
    </div>
  </main>

  <!-- Modals and Overlays -->
  @if (showSelfieAnalyzer()) {
    <app-selfie-analyzer (photoTaken)="handleNewSelfie($event)" (close)="showSelfieAnalyzer.set(false)"></app-selfie-analyzer>
  }

  @if (showResetConfirmation()) {
    <app-confirmation-modal 
      [message]="languageService.translate('dashboard.resetConfirmation')"
      (confirm)="confirmReset()"
      (cancel)="showResetConfirmation.set(false)">
    </app-confirmation-modal>
  }
  
  @if (recordToDelete(); as record) {
    <app-confirmation-modal 
      [message]="languageService.translate('dashboard.deleteConfirmation')"
      (confirm)="confirmDelete()"
      (cancel)="recordToDelete.set(null)">
    </app-confirmation-modal>
  }

  @if (showScoreInfo()) {
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
      <div class="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 relative max-h-[90vh] flex flex-col animate-scale-in">
        <button (click)="showScoreInfo.set(false)" class="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10">
          <span class="sr-only">{{ languageService.translate('terms.close') }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 class="text-2xl font-bold text-white mb-4 pr-8">{{ languageService.translate('dashboard.scoreInfoTitle') }}</h2>

        <div class="overflow-y-auto space-y-4 text-gray-300 pr-4">
          @for (paragraph of languageService.translate('dashboard.scoreInfoContent').split('\n'); track $index) {
            <p>{{ paragraph }}</p>
          }
        </div>

        <div class="mt-6 text-right">
          <button (click)="showScoreInfo.set(false)" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
            {{ languageService.translate('terms.close') }}
          </button>
        </div>
      </div>
    </div>
  }
</div>
}
`,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fade-in {
      animation: fade-in 0.5s ease-out forwards;
    }

    @keyframes slide-in-down {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-in-down {
      animation: slide-in-down 0.5s ease-out forwards;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes pulse {
      50% { opacity: .5; }
    }
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes fade-in-fast {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }

    @keyframes scale-in {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  userService = inject(UserService);
  authService = inject(AuthService);
  languageService = inject(LanguageService);
  geminiService = inject(GeminiService);

  userProfile = this.userService.userProfile;
  currentUser = this.authService.currentUser;
  score = this.userService.score;
  selfieHistory = this.userService.selfieHistory;
  
  showUserMenu = signal(false);
  isAnalyzing = signal(false);
  showSelfieAnalyzer = signal(false);
  isChangingGoal = signal(false);
  showResetConfirmation = signal(false);
  recordToDelete = signal<SelfieRecord | null>(null);
  showScoreInfo = signal(false);
  
  aiTips = signal<string[]>([]);
  isLoadingTips = signal(true);

  goals: Goal[] = ['Skincare', 'Fitness', 'Style', 'Confidence'];
  sortedHistory = computed(() => 
    [...this.selfieHistory()].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );

  private tipFetchTimer: any;

  constructor() {
    effect(() => {
      const profile = this.userProfile();
      if (profile) {
        this.debouncedFetchAiTips();
      }
    }, { allowSignalWrites: true });
  }

  debouncedFetchAiTips() {
    this.isLoadingTips.set(true);
    clearTimeout(this.tipFetchTimer);
    this.tipFetchTimer = setTimeout(() => {
      this.fetchAiTips();
    }, 800);
  }

  async fetchAiTips() {
    const profile = this.userProfile();
    if (profile) {
      try {
        const tips = await this.geminiService.generateAdvice(profile);
        this.aiTips.set(tips);
      } catch (e: any) {
        console.error("Failed to fetch AI tips", e);
        let errorMessage = this.languageService.translate('dashboard.aiTipsError');
        
        const errorString = JSON.stringify(e);
        if (errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED')) {
          errorMessage = this.languageService.translate('dashboard.aiTipsRateLimitError');
        }
        this.aiTips.set([errorMessage]);
      } finally {
        this.isLoadingTips.set(false);
      }
    } else {
        this.isLoadingTips.set(false);
    }
  }
  
  async handleNewSelfie(imageBase64: string) {
    this.showSelfieAnalyzer.set(false);
    this.isAnalyzing.set(true);
    const profile = this.userProfile();
    if (!profile) {
        this.isAnalyzing.set(false);
        return;
    }

    try {
      const result = await this.geminiService.analyzeSelfie(profile, imageBase64);
      const newProfile: UserProfile = { ...profile }; // Create a snapshot of the profile
      this.userService.completeOnboarding(newProfile, result, imageBase64);
    } catch(err) {
      console.error("Error analyzing selfie:", err);
      // TODO: show error to user
    } finally {
      this.isAnalyzing.set(false);
    }
  }

  changeGoal(newGoal: Goal) {
    const profile = this.userProfile();
    if (profile) {
      this.userService.userProfile.set({ ...profile, goal: newGoal });
    }
    this.isChangingGoal.set(false);
  }

  confirmReset() {
    this.userService.resetUser();
    this.showResetConfirmation.set(false);
  }

  confirmDelete() {
    const record = this.recordToDelete();
    if (record) {
      this.userService.deleteSelfieRecord(record.date);
    }
    this.recordToDelete.set(null);
  }
  
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString(this.languageService.language(), {
        year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}