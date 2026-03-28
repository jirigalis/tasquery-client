import { Component, signal } from '@angular/core';
import { TermsOfUseComponent } from '../../../../components/terms-of-use/terms-of-use.component';
import { PrivacyPolicyComponent } from '../../../../components/privacy-policy/privacy-policy.component';
import { ContactModalComponent } from '../../../../shared/ui/contact-modal/contact-modal.component';

@Component({
  selector: 'app-lp-footer',
  imports: [TermsOfUseComponent, PrivacyPolicyComponent, ContactModalComponent],
  templateUrl: './lp-footer.component.html',
  styleUrl: './lp-footer.component.css',
})
export class LpFooterComponent {
  year = signal(new Date().getFullYear());
}
