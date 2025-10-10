import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css'
})
export class PrivacyPolicyComponent {
    openPrivacyModal() {
        const modal = document.getElementById('privacy_modal') as HTMLDialogElement;
        if (modal) modal.showModal();
    }

}
