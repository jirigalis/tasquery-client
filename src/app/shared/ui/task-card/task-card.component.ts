import { Component, computed, DestroyRef, inject, input, OnInit, output, signal, viewChild, ViewChild } from '@angular/core';
import { CircleAlertIcon, InfoIcon, LucideAngularModule, SparklesIcon, TagsIcon, TriangleAlertIcon } from 'lucide-angular';
import { Task, TaskPriority } from '../../models/task.model';
import { ParseService } from '../../../core/services/parse.service';
import { wrapInHtml } from '../../utils/export';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { NgClass } from '@angular/common';
import { GENERAL_CONFIG } from '../../../config/general';
import { ToastService } from '../../../core/services/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RefineAction } from '../../models/refine.model';
import { WaitlistModalComponent } from '../waitlist-modal/waitlist-modal.component';
import { WaitlistService } from '../../../core/services/waitlist.service';
import { LoginComponent } from '../../../components/auth/login/login.component';
import { TaskControlsComponent } from '../task-controls/task-controls.component';
import { TqTagComponent } from '../tq-tag/tq-tag.component';
import { AuthService } from '../../../core/services/auth.service';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-task-card',
    imports: [
        LucideAngularModule,
        FormsModule,
        ConfirmDialogComponent,
        NgClass,
        WaitlistModalComponent,
        TaskControlsComponent,
        LoginComponent,
        TqTagComponent
    ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent implements OnInit {
    destroyRef = inject(DestroyRef);
    private toastService = inject(ToastService);
    private parseService: ParseService = inject(ParseService);
    private waitlistService = inject(WaitlistService);
    private readonly authService = inject(AuthService);
    private readonly analyticsService = inject(AnalyticsService);

    task = input.required<Task>();

    saveTask = output<Task>();
    deleteTask = output<Task>();

    editMode = signal<boolean>(false);
    editableTask = signal<Task | undefined>(undefined);
    editableTags = signal<string>('');

    isRefining = signal<boolean>(false);
    lastActionSuccess = signal<boolean>(false);
    undoTaskState = signal<Task | null>(null);
    redoTaskState = signal<Task | null>(null);

    @ViewChild('deleteModal') deleteDialog!: ConfirmDialogComponent;
    loginModal = viewChild.required<LoginComponent>(LoginComponent);
    waitlistModal = viewChild.required<WaitlistModalComponent>(WaitlistModalComponent);

    protected readonly limits = {
        title: GENERAL_CONFIG.MAX_TITLE_LENGTH,
        content: GENERAL_CONFIG.MAX_TASK_CONTENT_LENGTH,
        tags: GENERAL_CONFIG.MAX_TAGS_LENGTH,
    };
    priorityConfig = computed(() => this.getPriorityMeta(this.task().priority));
    availablePriorities = GENERAL_CONFIG.TASK_PRIORITIES;
    editablePriorityConfig = computed(() =>
        this.editableTask() ? this.getPriorityMeta(this.editableTask()!.priority) : this.getPriorityMeta(TaskPriority.LOW)
    );
    formattedContent = computed(() => {
        const content = this.task().content;
        if (!content) {
            return '';
        }

        return wrapInHtml(content, 'markdown');
    });
    maxInputLength = computed(() => {
        // TODO: replace with meaningful values when decided
        return this.authService.currentUser() ? GENERAL_CONFIG.MAX_TASK_CONTENT_LENGTH : GENERAL_CONFIG.MAX_TASK_CONTENT_LENGTH;
    });

    protected readonly icons = {
        tags: TagsIcon,
        high: CircleAlertIcon,
        medium: TriangleAlertIcon,
        low: InfoIcon,
        magic: SparklesIcon,
    };

    ngOnInit(): void {
        this.resetEditState();
    }

    getPriorityMeta(priority: TaskPriority | undefined) {
        const p = (priority || '').toLowerCase();
        switch (p) {
            case TaskPriority.HIGH: return { label: 'High', colorClass: 'text-error', bgClass: 'bg-error/10 border-error/20', icon: this.icons.high };
            case TaskPriority.MEDIUM: return { label: 'Medium', colorClass: 'text-warning', bgClass: 'bg-warning/10 border-warning/20', icon: this.icons.medium };
            case TaskPriority.LOW: return { label: 'Low', colorClass: 'text-success', bgClass: 'bg-success/10 border-success/20', icon: this.icons.low };
            default: return { label: 'Normal', colorClass: 'text-base-content/70', bgClass: 'bg-base-200', icon: this.icons.low };
        }
    }

    setPriority(priority: TaskPriority) {
        if (this.editableTask()) {
            this.editableTask.update(t => ({ ...t!, priority }));
        }

        (document.activeElement as HTMLElement)?.blur();
    }

    private resetEditState(): void {
        this.editableTask.set(this.task());
        this.editableTags.set(this.task().tags ? this.task().tags!.join(', ') : '');
    }

    toggleEdit(): void {
        if (this.editMode()) {
            this.saveChanges();
        } else {
            this.resetEditState();
            this.editMode.set(true);
        }
    }

    saveChanges() {
        if (!this.editableTask()) {
            return;
        }

        const updatedTask: Task = {
            ...this.editableTask()!,
            content: this.editableTask()!.content,
            tags: this.editableTags().split(',').map(l => l.trim()).filter(Boolean),
        }

        this.saveTask.emit(updatedTask);
        this.editMode.set(false);
    }

    cancelEdit(): void {
        this.resetEditState();
        this.editMode.set(false);
    }

    get textareaRows(): number {
        const text = this.editableTask()?.content || '';
        const lines = text.split('\n').length;
        return Math.min(Math.max(lines + 1, 6), 20);
    }

    handleDelete() {
        this.deleteDialog.show();
    }

    onDeleteConfirmed() {
        this.deleteTask.emit(this.task());
    }

    applyAiAction(action: RefineAction) {
        (document.activeElement as HTMLElement)?.blur();

        if (!this.waitlistService.canUseMagicAction()) {
            this.waitlistModal().show();
            return;
        }

        if (this.isRefining()) {
            return;
        }

        this.undoTaskState.set({ ...this.task() });
        this.redoTaskState.set(null);

        this.isRefining.set(true);
        this.parseService.refineTask(this.task(), action).pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (refinedTask: Task) => {
                    const finalTask: Task = {
                        ...this.task(),
                        ...refinedTask,
                        id: this.task().id
                    };

                    this.saveTask.emit(finalTask);
                    this.isRefining.set(false);

                    // Increment usage on success
                    this.waitlistService.incrementUsage();

                    this.toastService.success('Task refined by AI ✨');
                    this.lastActionSuccess.set(true);
                    setTimeout(() => {
                        this.lastActionSuccess.set(false);
                    }, 1000);
                },
                error: (err) => {
                    console.error('Failed to refine', err);
                    this.toastService.error('Failed to refine task.');
                    this.isRefining.set(false);
                    this.undoTaskState.set(null);
                }
            });
    }

    undoAiAction() {
        const previous = this.undoTaskState();
        if (previous) {
            this.redoTaskState.set({ ...this.task() });
            this.saveTask.emit(previous);
            this.undoTaskState.set(null);
        }
    }

    redoAiAction() {
        const next = this.redoTaskState();
        if (next) {
            this.undoTaskState.set({ ...this.task() });
            this.saveTask.emit(next);
            this.redoTaskState.set(null);
        }
    }

    onRequireLogin(): void {
        this.analyticsService.trackLockedFeatureClick('task-controls', 'task-controls-action');
        this.loginModal().open();
    }
}
