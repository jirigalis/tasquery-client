import { Component } from '@angular/core';

export interface LpFaqItem {
    readonly question: string;
    readonly answerHtml: string;
}

@Component({
    selector: 'app-lp-faq',
    imports: [],
    templateUrl: './lp-faq.component.html',
    styleUrl: './lp-faq.component.css',
})
export class LpFaqComponent {
    protected readonly items: readonly LpFaqItem[] = [
        {
            question: 'How do I get started?',
            answerHtml:
                'Simply paste your text into the input box, and click the "Generate" button. Our AI will generate a structured ticket for you, ready to be pasted into your favorite project management tool.',
        },
        {
            question: "Do you store my company's data?",
            answerHtml:
                'No. Tasquery is stateless by default. Unless you create an account and explicitly opt-in to save your history, <strong>we do not store</strong> your text or generated tickets on our servers.',
        },
        {
            question: 'Do I need to create an account?',
            answerHtml:
                'No! You can use the core bridge <strong>completely for free without logging in</strong>. We only require a free account for power users who need longer character limits (up to 2000 chars) and advanced Jira/Slack formatting.',
        },
        {
            question: 'Does it work with Linear or Trello?',
            answerHtml:
                'Yes. The generated output is heavily structured Markdown, which pastes perfectly into <strong>Jira, Linear, GitHub Issues</strong>, and most modern project management tools.',
        },
        {
            question: 'How does it integrate with Jira/Linear?',
            answerHtml: 'Right now, it\'s a seamless copy-paste teleport to keep things <strong>100% no-login</strong>. Direct APIs are coming soon.',
        },
    ];
}
