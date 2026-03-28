import { Component, DestroyRef, inject, input, viewChild } from '@angular/core';
import { LogInIcon, LogOutIcon, LucideAngularModule, MenuIcon, MoonIcon, SunIcon, UserIcon } from 'lucide-angular';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoginComponent } from '../auth/login/login.component';
import { ToastService } from '../../core/services/toast.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-navigation',
    imports: [
        LucideAngularModule,
        LoginComponent
    ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
    authService = inject(AuthService);
    readonly themeService = inject(ThemeService);
    toastService = inject(ToastService);
    private readonly analyticsService = inject(AnalyticsService);
    private destroyRef = inject(DestroyRef);
    private router = inject(Router);

    loginModal = viewChild.required<LoginComponent>(LoginComponent);

    showMenu = input(true);

    public readonly icons = {
        menu: MenuIcon,
        moon: MoonIcon,
        login: LogInIcon,
        logout: LogOutIcon,
        sun: SunIcon,
        user: UserIcon,
    }

    onThemeToggleClick(event: MouseEvent): void {
        event.preventDefault();
        this.themeService.toggle();
    }

    navigateHome() {
        this.router.navigate(['/']);
    }

    openLoginModal() {
        this.loginModal().open();
    }

    signOut(): void {
        this.authService.signOut()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.analyticsService.clearUser();
                    this.toastService.success('Logged out successfully');
                },
                error: (err) => {
                    console.error('Logout sequence failed', err);
                }
            });
    }
}
