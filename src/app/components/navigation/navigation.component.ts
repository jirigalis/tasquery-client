import { Component, DestroyRef, inject, input, viewChild } from '@angular/core';
import { LogInIcon, LogOutIcon, LucideAngularModule, MenuIcon, UserIcon } from 'lucide-angular';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoginComponent } from '../auth/login/login.component';
import { ToastService } from '../../core/services/toast.service';

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
    toastService = inject(ToastService);
    private destroyRef = inject(DestroyRef);
    private router = inject(Router);

    loginModal = viewChild.required<LoginComponent>(LoginComponent);

    showMenu = input(true);

    public readonly icons = {
        menu: MenuIcon,
        login: LogInIcon,
        logout: LogOutIcon,
        user: UserIcon,
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
                    this.toastService.success('Logged out successfully');
                },
                error: (err) => {
                    console.error('Logout sequence failed', err);
                }
            });
    }
}
