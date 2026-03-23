import { Component, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeXmlIcon, FileText, Layers, LockIcon, LucideAngularModule, Zap } from 'lucide-angular';
import { PresetMode, TaskPreset } from '../../../../shared/models/task-preset.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-task-presets',
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './task-preset.component.html',
    styleUrl: './task-preset.component.css'
})
export class TaskPresetsComponent {
    readonly authService = inject(AuthService);

    selectedMode = input.required<PresetMode>();

    presetChanged = output<PresetMode>();
    requireLogin = output<void>();

    activePreset = signal<PresetMode>('standard');

    readonly iconLock = LockIcon;

    readonly presets: TaskPreset[] = [
        { id: 'minimalist', label: 'Minimalist', icon: Zap, description: 'Just the facts. Best for quick bugs.' },
        { id: 'standard', label: 'Standard', icon: FileText, description: 'The perfect balance for daily stories.' },

        // TIER 1
        { id: 'technical', label: 'Technical', icon: CodeXmlIcon, description: 'Implementation-heavy. For devs by devs.', isPremium: true },
        { id: 'summary', label: 'Summary', icon: Layers, description: 'Focus on outcomes. For PMs & Stakeholders.', isPremium: true },
    ];

    constructor() {
        effect(() => {
            this.activePreset.set(this.selectedMode())
        });
    }

    selectPreset(preset: TaskPreset) {
        if (preset.isPremium && !this.authService.currentUser()) {
            this.requireLogin.emit();
            return;
        }

        if (this.activePreset() === preset.id) {
            return;
        }

        this.activePreset.set(preset.id);
        this.presetChanged.emit(preset.id);
    }

    getActivePresetDescription(): string {
        return this.presets.find(p => p.id === this.activePreset())?.description || '';
    }
}
