import { Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { CheckIcon, CrownIcon, LucideAngularModule, XIcon } from 'lucide-angular';
import { WaitlistService } from '../../../core/services/waitlist.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '../../../core/services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-waitlist-modal',
    imports: [
        LucideAngularModule,
        FormsModule
    ],
  templateUrl: './waitlist-modal.component.html',
  styleUrl: './waitlist-modal.component.css',
})
export class WaitlistModalComponent {
    dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialogRef');
    waitlistService = inject(WaitlistService);
    destroyRef = inject(DestroyRef);
    toastService = inject(ToastService);

    email = signal('');
    selectedFeature = signal('');
    isSubmitting = signal(false);

    protected readonly icons = {
        crown: CrownIcon,
        close: XIcon,
        check: CheckIcon,
    }

    proFeatures = [
        { id: 'jira-integration', label: 'Direct Jira & Linear Integration' },
        { id: 'unlimited-context', label: 'Unlimited Text Input' },
        { id: 'cloud-history', label: 'Cloud Sync & History' },
        { id: 'custom-templates', label: 'Custom Team Templates & AI Tone' }
    ];

    show() {
        this.dialog().nativeElement.showModal();
    }

    close() {
        this.dialog().nativeElement.close();
        this.email.set('');
        this.selectedFeature.set('');
    }

    submit() {
        if (!this.isEmailValid() || this.isSubmitting()) {
            return;
        }

        this.isSubmitting.set(true);
        this.waitlistService.join(this.email()!, this.selectedFeature()!).pipe(
            takeUntilDestroyed(this.destroyRef),
        ).subscribe({
            next: () => {
                this.isSubmitting.set(false);
                this.toastService.success('You are on the list! 🎉');
                this.close();
            },
            error: (err) => {
                this.isSubmitting.set(false);
                if (err.status === 409) {
                    this.toastService.info('You are already on the waitlist! 😉');
                } else {
                    console.error(err);
                    this.toastService.error('Something went wrong. Please try again.');
                }
            }
        })
    }

    isEmailValid(): boolean {
        return !!this.email() && /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(this.email()!);
    }
}
