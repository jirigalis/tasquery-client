export type Task = {
    id: string | number;
    title: string;
    content: string;
    labels?: string[];
    priority: TaskPriority;
}

export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}
