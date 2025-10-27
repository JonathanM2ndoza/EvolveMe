import { Injectable } from '@angular/core';

const DB_NAME = 'EvolveMeDB';
const DB_VERSION = 1;

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return reject('IndexedDB is not supported.');
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject('IndexedDB error: ' + request.error);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        // For storing user credentials. Key is part of the object.
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'email' });
        }
        // For storing other user data, where email is the key.
        if (!db.objectStoreNames.contains('userProfiles')) {
            db.createObjectStore('userProfiles'); 
        }
        if (!db.objectStoreNames.contains('userScores')) {
            db.createObjectStore('userScores');
        }
        if (!db.objectStoreNames.contains('selfieHistories')) {
            db.createObjectStore('selfieHistories');
        }
      };
    });
  }

  private async getStore(storeName: string, mode: IDBTransactionMode): Promise<IDBObjectStore> {
    const db = await this.dbPromise;
    return db.transaction(storeName, mode).objectStore(storeName);
  }
  
  async get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    const store = await this.getStore(storeName, 'readonly');
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async getAll<T>(storeName: string): Promise<T[]> {
    const store = await this.getStore(storeName, 'readonly');
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
  }

  async set<T>(storeName: string, value: T, key?: IDBValidKey): Promise<IDBValidKey> {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(value, key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, key: IDBValidKey): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise<void>((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}