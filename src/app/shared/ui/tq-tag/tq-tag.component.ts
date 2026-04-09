import { Component, computed, input } from '@angular/core';

/** Pastel palette for tags without keyword match and without explicit color. */
export const PASTEL_TAG_COLORS = [
    '#FFD6E8',
    '#FFE4B5',
    '#D4F1D4',
    '#B8E0FF',
    '#E6D5FF',
    '#B8F2E6',
] as const;

export type TagBadgeResolved =
    | { kind: 'daisy'; daisyClass: string }
    | { kind: 'solid'; backgroundColor: string; color: string };

function hashStringToIndex(value: string, modulo: number): number {
    let h = 0;
    for (let i = 0; i < value.length; i++) {
        h = (Math.imul(31, h) + value.charCodeAt(i)) | 0;
    }
    return Math.abs(h) % modulo;
}

/**
 * Resolves badge appearance: explicit color, keyword → DaisyUI semantic tokens, else deterministic pastel.
 * Extend keyword rules here as needed.
 */
export function resolveTagBadgeAppearance(text: string, explicitColor?: string | null): TagBadgeResolved {
    const trimmed = (explicitColor ?? '').trim();
    if (trimmed) {
        return {
            kind: 'solid',
            backgroundColor: trimmed,
            color: '#1f2937',
        };
    }

    const lower = text.toLowerCase();
    if (lower.includes('bug')) {
        return { kind: 'daisy', daisyClass: 'badge-error' };
    }
    if (lower.includes('feat')) {
        return { kind: 'daisy', daisyClass: 'badge-success' };
    }
    if (lower.includes('ux')) {
        return { kind: 'daisy', daisyClass: 'badge-info' };
    }

    const idx = hashStringToIndex(text, PASTEL_TAG_COLORS.length);
    return {
        kind: 'solid',
        backgroundColor: PASTEL_TAG_COLORS[idx],
        color: '#1f2937',
    };
}

@Component({
    selector: 'tq-tag',
    imports: [],
    templateUrl: './tq-tag.component.html',
    styleUrl: './tq-tag.component.css',
})
export class TqTagComponent {
    /** Tag label without leading # */
    text = input.required<string>();

    /** Optional CSS color (e.g. hex, rgb). When set, overrides keyword and pastel logic. */
    color = input<string | undefined>(undefined);

    private readonly appearance = computed(() => resolveTagBadgeAppearance(this.text(), this.color()));

    /** Narrowed for template type-checking (Angular does not narrow unions inside @switch). */
    protected readonly daisyBadge = computed((): { daisyClass: string } | null => {
        const a = this.appearance();
        return a.kind === 'daisy' ? { daisyClass: a.daisyClass } : null;
    });

    protected readonly solidBadge = computed((): { backgroundColor: string; color: string } | null => {
        const a = this.appearance();
        return a.kind === 'solid' ? { backgroundColor: a.backgroundColor, color: a.color } : null;
    });
}
