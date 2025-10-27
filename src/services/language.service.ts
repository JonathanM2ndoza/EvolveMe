import { Injectable, signal, effect } from '@angular/core';
import { en } from '../i18n/en';
import { es } from '../i18n/es';

export type Language = 'en' | 'es';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private translations: { [key: string]: any } = { en, es };

  readonly language = signal<Language>(this.loadLanguageFromStorage());

  constructor() {
    effect(() => {
      this.saveLanguageToStorage(this.language());
    });
  }

  private loadLanguageFromStorage(): Language {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedLang = localStorage.getItem('userLanguage');
      return storedLang === 'es' ? 'es' : 'en';
    }
    return 'en';
  }

  private saveLanguageToStorage(lang: Language) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('userLanguage', lang);
    }
  }

  setLanguage(lang: Language) {
    this.language.set(lang);
  }
  
  toggleLanguage() {
      this.setLanguage(this.language() === 'en' ? 'es' : 'en');
  }

  translate(key: string, params?: Record<string, any>): string {
    const lang = this.language();
    let translation = this.getNestedValue(this.translations[lang], key);

    if (!translation) {
      // Fallback to English if translation is missing
      translation = this.getNestedValue(this.translations['en'], key);
    }

    if (translation && params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        translation = translation.replace(`{${paramKey}}`, String(paramValue));
      }
    }

    return translation || key;
  }

  private getNestedValue(obj: any, key: string): string | undefined {
    return key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
  }
}
