import { Component, computed, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { TaskCollection } from '../../../shared/models/task-collection.model';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, PencilIcon, XIcon } from 'lucide-angular';

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
    saved = output<string>();
    title = signal('');
    isValid = computed(() => this.title().trim().length > 0);

    dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialogRef');

    protected readonly icons = {
        edit: PencilIcon,
        close: XIcon,
    };

    show() {
        this.title.set(this.collection().title);
        this.dialog().nativeElement.showModal();
    }

    close() {
        this.dialog().nativeElement.close();
    }

    submit() {
        if (!this.isValid()) {
            return;
        }

        this.saved.emit(this.title().trim());
        this.close();
    }
}
