import { Component, input, output } from '@angular/core';
import { CheckIcon, LucideAngularModule, PencilIcon, RedoIcon, Trash2Icon, UndoIcon } from 'lucide-angular';
import { Task } from '../../models/task.model';
import { RefineAction } from '../../models/refine.model';
import { TaskCopyComponent } from '../task-copy/task-copy.component';
import { TaskRefineActionsComponent } from '../task-refine-actions/task-refine-actions.component';

@Component({
    selector: 'app-task-controls',
    imports: [LucideAngularModule, TaskCopyComponent, TaskRefineActionsComponent],
    templateUrl: './task-controls.component.html',
    styleUrl: './task-controls.component.css',
})
export class TaskControlsComponent {
    task = input.required<Task>();
    editMode = input.required<boolean>();
    isRefining = input.required<boolean>();
    hasUndo = input.required<boolean>();
    hasRedo = input.required<boolean>();

    requireLogin = output<void>();
    cancelEdit = output<void>();
    save = output<void>();
    toggleEdit = output<void>();
    deleteRequested = output<void>();
    applyAiAction = output<RefineAction>();
    undo = output<void>();
    redo = output<void>();

    protected readonly icons = {
        check: CheckIcon,
        edit: PencilIcon,
        trash: Trash2Icon,
        undo: UndoIcon,
        redo: RedoIcon,
    };
}
