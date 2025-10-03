import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CodeXmlIcon, FileJsonIcon, LucideAngularModule, SendHorizontalIcon } from 'lucide-angular';
import { NgOptimizedImage } from '@angular/common';
import { ParseService } from './core/parse.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { TaskCardComponent } from './components/task-card/task-card.component';
import { Task } from './utils/task.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [
        LucideAngularModule,
        NgOptimizedImage,
        FormsModule,
        TermsOfUseComponent,
        TaskCardComponent
    ],
    styleUrl: './app.component.css'
})
export class AppComponent {
    protected readonly sendHorizontalIcon = SendHorizontalIcon;
    protected readonly fileJsonIcon = FileJsonIcon;
    protected readonly codeXmlIcon = CodeXmlIcon;
    private readonly parseService = inject(ParseService);
    destroyRef = inject(DestroyRef);

    inputText = signal<string>('')
    tasks = signal<Task[]>([]);
    loading = signal<boolean>(false);
    year = signal(new Date().getFullYear());

    generateTasks() {
        this.loading.set(true);
        this.parseService.parseText(this.inputText()).pipe(
            takeUntilDestroyed(this.destroyRef),
        ).subscribe((response) => {
            console.log(response);
            this.tasks.set(response);
            this.loading.set(false);
        });
    }
}
