import { Injectable, signal, computed } from '@angular/core';

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
  private readonly USERS_STORAGE_KEY = 'evolveme_users';
  private readonly SESSION_KEY = 'evolveme_session';

  readonly currentUser = signal<User | null>(this.getInitialUser());
  readonly isAuthenticated = computed(() => !!this.currentUser());

  private getStoredUsers(): StoredUser[] {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const usersJson = localStorage.getItem(this.USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  private saveStoredUsers(users: StoredUser[]): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(users));
  }

  private getInitialUser(): User | null {
    if (typeof window === 'undefined' || !window.sessionStorage) return null;
    const sessionEmail = sessionStorage.getItem(this.SESSION_KEY);
    return sessionEmail ? { email: sessionEmail } : null;
  }
  
  async signUp(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // Simulate network latency
        const users = this.getStoredUsers();
        const normalizedEmail = email.toLowerCase();
        if (users.some(u => u.email === normalizedEmail)) {
          reject(new Error('Email already registered.'));
          return;
        }
        // In a real app, you would send the password to a server to be securely hashed.
        const passwordHash = `hashed_${password}`; 
        users.push({ email: normalizedEmail, passwordHash });
        this.saveStoredUsers(users);
        
        // Automatically log in the new user
        const newUser = { email: normalizedEmail };
        this.currentUser.set(newUser);
        sessionStorage.setItem(this.SESSION_KEY, normalizedEmail);
        resolve(newUser);
      }, 500);
    });
  }

  async login(email: string, password: string): Promise<User> {
     return new Promise((resolve, reject) => {
        setTimeout(() => { // Simulate network latency
            const users = this.getStoredUsers();
            const normalizedEmail = email.toLowerCase();
            const user = users.find(u => u.email === normalizedEmail);
            const passwordHash = `hashed_${password}`;
            
            if (user && user.passwordHash === passwordHash) {
                const loggedInUser = { email: user.email };
                this.currentUser.set(loggedInUser);
                sessionStorage.setItem(this.SESSION_KEY, loggedInUser.email);
                resolve(loggedInUser);
            } else {
                reject(new Error('Invalid email or password.'));
            }
        }, 500);
     });
  }

  logout(): void {
    this.currentUser.set(null);
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem(this.SESSION_KEY);
    }
  }
}