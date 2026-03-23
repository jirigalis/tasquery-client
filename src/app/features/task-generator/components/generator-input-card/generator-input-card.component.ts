import { Component, inject, input, output, viewChild } from '@angular/core';
import { PresetMode } from '../../../../shared/models/task-preset.model';
import { SampleInputType } from '../../../../shared/data/sample-inputs';
import { LucideAngularModule, SendHorizontalIcon } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { TaskPresetsComponent } from '../task-preset/task-preset.component';
import { LoginComponent } from '../../../../components/auth/login/login.component';
import { AnalyticsService } from '../../../../core/services/analytics.service';

@Component({
  selector: 'app-generator-input-card',
    imports: [
        FormsModule,
        LucideAngularModule,
        TaskPresetsComponent,
        LoginComponent
    ],
  templateUrl: './generator-input-card.component.html',
  styleUrl: './generator-input-card.component.css',
})
export class GeneratorInputCardComponent {
    private readonly analyticsService = inject(AnalyticsService);

    inputText = input.required<string>();
    loading = input.required<boolean>();
    isInputValid = input.required<boolean>();
    currentMode = input.required<PresetMode>();
    maxBodyLength = input.required<number>();
    sampleInputLabels = input.required<{key: SampleInputType, label: string}[]>();

    loginModal = viewChild.required<LoginComponent>(LoginComponent);

    generate = output<void>();
    inputChange = output<string>();
    presetChange = output<PresetMode>();
    loadSample = output<SampleInputType>();

    protected readonly icons = {
        send: SendHorizontalIcon
    };

    onInputChange(value: string): void {
        this.inputChange.emit(value);
    }

    onRequireLogin(): void {
        this.analyticsService.trackLockedFeatureClick('task-preset', this.currentMode());
        this.loginModal().open();
    }
}
