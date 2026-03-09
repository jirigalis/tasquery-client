import { Component, computed, DestroyRef, inject, input, OnInit, output, signal, viewChild, ViewChild } from '@angular/core';
import {
    BookUserIcon,
    CheckIcon,
    CircleAlertIcon,
    CodeXmlIcon,
    CopyIcon,
    FileBraces,
    FileTextIcon,
    InfoIcon,
    KanbanIcon,
    ListIcon,
    LockIcon,
    LucideAngularModule,
    MessageSquareIcon,
    PencilIcon,
    RedoIcon,
    ShareIcon,
    SparklesIcon,
    TagsIcon,
    TestTubeIcon,
    Trash2Icon,
    TriangleAlertIcon,
    UndoIcon,
    ZapIcon
} from 'lucide-angular';
import { Task, TaskPriority } from '../../models/task.model';
import { ParseService } from '../../../core/services/parse.service';
import { ExportPlatform, formatForPlatform, wrapInHtml } from '../../utils/export';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { NgClass } from '@angular/common';
import { GENERAL_CONFIG } from '../../../config/general';
import { ToastService } from '../../../core/services/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RefineAction } from '../../models/refine.model';
import { WaitlistModalComponent } from '../waitlist-modal/waitlist-modal.component';
import { WaitlistService } from '../../../core/services/waitlist.service';

@Component({
  selector: 'app-task-card',
    imports: [
        LucideAngularModule,
        FormsModule,
        ConfirmDialogComponent,
        NgClass,
        WaitlistModalComponent
    ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent implements OnInit {
    private toastService = inject(ToastService);
    private parseService: ParseService = inject(ParseService);
    protected waitlistService = inject(WaitlistService);
    task = input.required<Task>();
    saveTask = output<Task>();
    deleteTask = output<Task>();
    destroyRef = inject(DestroyRef);

    editMode = signal<boolean>(false);
    editableTask = signal<Task | undefined>(undefined);
    editableLabels = signal<string>('');

    isRefining = signal<boolean>(false);
    lastActionSuccess = signal<boolean>(false);
    selectedCopyFormat = signal<ExportPlatform>('jira');
    undoTaskState = signal<Task | null>(null);
    redoTaskState = signal<Task | null>(null);

    @ViewChild('deleteModal') deleteDialog!: ConfirmDialogComponent;
    waitlistModal = viewChild.required<WaitlistModalComponent>(WaitlistModalComponent);

    protected readonly limits = {
        title: GENERAL_CONFIG.MAX_TITLE_LENGTH,
        content: GENERAL_CONFIG.MAX_TASK_CONTENT_LENGTH,
        labels: GENERAL_CONFIG.MAX_LABELS_LENGTH,
    };
    protected readonly RefineAction = RefineAction;

    priorityConfig = computed(() => this.getPriorityMeta(this.task().priority));
    availablePriorities = GENERAL_CONFIG.TASK_PRIORITIES;
    editablePriorityConfig = computed(() =>
        this.editableTask() ? this.getPriorityMeta(this.editableTask()!.priority) : this.getPriorityMeta(TaskPriority.LOW)
    );
    copyButtonConfig = computed(() => {
        const format = this.selectedCopyFormat();
        switch (format) {
            case 'markdown':
                return { label: 'Copy Markdown', icon: this.icons.copy };
            case 'slack':
                return { label: 'Copy for Slack', icon: this.icons.slack };
            case 'plain':
                return { label: 'Copy Plain Text', icon: this.icons.plainText };
            case 'jira':
            default:
                return { label: 'Copy for Jira', icon: this.icons.jira };
        }
    });
    formattedContent = computed(() => {
        const content = this.task().content;
        if (!content) {
            return '';
        }

        return wrapInHtml(content, 'markdown');
    })

    protected readonly icons = {
        json: FileBraces,
        markdown: CodeXmlIcon,
        check: CheckIcon,
        edit: PencilIcon,
        trash: Trash2Icon,
        copy: CopyIcon,
        tags: TagsIcon,
        export: ShareIcon,
        high: CircleAlertIcon,
        medium: TriangleAlertIcon,
        low: InfoIcon,
        plainText: FileTextIcon,
        jira: KanbanIcon,
        slack: MessageSquareIcon,
        magic: SparklesIcon,
        sparkles: SparklesIcon,
        lock: LockIcon,
        testTube: TestTubeIcon,
        list: ListIcon,
        userStory: BookUserIcon,
        undo: UndoIcon,
        redo: RedoIcon,
        zap: ZapIcon,
        info: InfoIcon,
    };

    protected readonly magicActionGroups = [
        {
            title: 'Refine Content',
            actions: [
                {
                    id: RefineAction.PUNCHY,
                    label: 'Make it Punchy',
                    icon: this.icons.zap,
                    iconClass: 'text-warning',
                    description: 'Reduces word count and uses minimalist Linear-style language.'
                },
                {
                    id: RefineAction.CHECKLIST,
                    label: 'Break into Checklist',
                    icon: this.icons.list,
                    iconClass: '',
                    description: 'Transforms the description into a clear, actionable checklist.'
                },
                {
                    id: RefineAction.NON_TECH,
                    label: 'Business Translation',
                    icon: this.icons.userStory,
                    iconClass: '',
                    description: 'Simplifies technical jargon for Product Managers and stakeholders.'
                }
            ]
        },
        {
            title: 'Deep Analysis',
            actions: [
                {
                    id: RefineAction.EDGE_CASES,
                    label: 'Anticipate Edge Cases',
                    icon: this.icons.sparkles,
                    iconClass: 'text-primary',
                    description: 'Adds 3-4 non-obvious technical edge cases to Acceptance Criteria.'
                },
                {
                    id: RefineAction.SECURITY,
                    label: 'Security Audit',
                    icon: this.icons.lock,
                    iconClass: 'text-secondary',
                    description: 'Audits the task for potential security vulnerabilities and implications.'
                },
                {
                    id: RefineAction.TESTS,
                    label: 'QA / Unit Tests',
                    icon: this.icons.testTube,
                    iconClass: '',
                    description: 'Generates a \'How to test\' section with specific verification steps.'
                }
            ]
        }
    ];

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

    get textareaRows(): number {
        const text = this.editableTask()?.content || '';
        const lines = text.split('\n').length;
        return Math.min(Math.max(lines + 1, 6), 20);
    }

    handleDelete() {
        this.deleteDialog.show();
    }

    async handleCopy(platform?: ExportPlatform) {
        (document.activeElement as HTMLElement)?.blur();

        if (platform) {
            this.selectedCopyFormat.set(platform);
        }

        const targetPlatform = this.selectedCopyFormat();
        const markdownText = formatForPlatform(this.task(), targetPlatform);

        if (targetPlatform === 'plain') {
            await navigator.clipboard.writeText(markdownText);
        } else {
            try {
                const htmlContent = wrapInHtml(markdownText, targetPlatform);

                const data = [
                    new ClipboardItem({
                        'text/plain': new Blob([markdownText], { type: 'text/plain' }),
                        'text/html': new Blob([htmlContent], { type: 'text/html' })
                    })
                ];

                console.log(htmlContent);

                await navigator.clipboard.write(data);
            } catch (err) {
                console.error('Rich copy failed, falling back to text', err);
                await navigator.clipboard.writeText(markdownText);
            }
        }

        this.toastService.success(`Copied for ${targetPlatform.toUpperCase()}`);
    }

    handleDownload(type: 'markdown' | 'json') {
        let content: string;
        let filename: string;
        let mime: string;
        const taskData = this.task();
        const safeTitle = taskData.title.replace(/\s+/g, '-').toLowerCase();

        if (type === 'json') {
            // Using existing generateJSON utility or JSON.stringify
            content = JSON.stringify(taskData, null, 2);
            filename = `task-${safeTitle}.json`;
            mime = 'application/json';
        } else {
            // Using existing formatForPlatform utility for clean markdown
            content = formatForPlatform(taskData, 'markdown');
            filename = `task-${safeTitle}.md`;
            mime = 'text/markdown';
        }

        const blob = new Blob([content], { type: mime });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = filename;
        link.click();

        window.URL.revokeObjectURL(url);
        this.toastService.success(`File ${filename} downloaded`);

        // Close dropdown
        (document.activeElement as HTMLElement)?.blur();
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
}
