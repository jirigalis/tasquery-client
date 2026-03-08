import { Component, output } from '@angular/core';
import { LucideAngularModule, SparklesIcon } from 'lucide-angular';

@Component({
  selector: 'app-generator-empty-state',
  imports: [LucideAngularModule],
  templateUrl: './generator-empty-state.component.html',
  styleUrl: './generator-empty-state.component.css',
})
export class GeneratorEmptyStateComponent {
    action = output<void>();

    protected readonly icons = {
        magic: SparklesIcon,
    }
}
