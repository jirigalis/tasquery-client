import { Component, computed, DestroyRef, inject, OnInit, signal, viewChild, ViewChild } from '@angular/core';
import {
    BugIcon,
    CircleAlertIcon,
    CircleCheckIcon,
    CircleUserIcon,
    CloudCheckIcon,
    CopyIcon,
    CrownIcon,
    FileBracesIcon,
    ListTodoIcon,
    LucideAngularModule,
    MessageSquareIcon,
    PencilIcon,
    SaveIcon,
    SendHorizontalIcon,
    SparklesIcon,
    SquareCheckIcon
} from 'lucide-angular';
import { GenerationConfig, GenerationMode, ParseService } from '../../core/services/parse.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Task } from "../../shared/models/task.model";
import { FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { TaskCardComponent } from '../../shared/ui/task-card/task-card.component';
import { TermsOfUseComponent } from '../../components/terms-of-use/terms-of-use.component';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { GENERAL_CONFIG } from '../../config/general';
import { SAMPLE_INPUT_LABELS, SAMPLE_INPUTS, SampleInputType } from '../../shared/data/sample-inputs';
import { nanoid } from 'nanoid';
import { TaskCollectionsService } from '../../core/services/task-collections.service';
import { TaskCollectionDrawerComponent } from '../../shared/ui/task-collection-drawer/task-collection-drawer.component';
import { SaveTaskCollectionDialogComponent } from './save-task-collection-dialog/save-task-collection-dialog.component';
import { TaskCollection } from '../../shared/models/task-collection.model';
import { RenameCollectionDialogComponent } from './rename-collection-dialog/rename-collection-dialog.component';
import { ToastService } from '../../core/services/toast.service';
import { ProDialogComponent } from '../../shared/ui/pro-dialog/pro-dialog.component';
import { WaitlistModalComponent } from '../../shared/ui/waitlist-modal/waitlist-modal.component';

@Component({
  selector: 'app-task-generator',
    imports: [
        FormsModule,
        LucideAngularModule,
        NgOptimizedImage,
        TaskCardComponent,
        TermsOfUseComponent,
        NavigationComponent,
        TaskCollectionDrawerComponent,
        SaveTaskCollectionDialogComponent,
        RenameCollectionDialogComponent,
        ProDialogComponent,
        WaitlistModalComponent,
    ],
  templateUrl: './task-generator.component.html',
  styleUrl: './task-generator.component.css'
})
export class TaskGeneratorComponent implements OnInit {
    // Icons
    protected readonly icons = {
        send: SendHorizontalIcon,
        alert: CircleAlertIcon,
        save: SaveIcon,
        edit: PencilIcon,
        bug: BugIcon,
        list: ListTodoIcon,
        standard: FileBracesIcon,
        cloudCheck: CloudCheckIcon,
        copy: CopyIcon,
        actionItems: SquareCheckIcon,
        userStory: CircleUserIcon,
        magic: SparklesIcon,
        feedback: MessageSquareIcon,
        crown: CrownIcon,
        checkCircle: CircleCheckIcon,
    }

    private readonly parseService = inject(ParseService);
    destroyRef = inject(DestroyRef);
    taskCollectionService = inject(TaskCollectionsService);
    private toastService = inject(ToastService);

    @ViewChild('saveCollectionModal') saveCollectionModal!: SaveTaskCollectionDialogComponent;
    @ViewChild('renameCollectionModal') renameCollectionModal!: RenameCollectionDialogComponent;
    @ViewChild('proModal') proModal!: ProDialogComponent;
    waitlistModal = viewChild.required<WaitlistModalComponent>('waitlistModal');

    inputText = signal<string>('');
    tasks = signal<Task[]>([]);
    loading = signal<boolean>(false);
    year = signal(new Date().getFullYear());
    error = signal<string | null>(null);

    config = signal<GenerationConfig>({
        mode: GenerationMode.STANDARD,
        includeAcceptanceCriteria: false,
    });

    isInputValid = computed(() => this.inputText() !== null && this.inputText().trim().length > 0);
    loadingCollection = signal<boolean>(false);
    activeCollection = this.taskCollectionService.activeCollection;
    saveAsNew = signal<boolean>(false);

    protected readonly maxBodyLength = GENERAL_CONFIG.MAX_REQUEST_BODY_LENGTH;
    public sampleInputLabels = SAMPLE_INPUT_LABELS;

    protected readonly GenerationMode = GenerationMode;

    testInput = signal('Implement Employee Switch in Mobile Timesheet Form, please it is urgent. Mobile users are not able to create bugs. Can you please fix it until the next wednesday?');

    public ngOnInit() {
        if (GENERAL_CONFIG.TEST_MODE) {
            this.inputText.set(this.testInput());
            this.generateTasks();
        }
    }

    toggleMode(mode: GenerationMode) {
        this.config.update((c) => ({ ...c, mode }));
    }

    toggleAcceptanceCriteria(): void {
        this.config.update(c => ({ ...c, includeAcceptanceCriteria: !c.includeAcceptanceCriteria }));
    }

    get generateButtonText(): string {
        switch (this.config().mode) {
            case GenerationMode.JIRA_BUG: return 'Bug Report';
            case GenerationMode.ACTION_ITEMS: return 'Action Items';
            case GenerationMode.USER_STORY: return 'User Story';
            default: return 'Tasks';
        }
    }

    generateTasks() {
        if (this.loading() || !this.isInputValid()) {
            return;
        }

        this.loading.set(true);

        this.parseService.parseText(this.inputText(), this.config()).pipe(
            takeUntilDestroyed(this.destroyRef),
        ).subscribe({
            next: (response) => {
                this.error.set(null);
                this.tasks.set(response);
                this.loading.set(false);
                this.taskCollectionService.clearActive();
            },
            error: (error) => {
                console.error('Error parsing text:', error, error.error);
                this.error.set(error.error.message || 'Unexpected error, please try again later.');
                this.loading.set(false);
            }
        });
    }

    onSaveTask(updatedTask: Task) {
        const updatedTasks = this.tasks().map(task => task.id === updatedTask.id ? updatedTask : task);
        this.tasks.set(updatedTasks);

        if (this.activeCollection()) {
            this.taskCollectionService.updateCollection(this.activeCollection()!.id, this.tasks());
        }
    }

    onDeleteTask(task: Task) {
        const updatedTasks = this.tasks().filter(t => t.id !== task.id);
        this.tasks.set(updatedTasks);

        if (this.activeCollection()) {
            this.taskCollectionService.updateCollection(this.activeCollection()!.id, this.tasks());
        }

        this.toastService.success('Task deleted successfully.');
    }

    loadSample(type: SampleInputType) {
        this.inputText.set(SAMPLE_INPUTS[type]);
    }

    openSaveCollectionModal(saveAsNew = false): void {
        this.saveAsNew.set(saveAsNew);
        this.saveCollectionModal!.show(saveAsNew);
    }

    saveCollection(title: string) {
        const collection = {
            id: nanoid(),
            title,
            createdAt: new Date().toISOString(),
            tasks: this.tasks(),
        }

        this.taskCollectionService.add(collection);
        this.taskCollectionService.setActive(collection);
        this.saveAsNew.set(false);
        this.toastService.success('Collection saved successfully.');
    }

    loadCollection(collection: TaskCollection): void {
        // simulate loading collection delay - will be replaced with real loading logic once connected to backend
        this.loadingCollection.set(true);
        this.tasks.set(collection.tasks);

        setTimeout(() => {
            this.loadingCollection.set(false);
            this.taskCollectionService.setActive(collection);
        }, 300);
    }

    renameCollection() {
        this.renameCollectionModal?.show();
    }

    onRenameCollection(collectionName: string): void {
        if (!this.activeCollection()) {
            return;
        }

        this.taskCollectionService.updateCollectionTitle(this.activeCollection()!.id, collectionName);
        this.toastService.success('Rename Collection Name was successfully.');
    }

    openProModal() {
        this.proModal.show();
    }

    openWaitlistModal() {
        this.proModal.close();
        setTimeout(() => {
            this.waitlistModal().show();
        }, 50);
    }
}
