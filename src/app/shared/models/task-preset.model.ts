export type PresetMode = 'minimalist' | 'standard' | 'technical' | 'summary';

/** Short labels for preset mode (UI, saved collection metadata). */
export const PRESET_MODE_LABELS: Record<PresetMode, string> = {
    minimalist: 'Minimalist',
    standard: 'Standard',
    technical: 'Technical',
    summary: 'Summary',
};

export interface TaskPreset {
    id: PresetMode;
    label: string;
    icon: any; // Lucide icon reference
    description: string;
    isPremium?: boolean;
}

export interface ParseRequestPayload {
    inputText: string;
    preset: PresetMode;
}
