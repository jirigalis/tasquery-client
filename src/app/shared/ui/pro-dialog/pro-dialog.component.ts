import { Component, ElementRef, output, viewChild } from '@angular/core';
import { CircleCheckIcon, CrownIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-pro-dialog',
    imports: [
        LucideAngularModule
    ],
  templateUrl: './pro-dialog.component.html',
  styleUrl: './pro-dialog.component.css',
})
export class ProDialogComponent {
    protected readonly icons = {
        crown: CrownIcon,
        checkCircle: CircleCheckIcon,
    }

    dialog = viewChild.required<ElementRef<HTMLDialogElement>>('proModal');

    openWaitlist = output<void>();

    show() {
        this.dialog().nativeElement.showModal();
    }

    close() {
        this.dialog().nativeElement.close();
    }

    handleJoinClick() {
        this.close();

        setTimeout(() => {
            this.openWaitlist.emit();
        }, 50);
    }
}
