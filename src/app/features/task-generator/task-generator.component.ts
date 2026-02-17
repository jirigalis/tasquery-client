import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CircleAlert, LucideAngularModule, PencilIcon, SaveIcon, SendHorizontalIcon } from 'lucide-angular';
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
        RenameCollectionDialogComponent
    ],
  templateUrl: './task-generator.component.html',
  styleUrl: './task-generator.component.css'
})
export class TaskGeneratorComponent implements OnInit {
    protected readonly sendHorizontalIcon = SendHorizontalIcon;
    protected readonly circleAlert = CircleAlert
    private readonly parseService = inject(ParseService);
    destroyRef = inject(DestroyRef);
    taskCollectionService = inject(TaskCollectionsService);

    inputText = signal<string>('');
    tasks = signal<Task[]>([]);
    loading = signal<boolean>(false);
    year = signal(new Date().getFullYear());
    error = signal<string | null>(null);
    isInputValid = signal<boolean>(true);
    loadingCollection = signal<boolean>(false);
    activeCollection = this.taskCollectionService.activeCollection;
    saveAsNew = signal<boolean>(false);

    protected readonly maxBodyLength = GENERAL_CONFIG.MAX_BODY_LENGTH;
    public sampleInputLabels = SAMPLE_INPUT_LABELS;

    protected readonly saveIcon = SaveIcon;
    protected readonly editIcon = PencilIcon;

    testInput = signal('Implement Employee Switch in Mobile Timesheet Form, please it is urgent. Mobile users are not able to create bugs. Can you please fix it until the next wednesday?');

    public ngOnInit() {
        if (GENERAL_CONFIG.TEST_MODE) {
            this.inputText.set(this.testInput());
            this.generateTasks();
        }
    }

    onInputChange() {
        if (this.inputText() === null || this.inputText().trim().length === 0) {
            this.isInputValid.set(false);
        } else {
            this.isInputValid.set(true);
        }
    }

    generateTasks() {
        if (this.loading()) {
            return;
        }

        if (this.inputText() === null || this.inputText().trim().length === 0) {
            this.isInputValid.set(false);
            return;
        }

        this.loading.set(true);
        this.parseService.parseText(this.inputText()).pipe(
            takeUntilDestroyed(this.destroyRef),
        ).subscribe({
            next: (response) => {
                this.error.set(null);
                this.tasks.set(response);
                this.loading.set(false);
                this.isInputValid.set(true);
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
        const deletedTasks = this.tasks().filter(t => t.id !== task.id);
        this.tasks.set(deletedTasks);
    }

    loadSample(type: SampleInputType) {
        this.inputText.set(SAMPLE_INPUTS[type]);
    }

    openSaveCollectionModal(saveAsNew = false): void {
        const modal = document.getElementById('save_collection_modal') as HTMLDialogElement;
        this.saveAsNew.set(saveAsNew);
        if (modal) modal.showModal();
    }

    saveCollection(title: string) {
        if (this.activeCollection() && !this.saveAsNew()) {
            this.taskCollectionService.updateCollection(this.activeCollection()!.id, this.tasks());
        } else {
            const collection = {
                id: nanoid(),
                title,
                createdAt: new Date().toISOString(),
                tasks: this.tasks(),
            }

            this.taskCollectionService.add(collection);
            this.taskCollectionService.setActive(collection);
            this.saveAsNew.set(false);
        }
    }

    loadCollection(collection: TaskCollection): void {
        this.tasks.set(collection.tasks);

        // simulate loading collection delay - will be replaced with real loading logic once connected to backend
        this.loadingCollection.set(true);

        setTimeout(() => {
            this.loadingCollection.set(false);
            this.taskCollectionService.setActive(collection);
        }, 500);

        const drawerToggle = (document.getElementById('drawer_toggle') as HTMLInputElement);
        if (drawerToggle) {
            drawerToggle.checked = false;
        }
    }

    renameCollection() {
        const modal = document.getElementById('rename_collection_modal') as HTMLDialogElement;
        if (modal) modal.showModal();
    }

    onRenameCollection(collectionName: string): void {
        if (!this.activeCollection()) {
            return;
        }

        this.taskCollectionService.updateCollectionTitle(this.activeCollection()!.id, collectionName);
    }
}
