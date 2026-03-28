import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'tasquery-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** Resolved UI theme: follows system until the user picks light or dark (then stored). */
  readonly effectiveTheme = signal<'light' | 'dark'>('light');

  constructor() {
    this.applyFromPreference();
    if (typeof window === 'undefined') {
      return;
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.getStoredPreference() === null) {
        this.applyResolved(this.resolveSystemTheme());
      }
    });
  }

  getStoredPreference(): 'light' | 'dark' | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v === 'light' || v === 'dark' ? v : null;
    } catch {
      return null;
    }
  }

  resolveSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') {
      return 'light';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  resolveEffective(): 'light' | 'dark' {
    return this.getStoredPreference() ?? this.resolveSystemTheme();
  }

  /** Sync DOM + signal from storage or system (e.g. after inline script in index.html). */
  applyFromPreference(): void {
    this.applyResolved(this.resolveEffective());
  }

  private applyResolved(theme: 'light' | 'dark'): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    this.effectiveTheme.set(theme);
  }

  /** Toggle light ↔ dark and persist (user override). */
  toggle(): void {
    const next = this.effectiveTheme() === 'dark' ? 'light' : 'dark';
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore quota / private mode */
      }
    }
    this.applyResolved(next);
  }
}
