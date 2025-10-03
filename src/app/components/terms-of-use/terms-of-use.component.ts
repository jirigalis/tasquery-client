import { Component } from '@angular/core';

@Component({
    selector: 'app-terms-of-use',
    imports: [],
    templateUrl: './terms-of-use.component.html',
    styleUrl: './terms-of-use.component.css',
})
export class TermsOfUseComponent {
    openTermsModal() {
        const modal = document.getElementById('terms_modal') as HTMLDialogElement;
        if (modal) modal.showModal();
    }
}
