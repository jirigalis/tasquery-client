import { Component } from '@angular/core';
import { BrainIcon, FileTextIcon, LucideAngularModule, MessageCircleMoreIcon } from 'lucide-angular';

@Component({
  selector: 'app-lp-use-cases',
    imports: [
        LucideAngularModule
    ],
  templateUrl: './lp-use-cases.component.html',
  styleUrl: './lp-use-cases.component.css',
})
export class LpUseCasesComponent {

    protected readonly MessageCircleMoreIcon = MessageCircleMoreIcon;
    protected readonly FileTextIcon = FileTextIcon;
    protected readonly BrainIcon = BrainIcon;
}
