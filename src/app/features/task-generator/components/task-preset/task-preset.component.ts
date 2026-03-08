import { Component, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Code2, FileText, Layers, LucideAngularModule, Zap } from 'lucide-angular';
import { PresetMode, TaskPreset } from '../../../../shared/models/task-preset.model';

@Component({
    selector: 'app-task-presets',
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './task-preset.component.html',
    styleUrl: './task-preset.component.css'
})
export class TaskPresetsComponent {
    selectedMode = input.required<PresetMode>();
    presetChanged = output<PresetMode>();

    activePreset = signal<PresetMode>('standard');

    readonly presets: TaskPreset[] = [
        { id: 'minimalist', label: 'Minimalist', icon: Zap, description: 'Just the facts. Best for quick bugs.' },
        { id: 'standard', label: 'Standard', icon: FileText, description: 'The perfect balance for daily stories.' },
        { id: 'technical', label: 'Technical', icon: Code2, description: 'Implementation-heavy. For devs by devs.' },
        { id: 'summary', label: 'Summary', icon: Layers, description: 'Focus on outcomes. For PMs & Stakeholders.' }
    ];

    constructor() {
        effect(() => {
            this.activePreset.set(this.selectedMode())
        });
    }

    selectPreset(mode: PresetMode) {
        if (this.activePreset() === mode) {
            return;
        }

        this.activePreset.set(mode);
        this.presetChanged.emit(mode);
    }

    getActivePresetDescription(): string {
        return this.presets.find(p => p.id === this.activePreset())?.description || '';
    }
}
