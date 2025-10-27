import { Component, signal, inject } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .form-input {
      @apply w-full bg-gray-700 border border-gray-600 text-white text-lg rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors placeholder-gray-400;
    }
    .submit-button {
      @apply w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center;
    }
    .toggle-button {
      @apply text-indigo-400 hover:text-indigo-300 font-semibold transition-colors;
    }
    .error-message {
      @apply bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm;
    }
  `]
})
export class LoginComponent {
  languageService = inject(LanguageService);
  authService = inject(AuthService);

  isLoginView = signal(true);
  email = '';
  password = '';
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  
  toggleView() {
    this.isLoginView.update(v => !v);
    this.errorMessage.set(null);
    this.email = '';
    this.password = '';
  }

  async handleSubmit() {
    if (!this.email || !this.password) {
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      if (this.isLoginView()) {
        await this.authService.login(this.email, this.password);
      } else {
        await this.authService.signUp(this.email, this.password);
      }
    } catch (err) {
      if (err instanceof Error) {
        const translatedError = this.languageService.translate(`auth.error.${err.message}`);
        this.errorMessage.set(translatedError === `auth.error.${err.message}` ? err.message : translatedError);
      } else {
        this.errorMessage.set(this.languageService.translate('auth.error.An unexpected error occurred.'));
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}