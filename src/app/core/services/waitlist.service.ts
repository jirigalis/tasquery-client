import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WaitlistService {
    private readonly http: HttpClient = inject(HttpClient);
    private apiUrl: string = environment.apiUrl;

    // Freemium Limit Logic
    private readonly MAGIC_LIMIT = 2;
    private readonly STORAGE_KEY_USAGE = 'tq_magic_usage';
    private readonly STORAGE_KEY_UNLOCKED = 'tq_magic_unlocked';

    // State signals
    magicActionsUsed = signal<number>(this.getInitialUsage());
    isUnlimitedUnlocked = signal<boolean>(this.getUnlockedStatus());

    // Computed states for the UI
    canUseMagicAction = computed(() => this.isUnlimitedUnlocked() || this.magicActionsUsed() < this.MAGIC_LIMIT);
    remainingUses = computed(() => Math.max(0, this.MAGIC_LIMIT - this.magicActionsUsed()));

    private getInitialUsage(): number {
        const stored = localStorage.getItem(this.STORAGE_KEY_USAGE);
        return stored ? parseInt(stored, 10) : 0;
    }

    private getUnlockedStatus(): boolean {
        return localStorage.getItem(this.STORAGE_KEY_UNLOCKED) === 'true';
    }

    incrementUsage(): void {
        const current = this.magicActionsUsed() + 1;
        this.magicActionsUsed.set(current);
        localStorage.setItem(this.STORAGE_KEY_USAGE, current.toString());
    }

    join(email: string, feature: string) {
        return this.http.post(this.apiUrl + '/waitlist', { email, feature });
    }

    // Call this upon successful waitlist join
    unlockUnlimitedAccess(): void {
        this.isUnlimitedUnlocked.set(true);
        localStorage.setItem(this.STORAGE_KEY_UNLOCKED, 'true');
    }
}
