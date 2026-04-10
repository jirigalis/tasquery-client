import { Task } from './task.model';
import { PresetMode } from './task-preset.model';

export interface TaskCollection {
    id: string;
    title: string;
    createdAt: string;
    tasks: Task[];
    /** Preset selected when the collection was first saved (omitted on older stored data). */
    createdWithPreset?: PresetMode;
}
