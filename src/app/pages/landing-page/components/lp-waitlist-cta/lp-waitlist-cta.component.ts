import { Component, viewChild } from '@angular/core';
import { WaitlistModalComponent } from '../../../../shared/ui/waitlist-modal/waitlist-modal.component';

@Component({
  selector: 'app-lp-waitlist-cta',
  imports: [WaitlistModalComponent],
  templateUrl: './lp-waitlist-cta.component.html',
  styleUrl: './lp-waitlist-cta.component.css',
})
export class LpWaitlistCtaComponent {
  waitlistModal = viewChild.required<WaitlistModalComponent>(WaitlistModalComponent);

  showWaitlistModal() {
    this.waitlistModal().show();
  }
}
