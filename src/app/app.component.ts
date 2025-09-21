import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CodeXmlIcon, FileJsonIcon, LucideAngularModule, SendHorizontalIcon } from 'lucide-angular';
import { NgOptimizedImage } from '@angular/common';
import { ExportType, ParseService, Task } from './core/parse.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from './components/badge/badge.component';
import { ExportDialogComponent } from './components/export-dialog/export-dialog.component';
import { generateJSON, generateMarkdown } from './utils/export';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [
        LucideAngularModule,
        NgOptimizedImage,
        FormsModule,
        BadgeComponent,
        ExportDialogComponent
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
    exportFormat = signal<ExportType>('json');
    convertedTask = signal<string>('');

    generateTasks() {
        this.parseService.parseText(this.inputText()).pipe(
            takeUntilDestroyed(this.destroyRef),
        ).subscribe((response) => {
            console.log(response);
            this.tasks.set(response);
        });
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

    getTaskPriority(task: any): string {
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
