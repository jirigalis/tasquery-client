import { Component, signal } from '@angular/core';

interface ShowcaseTab {
    id: string;
    title: string;
    description: string;
}

@Component({
  selector: 'app-lp-outputs',
  imports: [],
  templateUrl: './lp-outputs.component.html',
  styleUrl: './lp-outputs.component.css',
})
export class LpOutputsComponent {
    activeTab = signal<string>('technical');

    readonly tabs: ShowcaseTab[] = [
        {
            id: 'minimalist',
            title: 'Minimalist',
            description: '3 bullet action items. No fluff. Perfect for quick bugs and hotfixes.'
        },
        {
            id: 'standard',
            title: 'Standard',
            description: 'Purpose, User Value, and Acceptance Criteria. The perfect structure for standard Jira stories.'
        },
        {
            id: 'technical',
            title: 'Technical',
            description: 'Implementation-heavy. Automatically suggests edge cases, DB schema notes, and example code snippets.'
        },
        {
            id: 'summary',
            title: 'Summary',
            description: 'High-level context focused on business outcomes, complete with clear "Next steps".'
        }
    ];

    // Pomocná metoda pro zobrazení názvu v hlavičce výstupu
    getActiveTabName(): string {
        return this.tabs.find(t => t.id === this.activeTab())?.title || '';
    }
}
