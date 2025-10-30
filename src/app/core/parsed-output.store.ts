import { effect, signal } from '@angular/core';

export type ParsedItemType = 'task' | 'note' | 'question';

export interface ParsedItem {
    id: string;
    type: ParsedItemType;
    text: string;
}

export const parsedItems = signal<ParsedItem[]>([]);

effect(() => {
    localStorage.setItem('parsed-items', JSON.stringify(parsedItems()));
});
