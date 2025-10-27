import { Component, ChangeDetectionStrategy, output, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class TermsComponent {
  close = output<void>();
  languageService = inject(LanguageService);

  onClose() {
    this.close.emit();
  }
}