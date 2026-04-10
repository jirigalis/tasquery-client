import { Component, computed, inject, output, signal } from '@angular/core';
import { ListIcon, LucideAngularModule, TrashIcon } from 'lucide-angular';
import { DatePipe } from '@angular/common';
import { TaskCollectionsService } from '../../../core/services/task-collections.service';
import { TaskCollection } from '../../models/task-collection.model';
import { PRESET_MODE_LABELS, PresetMode } from '../../models/task-preset.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-task-collection-drawer',
    imports: [
        LucideAngularModule,
        DatePipe
    ],
  templateUrl: './task-collection-drawer.component.html',
  styleUrl: './task-collection-drawer.component.css'
})
export class TaskCollectionDrawerComponent  {
    private taskCollectionService = inject(TaskCollectionsService);
    private toastService = inject(ToastService);

    load = output<TaskCollection>();

    collections = computed(() => this.taskCollectionService.collections());
    collectionToDelete = signal<TaskCollection | null>(null);
    activeCollectionId = computed(
        () => this.taskCollectionService.activeCollection()
            ? this.taskCollectionService.activeCollection()!.id
            : null);

    protected readonly listIcon = ListIcon;
    protected readonly trashIcon = TrashIcon;

    presetLabel(collection: TaskCollection): string {
        const preset = collection.createdWithPreset;
        return preset ? PRESET_MODE_LABELS[preset] : 'Unknown';
    }

    /** Full DaisyUI `badge` class string for the collection preset. */
    presetBadgeClasses(collection: TaskCollection): string {
        const base = 'badge badge-sm shrink-0 font-medium normal-case';
        const preset = collection.createdWithPreset;
        if (!preset) {
            return `${base} badge-ghost opacity-70`;
        }
        const variant: Record<PresetMode, string> = {
            minimalist: 'badge-ghost',
            standard: 'badge-primary badge-outline',
            technical: 'badge-secondary',
            summary: 'badge-accent badge-outline',
        };
        return `${base} ${variant[preset] ?? 'badge-ghost'}`;
    }

    loadCollection(collection: TaskCollection) {
        this.load.emit(collection);
    }

    openDeleteModal(collection: TaskCollection, event: Event) {
        event.stopPropagation();
        this.collectionToDelete.set(collection);

        const modal = document.getElementById('delete_collection_modal') as HTMLDialogElement;
        if (modal) modal.showModal();
    }

    confirmDelete() {
        const collection = this.collectionToDelete();
        if (collection) {
            this.taskCollectionService.delete(collection.id);

            if (this.activeCollectionId() === collection.id) {
                this.taskCollectionService.clearActive();
            }
            this.toastService.success('Collection deleted successfully.');
        }
        this.collectionToDelete.set(null); // Reset
    }
}
