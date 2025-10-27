import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
      <div class="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center animate-scale-in">
        <h3 class="text-lg font-medium text-white mb-4">{{ message() }}</h3>
        <div class="flex justify-center gap-4 mt-6">
          <button 
            (click)="onCancel()" 
            class="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-colors">
            {{ languageService.translate('dashboard.cancel') }}
          </button>
          <button 
            (click)="onConfirm()"
            class="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">
            {{ languageService.translate('dashboard.confirmDelete') }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
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
  `
})
export class ConfirmationModalComponent {
  message = input.required<string>();
  confirm = output<void>();
  cancel = output<void>();
  
  languageService = inject(LanguageService);

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
