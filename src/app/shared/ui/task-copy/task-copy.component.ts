import { Component, computed, inject, input, output, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CheckIcon, CodeXmlIcon, CopyIcon, FileBracesIcon, FileTextIcon, HashIcon, KanbanIcon, LockIcon, LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../core/services/toast.service';
import { ExportPlatform, formatForPlatform, wrapInHtml } from '../../utils/export';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-copy',
    imports: [
        LucideAngularModule
    ],
  templateUrl: './task-copy.component.html',
  styleUrl: './task-copy.component.css',
})
export class TaskCopyComponent {
    readonly authService = inject(AuthService);
    readonly toastService = inject(ToastService)

    readonly task = input.required<Task>();

    readonly requireLogin = output<void>();

    readonly selectedCopyFormat = signal<ExportPlatform>('plain');
    mainButtonConfig = computed(() => {
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

    readonly icons = {
        copy: CopyIcon,
        lock: LockIcon,
        check: CheckIcon,
        markdown: CodeXmlIcon,
        json: FileBracesIcon,
        plainText: FileTextIcon,
        slack: HashIcon,
        jira: KanbanIcon,
    }

    triggerLogin(): void {
        // Close dropdown via DOM (DaisyUI hack)
        (document.activeElement as HTMLElement)?.blur();
        // Emit event to open the login modal
        this.requireLogin.emit();
    }

    async handleCopy(platform?: ExportPlatform): Promise<void> {
        // Remove focus from the clicked button
        (document.activeElement as HTMLElement)?.blur();

        // 1. PLG AUTH GUARD: Check if user is trying to access a premium format without being logged in
        const requestedPlatform = platform || this.selectedCopyFormat();

        if (requestedPlatform !== 'plain' && !this.authService.currentUser()) {
            // Trigger the login modal instead of copying
            this.requireLogin.emit();
            return;
        }

        // 2. State Update
        if (platform) {
            this.selectedCopyFormat.set(platform);
        }

        const targetPlatform = this.selectedCopyFormat();
        const markdownText = formatForPlatform(this.task(), targetPlatform);

        // 3. Execution (Your original logic)
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

                await navigator.clipboard.write(data);
            } catch (err) {
                console.error('[TaskExport] Rich copy failed, falling back to text', err);
                await navigator.clipboard.writeText(markdownText);
            }
        }

        this.toastService.success(`Copied for ${targetPlatform.toUpperCase()}`);
    }

    async handleDownload(type: 'markdown' | 'json'): Promise<void> {
        // Close dropdown
        (document.activeElement as HTMLElement)?.blur();

        if (!this.authService.currentUser()) {
            this.requireLogin.emit();
            return;
        }

        try {
            const taskData = this.task();
            const rawTitle = taskData.title || 'untitled-task';
            const safeTitle = rawTitle
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-') // Nahradí vše kromě písmen a čísel pomlčkou
                .replace(/(^-|-$)/g, '');

            let content: string;
            let filename: string;
            let mime: string;

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

            // Best practice for Firefox/Safari: add the link to the DOM and click it
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);
            this.toastService.success(`File ${filename} downloaded`);
        } catch (error) {
            console.error('[TaskExport] Download failed', error);
            this.toastService.error(`Failed to download ${type} file`);
        }
    }
}
