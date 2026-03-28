import { Component, viewChild } from '@angular/core';
import { WaitlistModalComponent } from '../../../../shared/ui/waitlist-modal/waitlist-modal.component';
import { LucideAngularModule, TestTubeDiagonal } from 'lucide-angular';

@Component({
  selector: 'app-lp-waitlist-cta',
    imports: [WaitlistModalComponent, LucideAngularModule],
  templateUrl: './lp-waitlist-cta.component.html',
  styleUrl: './lp-waitlist-cta.component.css',
})
export class LpWaitlistCtaComponent {
  waitlistModal = viewChild.required<WaitlistModalComponent>(WaitlistModalComponent);

  showWaitlistModal() {
    this.waitlistModal().show();
  }

    protected readonly tubeIcon = TestTubeDiagonal;
}
