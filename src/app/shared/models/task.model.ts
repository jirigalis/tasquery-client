export type Task = {
    id: string | number;
    title: string;
    body: string;
    labels?: string[];
    priority: TaskPriority | string;
}

export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}
