import { Component } from '@angular/core';
import { LucideAngularModule, MessageSquareIcon } from 'lucide-angular';

@Component({
  selector: 'app-lp-socials',
    imports: [
        LucideAngularModule
    ],
  templateUrl: './lp-socials.component.html',
  styleUrl: './lp-socials.component.css',
})
export class LpSocialsComponent {
    protected readonly icons = {
        messageSquare: MessageSquareIcon,
    }

}
