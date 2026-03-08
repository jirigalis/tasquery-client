import { Component, computed, DestroyRef, inject, OnInit, signal, viewChild, ViewChild } from '@angular/core';
import { CircleAlertIcon, LucideAngularModule, MessageSquareIcon } from 'lucide-angular';
import { ParseService } from '../../core/services/parse.service';
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
import { ParseRequestPayload, PresetMode } from '../../shared/models/task-preset.model';
import { GeneratorHeaderComponent } from './components/generator-header/generator-header.component';
import { GeneratorInputCardComponent } from './components/generator-input-card/generator-input-card.component';
import { GeneratorResultsToolbarComponent } from './components/generator-results-toolbar/generator-results-toolbar.component';
import { GeneratorEmptyStateComponent } from './components/generator-empty-state/generator-empty-state.component';

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
        GeneratorHeaderComponent,
        GeneratorInputCardComponent,
        GeneratorResultsToolbarComponent,
        GeneratorEmptyStateComponent,
    ],
  templateUrl: './task-generator.component.html',
  styleUrl: './task-generator.component.css'
})
export class TaskGeneratorComponent implements OnInit {
    // Icons
    protected readonly icons = {
        alert: CircleAlertIcon,
        feedback: MessageSquareIcon,
    }

    private readonly parseService = inject(ParseService);
    private readonly destroyRef = inject(DestroyRef);
    private toastService = inject(ToastService);
    protected taskCollectionService = inject(TaskCollectionsService);

    @ViewChild('saveCollectionModal') saveCollectionModal!: SaveTaskCollectionDialogComponent;
    @ViewChild('renameCollectionModal') renameCollectionModal!: RenameCollectionDialogComponent;
    @ViewChild('proModal') proModal!: ProDialogComponent;
    waitlistModal = viewChild.required<WaitlistModalComponent>('waitlistModal');

    inputText = signal<string>('');
    tasks = signal<Task[]>([]);
    loading = signal<boolean>(false);
    error = signal<string | null>(null);
    currentMode = signal<PresetMode>('standard');
    loadingCollection = signal<boolean>(false);
    saveAsNew = signal<boolean>(false);

    activeCollection = this.taskCollectionService.activeCollection;
    isInputValid = computed(() => this.inputText() !== null && this.inputText().trim().length > 0);
    requestPayload = computed<ParseRequestPayload>(() => ({
        inputText: this.inputText(),
        preset: this.currentMode()
    }));

    readonly year = new Date().getFullYear();
    protected readonly maxBodyLength = GENERAL_CONFIG.MAX_REQUEST_BODY_LENGTH;
    public sampleInputLabels = SAMPLE_INPUT_LABELS;

    public ngOnInit() {
        const saved = localStorage.getItem('tasquery_preset') as PresetMode;
        if (saved) {
            this.currentMode.set(saved);
        }
    }

    generateTasks() {
        if (this.loading() || !this.isInputValid()) {
            return;
        }

        this.loading.set(true);

        this.parseService.parseText(this.requestPayload()).pipe(
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
        this.syncWithCollection();
    }

    onDeleteTask(task: Task) {
        const updatedTasks = this.tasks().filter(t => t.id !== task.id);
        this.tasks.set(updatedTasks);
        this.syncWithCollection();

        this.toastService.success('Task deleted successfully.');
    }

    private syncWithCollection() {
        const active = this.activeCollection();
        if (active) {
            this.taskCollectionService.updateCollection(active.id, this.tasks());
        }
    }

    loadSample(type: SampleInputType) {
        this.inputText.set(SAMPLE_INPUTS[type]);
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement) {
            activeElement.blur();
        }
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

    onPresetChange(mode: PresetMode) {
        this.currentMode.set(mode);
        localStorage.setItem('tasquery_preset', mode);

        if (this.isInputValid() && this.tasks().length > 0) {
            this.generateTasks();
        }
    }
}
