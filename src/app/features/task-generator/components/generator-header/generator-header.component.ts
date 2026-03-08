import { Component, output } from '@angular/core';
import { CrownIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-generator-header',
    imports: [
        LucideAngularModule
    ],
  templateUrl: './generator-header.component.html',
  styleUrl: './generator-header.component.css',
})
export class GeneratorHeaderComponent {
    openPro = output<void>();

    protected readonly icons = {
        crown: CrownIcon,
    }

    onProClick(): void {
        this.openPro.emit();
    }
}
