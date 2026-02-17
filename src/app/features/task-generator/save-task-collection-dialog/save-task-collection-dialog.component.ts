import { Component, input, output, signal } from '@angular/core';
import { Task } from '../../../shared/models/task.model';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, SaveIcon } from 'lucide-angular';

@Component({
  selector: 'app-save-task-collection-dialog',
    imports: [
        FormsModule,
        LucideAngularModule
    ],
  templateUrl: './save-task-collection-dialog.component.html',
  styleUrl: './save-task-collection-dialog.component.css'
})
export class SaveTaskCollectionDialogComponent {
    tasks = input<Task[]>();
    onSave = output<string>();

    title = signal('');

    protected readonly saveIcon = SaveIcon;

    save() {
        this.onSave.emit(this.title());
        this.closeModal();
    }

    closeModal() {
        const modal = (document.getElementById('save_collection_modal') as HTMLDialogElement);
        this.title.set('');
        if (modal) modal.close();
    }

    isTitleValid() {
        return this.title().trim().length > 0;
    }
}
