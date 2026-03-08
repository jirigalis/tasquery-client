import { Component, input, output } from '@angular/core';
import { TaskCollection } from '../../../../shared/models/task-collection.model';
import { CloudCheckIcon, CopyIcon, LucideAngularModule, PencilIcon, SaveIcon } from 'lucide-angular';

@Component({
  selector: 'app-generator-results-toolbar',
    imports: [
        LucideAngularModule
    ],
  templateUrl: './generator-results-toolbar.component.html',
  styleUrl: './generator-results-toolbar.component.css',
})
export class GeneratorResultsToolbarComponent {
    activeCollection = input<TaskCollection | null>(null);

    rename = output<void>();
    save = output<boolean>();

    protected readonly icons = {
        cloudCheck: CloudCheckIcon,
        edit: PencilIcon,
        copy: CopyIcon,
        save: SaveIcon
    };
}
