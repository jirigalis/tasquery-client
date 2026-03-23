import { Component, inject, input, output } from '@angular/core';
import { BookUserIcon, InfoIcon, ListIcon, LockIcon, LucideAngularModule, SparklesIcon, TestTubeIcon, ZapIcon } from 'lucide-angular';
import { RefineAction } from '../../models/refine.model';
import { WaitlistService } from '../../../core/services/waitlist.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-task-refine-actions',
    imports: [LucideAngularModule],
    templateUrl: './task-refine-actions.component.html',
    styleUrl: './task-refine-actions.component.css',
})
export class TaskRefineActionsComponent {
    protected readonly waitlistService = inject(WaitlistService);
    protected readonly authService = inject(AuthService);

    isRefining = input.required<boolean>();
    applyAiAction = output<RefineAction>();
    requireLogin = output<void>();

    protected readonly icons = {
        magic: SparklesIcon,
        info: InfoIcon,
        zap: ZapIcon,
        list: ListIcon,
        userStory: BookUserIcon,
        sparkles: SparklesIcon,
        lock: LockIcon,
        testTube: TestTubeIcon,
    };

    protected readonly magicActionGroups = [
        {
            title: 'Refine Content',
            actions: [
                {
                    id: RefineAction.PUNCHY,
                    label: 'Make it Punchy',
                    icon: this.icons.zap,
                    iconClass: 'text-warning',
                    description: 'Reduces word count and uses minimalist Linear-style language.',
                    requireLogin: false,
                },
                {
                    id: RefineAction.CHECKLIST,
                    label: 'Break into Checklist',
                    icon: this.icons.list,
                    iconClass: '',
                    description: 'Transforms the description into a clear, actionable checklist.',
                    requireLogin: false,
                },
                {
                    id: RefineAction.NON_TECH,
                    label: 'Business Translation',
                    icon: this.icons.userStory,
                    iconClass: '',
                    description: 'Simplifies technical jargon for Product Managers and stakeholders.',
                    requireLogin: true,
                }
            ]
        },
        {
            title: 'Deep Analysis',
            actions: [
                {
                    id: RefineAction.EDGE_CASES,
                    label: 'Anticipate Edge Cases',
                    icon: this.icons.sparkles,
                    iconClass: 'text-primary',
                    description: 'Adds 3-4 non-obvious technical edge cases to Acceptance Criteria.',
                    requireLogin: false,
                },
                {
                    id: RefineAction.SECURITY,
                    label: 'Security Audit',
                    icon: this.icons.lock,
                    iconClass: 'text-secondary',
                    description: 'Audits the task for potential security vulnerabilities and implications.',
                    requireLogin: true,
                },
                {
                    id: RefineAction.TESTS,
                    label: 'QA / Unit Tests',
                    icon: this.icons.testTube,
                    iconClass: '',
                    description: 'Generates a \'How to test\' section with specific verification steps.',
                    requireLogin: true,
                }
            ]
        }
    ];
}
