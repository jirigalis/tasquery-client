export type PresetMode = 'minimalist' | 'standard' | 'technical' | 'summary';

export interface TaskPreset {
    id: PresetMode;
    label: string;
    icon: any; // Lucide icon reference
    description: string;
}

export interface ParseRequestPayload {
    inputText: string;
    preset: PresetMode;
}
