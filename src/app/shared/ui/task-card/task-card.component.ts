import { Component, computed, input, OnInit, output, signal } from '@angular/core';
import { BadgeComponent } from '../badge/badge.component';
import { CheckIcon, CodeXmlIcon, FileJsonIcon, FileUpIcon, LucideAngularModule, PencilIcon, PencilOffIcon, Trash2Icon } from 'lucide-angular';
import { Task } from '../../models/task.model';
import { ExportType } from '../../../core/services/parse.service';
import { generateJSON, generateMarkdown } from '../../utils/export';
import { FormsModule } from '@angular/forms';
import { ExportDialogComponent } from '../export-dialog/export-dialog.component';
import { GENERAL_CONFIG } from '../../../config/general';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-task-card',
    imports: [
        BadgeComponent,
        LucideAngularModule,
        FormsModule,
        ExportDialogComponent,
        ConfirmDialogComponent
    ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent implements OnInit {
    task = input.required<Task>();
    saveTask = output<Task>();
    deleteTask = output<Task>();
    confirmVisible = signal(false);

    taskPriority = computed(() => this.getTaskPriority(this.task()));
    editMode = signal<boolean>(false);
    editableTask = signal<Task | undefined>(undefined);
    editableLabels = signal<string>('');

    exportFormat = signal<ExportType>('json');
    convertedTask = signal<string>('');

    priorityLevels = GENERAL_CONFIG.TASK_PRIORITIES;
    maxTitleLength = GENERAL_CONFIG.MAX_TITLE_LENGTH;
    maxBodyLength = GENERAL_CONFIG.MAX_BODY_LENGTH;
    maxLabelsLength = GENERAL_CONFIG.MAX_LABELS_LENGTH;

    protected readonly fileJsonIcon = FileJsonIcon;
    protected readonly codeXmlIcon = CodeXmlIcon;
    protected readonly checkIcon = CheckIcon;
    protected readonly pencilIcon = PencilIcon;
    protected readonly pencilOffIcon = PencilOffIcon;
    protected readonly trashIcon = Trash2Icon;
    protected readonly fileUpIcon = FileUpIcon;

    ngOnInit(): void {
        this.editableTask.set(this.task());
        this.editableLabels.set(this.task().labels ? this.editableTask()!.labels!.join(', ') : '');
    }

    toggleEdit(): void {
        if (this.editMode()) {
            // Save
            const updatedTask: Task = {
                ...this.editableTask()!,
                labels: this.editableLabels().split(',').map(l => l.trim()).filter(Boolean),
            };
            this.saveTask.emit(updatedTask);
        } else {
            // Enter edit mode → clone current task
            this.editableTask.set(structuredClone(this.task()));
            this.editableLabels.set(this.task().labels?.join(', ') ?? '');
        }

        this.editMode.update(v => !v);
    }

    handleDelete() {
        this.confirmVisible.set(true);
    }

    onDeleteConfirmed() {
        this.confirmVisible.set(false);
        this.deleteTask.emit(this.task());
    }

    onDeleteCancelled() {
        this.confirmVisible.set(false);
    }

    cancelEdit(): void {
        this.editableTask.set(this.task());
        this.editableLabels.set(this.task().labels?.join(', ') ?? '');
        this.editMode.set(false);
    }

    openExportDialog(task: Task, type: ExportType) {
        if (type === 'markdown') {
            this.convertedTask.set(generateMarkdown(task));
            this.exportFormat.set('markdown');
        } else {
            this.convertedTask.set(generateJSON(task));
            this.exportFormat.set('json');
        }

        const modal = document.getElementById('export_modal') as HTMLDialogElement;
        if (modal) modal.showModal()
    }

    exportToFormat(task: Task) {
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
        a.download = `${task.title.replace(/\s+/g, '-').toLowerCase()}.${extension}`;
        a.click();

        window.URL.revokeObjectURL(url);
    }

    getTaskPriority(task: Task): string {
        switch ((task.priority || '').toLowerCase()) {
            case 'low':
                return '✅ Low';
            case 'medium':
                return '⚠️ Medium';
            case 'high':
                return '🔥 High';
            default:
                return '❓ Unknown';
        }
    }
}
