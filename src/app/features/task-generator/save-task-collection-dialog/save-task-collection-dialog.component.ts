import { Component, computed, ElementRef, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyIcon, LucideAngularModule, SaveIcon, XIcon } from 'lucide-angular';

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
    saved = output<string>();
    title = signal('');
    isDuplicate = signal(false);
    isValid = computed(() => this.title().trim().length > 0);

    dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialogRef');

    protected readonly icons = {
        save: SaveIcon,
        close: XIcon,
        copy: CopyIcon,
    };

    show(isDuplicate: boolean = false) {
        this.isDuplicate.set(isDuplicate);
        this.title.set('');
        this.dialog().nativeElement.showModal();
    }

    submit() {
        if (!this.isValid()) {
            return;
        }

        this.saved.emit(this.title());
        this.close();
    }

    close() {
        this.dialog().nativeElement.close();
    }
}
