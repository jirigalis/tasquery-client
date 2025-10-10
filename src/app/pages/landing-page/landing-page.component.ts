import { Component, DestroyRef, inject, signal } from '@angular/core';
import { TermsOfUseComponent } from "../../components/terms-of-use/terms-of-use.component";
import { PrivacyPolicyComponent } from '../../components/privacy-policy/privacy-policy.component';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';
import { FormsModule } from '@angular/forms';
import { WaitlistService } from '../../core/waitlist.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CircleAlert, LucideAngularModule, TestTubeDiagonal } from 'lucide-angular';
import { NavigationComponent } from '../../components/navigation/navigation.component';

@Component({
  selector: 'app-landing-page',
    imports: [
        TermsOfUseComponent,
        PrivacyPolicyComponent,
        ContactModalComponent,
        FormsModule,
        LucideAngularModule,
        NavigationComponent
    ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
    private waitlistService = inject(WaitlistService);
    private destroyRef = inject(DestroyRef);
    protected readonly circleAlert = CircleAlert;
    protected readonly tubeIcon = TestTubeDiagonal;

    email = signal<string | undefined>(undefined);
    isLoading = signal(false);
    toastMessage = signal<string>('');
    error = signal<string | undefined>(undefined);
    year = signal(new Date().getFullYear());

    joinWaitlist() {
        if (!this.isEmailValid() || this.isLoading()) {
            return;
        }

        this.isLoading.set(true);
        this.waitlistService.join(this.email()!).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.toastMessage.set('Thank you for joining the waitlist!');
                this.email.set(undefined);

                setTimeout(() => this.toastMessage.set(''), 5000);
            },
            error: (err) => {
                this.isLoading.set(false);
                this.error.set(err.error.message || 'An error occurred. Please try again later.');
            }
        })
    }

    isEmailValid(): boolean {
        return !!this.email() && /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(this.email()!);
    }

}
