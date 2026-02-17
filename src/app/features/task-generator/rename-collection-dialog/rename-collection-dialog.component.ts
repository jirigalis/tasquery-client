import { Component, effect, input, output, signal } from '@angular/core';
import { TaskCollection } from '../../../shared/models/task-collection.model';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, PencilIcon } from 'lucide-angular';

@Component({
  selector: 'app-rename-collection-dialog',
    imports: [
        FormsModule,
        LucideAngularModule
    ],
  templateUrl: './rename-collection-dialog.component.html',
  styleUrl: './rename-collection-dialog.component.css'
})
export class RenameCollectionDialogComponent {
    collection = input.required<TaskCollection>();
    onSave = output<string>();

    title = signal('');

    protected readonly editIcon = PencilIcon;

    constructor() {
        effect(() => {
            const currentTitle = this.collection().title;
            this.title.set(currentTitle);
        });
    }

    save() {
        this.onSave.emit(this.title().trim());
        this.closeModal();
    }

    closeModal() {
        const modal = (document.getElementById('rename_collection_modal') as HTMLDialogElement);
        if (modal) modal.close();
    }

    isTitleValid() {
        return this.title().trim().length > 0;
    }
}
