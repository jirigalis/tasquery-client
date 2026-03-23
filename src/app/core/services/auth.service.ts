import { computed, DestroyRef, inject, Injectable } from '@angular/core';
import { createClient, OAuthResponse, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, defer, from, Observable, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private readonly destroyRef = inject(DestroyRef);
    private readonly supabase: SupabaseClient = createClient(
        environment.supabaseUrl,
        environment.supabaseKey
    );

    private readonly authStateSubject = new BehaviorSubject<User | null | undefined>(undefined);
    readonly authState$ = this.authStateSubject.asObservable();
    readonly currentUser = toSignal(this.authState$, { initialValue: undefined });
    readonly isAuthLoading = computed(() => this.currentUser() === undefined);

    constructor() {
        this.initializeAuthState();
    }

    private initializeAuthState() {
        // Initial fetch on application start
        const { data: { subscription } } = this.supabase.auth.onAuthStateChange(
            (_event, session) => {
                this.authStateSubject.next(session?.user ?? null);
            }
        );

        // Cleanup
        this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }

    signInWithProvider(provider: 'google' | 'github'): Observable<OAuthResponse> {
        // Defer ensures the Promise is not executed until someone subscribes to this Observable
        return defer(() => {
            this.authStateSubject.next(undefined);

            return from(this.supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: window.location.href
                }
            }));
            }
        );
    }

    signInWithGoogle = () => this.signInWithProvider('google');

    // not supported yet
    // signInWithGitHub = () => this.signInWithProvider('github');

    signOut(): Observable<{ error: Error | null }> {
        return defer(() => {
            this.authStateSubject.next(undefined);
            return from(this.supabase.auth.signOut()).pipe(
                // in case of error, try to fetch the current session
                tap({
                    error: () => {
                        const currentSession = this.supabase.auth.getSession();
                        currentSession.then(({ data: { session } }) => {
                            this.authStateSubject.next(session?.user ?? null);
                        });
                    },
                })
            );
        });
    }

    async getSessionToken(): Promise<string | null> {
        const { data: { session }, error } = await this.supabase.auth.getSession();

        if (error) {
            console.error('Error fetching session:', error);
            return null;
        }

        return session?.access_token ?? null;
    }
}
