import { Injectable, signal, computed, inject } from '@angular/core';
import { IndexedDbService } from './indexed-db.service';

export interface User {
  email: string;
}

interface StoredUser {
  email: string;
  passwordHash: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly SESSION_KEY = 'evolveme_session';
  private dbService = inject(IndexedDbService);

  readonly currentUser = signal<User | null>(this.getInitialUser());
  readonly isAuthenticated = computed(() => !!this.currentUser());

  private getStoredUsers(): Promise<StoredUser[]> {
    if (typeof window === 'undefined') return Promise.resolve([]);
    return this.dbService.getAll<StoredUser>('users');
  }

  private saveUser(user: StoredUser): Promise<IDBValidKey> {
    if (typeof window === 'undefined') return Promise.reject(new Error('Window not defined'));
    return this.dbService.set('users', user);
  }

  private getInitialUser(): User | null {
    if (typeof window === 'undefined' || !window.sessionStorage) return null;
    const sessionEmail = sessionStorage.getItem(this.SESSION_KEY);
    return sessionEmail ? { email: sessionEmail } : null;
  }
  
  async signUp(email: string, password: string): Promise<User> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = await this.getStoredUsers();
    const normalizedEmail = email.toLowerCase();
    if (users.some(u => u.email === normalizedEmail)) {
      throw new Error('Email already registered.');
    }
    // In a real app, you would send the password to a server to be securely hashed.
    const passwordHash = `hashed_${password}`; 
    await this.saveUser({ email: normalizedEmail, passwordHash });
    
    // Automatically log in the new user
    const newUser = { email: normalizedEmail };
    this.currentUser.set(newUser);
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem(this.SESSION_KEY, normalizedEmail);
    }
    return newUser;
  }

  async login(email: string, password: string): Promise<User> {
     // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = await this.getStoredUsers();
    const normalizedEmail = email.toLowerCase();
    const user = users.find(u => u.email === normalizedEmail);
    const passwordHash = `hashed_${password}`;
    
    if (user && user.passwordHash === passwordHash) {
        const loggedInUser = { email: user.email };
        this.currentUser.set(loggedInUser);
        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.setItem(this.SESSION_KEY, loggedInUser.email);
        }
        return loggedInUser;
    } else {
        throw new Error('Invalid email or password.');
    }
  }

  logout(): void {
    this.currentUser.set(null);
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem(this.SESSION_KEY);
    }
  }
}