import { Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CheckCheckIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login',
    imports: [
        LucideAngularModule
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
    private readonly authService = inject(AuthService);
    private readonly destroyRef = inject(DestroyRef);

    private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

    protected readonly icons = {
        checkCircle: CheckCheckIcon,
    }

    open(): void {
        this.dialog().nativeElement.showModal();
    }

    close(): void {
        this.dialog().nativeElement.close();
    }

    signInWithGoogle(): void {
        this.authService.signInWithGoogle()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                error: (err) => {
                    console.error('[LoginModal] Login sequence failed', err);
                }
                // Note: success is handled by the redirect to Google
            });
    }
}
