import { Component, computed, inject, input, OnInit, output, signal, ViewChild } from '@angular/core';
import {
    CheckIcon,
    CircleAlertIcon,
    CodeXmlIcon,
    CopyIcon,
    FileJsonIcon,
    InfoIcon,
    LucideAngularModule,
    PencilIcon,
    ShareIcon,
    TagsIcon,
    Trash2Icon,
    TriangleAlertIcon,
    XIcon
} from 'lucide-angular';
import { Task, TaskPriority } from '../../models/task.model';
import { ExportType } from '../../../core/services/parse.service';
import { generateJSON, generateMarkdown } from '../../utils/export';
import { FormsModule } from '@angular/forms';
import { ExportDialogComponent } from '../export-dialog/export-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { NgClass } from '@angular/common';
import { GENERAL_CONFIG } from '../../../config/general';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-task-card',
    imports: [
        LucideAngularModule,
        FormsModule,
        ExportDialogComponent,
        ConfirmDialogComponent,
        NgClass
    ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent implements OnInit {
    private toastService = inject(ToastService);
    task = input.required<Task>();
    saveTask = output<Task>();
    deleteTask = output<Task>();

    editMode = signal<boolean>(false);
    editableTask = signal<Task | undefined>(undefined);
    editableLabels = signal<string>('');

    exportFormat = signal<ExportType>('json');
    convertedTask = signal<string>('');

    @ViewChild('exportModal') exportDialog!: ExportDialogComponent;
    @ViewChild('deleteModal') deleteDialog!: ConfirmDialogComponent;

    protected readonly limits = {
        title: GENERAL_CONFIG.MAX_TITLE_LENGTH,
        body: GENERAL_CONFIG.MAX_BODY_LENGTH,
        labels: GENERAL_CONFIG.MAX_LABELS_LENGTH,
    };

    priorityConfig = computed(() => this.getPriorityMeta(this.task().priority));
    availablePriorities = GENERAL_CONFIG.TASK_PRIORITIES;
    editablePriorityConfig = computed(() =>
        this.editableTask() ? this.getPriorityMeta(this.editableTask()!.priority) : this.getPriorityMeta(TaskPriority.LOW)
    );

    /*priorityLevels = GENERAL_CONFIG.TASK_PRIORITIES;
    maxTitleLength = GENERAL_CONFIG.MAX_TITLE_LENGTH;
    maxBodyLength = GENERAL_CONFIG.MAX_BODY_LENGTH;
    maxLabelsLength = GENERAL_CONFIG.MAX_LABELS_LENGTH;*/

    protected readonly icons = {
        json: FileJsonIcon,
        markdown: CodeXmlIcon,
        check: CheckIcon,
        edit: PencilIcon,
        cancel: XIcon,
        trash: Trash2Icon,
        copy: CopyIcon,
        tags: TagsIcon,
        export: ShareIcon,
        high: CircleAlertIcon,
        medium: TriangleAlertIcon,
        low: InfoIcon,
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
        this.editableLabels.set(this.task().labels ? this.task().labels!.join(', ') : '');
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
            labels: this.editableLabels().split(',').map(l => l.trim()).filter(Boolean),
        }

        this.saveTask.emit(updatedTask);
        this.editMode.set(false);
    }

    cancelEdit(): void {
        this.resetEditState();
        this.editMode.set(false);
    }

    handleDelete() {
        this.deleteDialog.show();
    }

    async copyToClipboard(): Promise<void> {
        try {
            await navigator.clipboard.writeText(this.task().content || '');
            this.toastService.success('Copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy to clipboard', error);
        }
    }

    onDeleteConfirmed() {
        this.deleteTask.emit(this.task());
    }

    openExportDialog(type: ExportType) {
        const content = type === 'markdown'
            ? generateMarkdown(this.task())
            : generateJSON(this.task());

        this.convertedTask.set(content);
        this.exportFormat.set(type);

        this.exportDialog!.show();
    }

    exportToFormat() {
        let mime;
        let extension;

        switch (this.exportFormat()) {
            case 'markdown':
                mime = 'text/markdown';
                extension = 'md';
                break;
            case 'csv':
                mime = 'text/csv';
                extension = 'csv';
                break;
            case 'json':
            default:
                mime = 'application/json';
                extension = 'json';
                break;
        }

        const blob = new Blob([this.convertedTask()], { type: mime });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.task().title.replace(/\s+/g, '-').toLowerCase()}.${extension}`;
        a.click();

        window.URL.revokeObjectURL(url);
    }
}
