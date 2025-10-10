import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CircleAlert, LucideAngularModule, SendHorizontalIcon } from 'lucide-angular';
import { ParseService } from '../../core/parse.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Task } from "../../utils/task.model";
import { FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { TermsOfUseComponent } from '../../components/terms-of-use/terms-of-use.component';
import { NavigationComponent } from '../../components/navigation/navigation.component';

@Component({
  selector: 'app-tasquery',
    imports: [
        FormsModule,
        LucideAngularModule,
        NgOptimizedImage,
        TaskCardComponent,
        TermsOfUseComponent,
        NavigationComponent
    ],
  templateUrl: './tasquery.component.html',
  styleUrl: './tasquery.component.css'
})
export class TasqueryComponent {
    protected readonly sendHorizontalIcon = SendHorizontalIcon;
    protected readonly circleAlert = CircleAlert
    private readonly parseService = inject(ParseService);
    destroyRef = inject(DestroyRef);

    inputText = signal<string>('')
    tasks = signal<Task[]>([]);
    loading = signal<boolean>(false);
    year = signal(new Date().getFullYear());
    error = signal<string | null>(null);

    isInputValid = signal<boolean>(true);

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
                console.log(response);
                this.error.set(null);
                this.tasks.set(response);
                this.loading.set(false);
                this.isInputValid.set(true);
            },
            error: (error) => {
                console.error('Error parsing text:', error, error.error);
                this.error.set(error.error.message || 'Unexpected error, please try again later.');
                this.loading.set(false);
            }
        });
    }
}
