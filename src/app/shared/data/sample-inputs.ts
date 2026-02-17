export type SampleInputType = 'slack' | 'chat' | 'note';

export const SAMPLE_INPUTS: Record<SampleInputType, string> = {
    slack: `@anna can you update the pricing page? We're missing the new EU tiers.
@tom the login bug is back again – seems related to the latest deployment.
Also, do we have metrics on abandoned checkouts from last week?

cc @daniel — we'll need legal review on the partner contract changes.`,

    chat: `Alex: So… we agreed that I’ll handle the API docs, right?
Mira: Yep! And I’ll take care of finalizing the wireframes by Thursday.

Alex: Should we ping Daniel about the security audit? It’s overdue.
Mira: Good point. Also, let’s not forget to schedule that retro next week.`,

    note: `- Users keep requesting dark mode → maybe in Q1?
- Bug: filters on dashboard don’t work if you combine multiple tags.
- UX team suggested removing the tooltip delay (looks laggy)
- Partner integration with Acme still blocked – waiting for legal
- Nice to have: export reports to PDF`,
};

export type SampleInputLabel = { key: SampleInputType, label: string, tooltip: string };

export const SAMPLE_INPUT_LABELS: SampleInputLabel[] = [
    {
        key: 'slack',
        label: 'Slack thread',
        tooltip: 'Sample input simulating a Slack conversation with mentions and requests.'
    },
    {
        key: 'chat',
        label: 'Chat conversation',
        tooltip: 'Sample input simulating a chat conversation between two colleagues discussing tasks.'
    },
    {
        key: 'note',
        label: 'Meeting notes',
        tooltip: 'Sample input simulating meeting notes with action items and bugs.'
    },
];
