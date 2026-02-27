import { Component, signal, viewChild } from '@angular/core';
import { TermsOfUseComponent } from "../../components/terms-of-use/terms-of-use.component";
import { PrivacyPolicyComponent } from '../../components/privacy-policy/privacy-policy.component';
import { ContactModalComponent } from '../../shared/ui/contact-modal/contact-modal.component';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, TestTubeDiagonal } from 'lucide-angular';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { WaitlistModalComponent } from '../../shared/ui/waitlist-modal/waitlist-modal.component';

@Component({
  selector: 'app-landing-page',
    imports: [
        TermsOfUseComponent,
        PrivacyPolicyComponent,
        ContactModalComponent,
        FormsModule,
        LucideAngularModule,
        NavigationComponent,
        WaitlistModalComponent
    ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
    protected readonly tubeIcon = TestTubeDiagonal;
    waitlistModal = viewChild.required<WaitlistModalComponent>(WaitlistModalComponent);

    year = signal(new Date().getFullYear());

    showWaitlistModal() {
        this.waitlistModal().show();
    }
}
