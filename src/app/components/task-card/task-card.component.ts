import { Component, computed, input, signal } from '@angular/core';
import { BadgeComponent } from '../badge/badge.component';
import { ExportDialogComponent } from '../export-dialog/export-dialog.component';
import { CodeXmlIcon, FileJsonIcon, LucideAngularModule } from 'lucide-angular';
import { Task } from '../../utils/task.model';
import { ExportType } from '../../core/parse.service';
import { generateJSON, generateMarkdown } from '../../utils/export';

@Component({
  selector: 'app-task-card',
    imports: [
        BadgeComponent,
        ExportDialogComponent,
        LucideAngularModule
    ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
    task = input.required<Task>();
    taskPriority = computed(() => this.getTaskPriority(this.task()));

    exportFormat = signal<ExportType>('json');
    convertedTask = signal<string>('');

    protected readonly fileJsonIcon = FileJsonIcon;
    protected readonly codeXmlIcon = CodeXmlIcon;


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
