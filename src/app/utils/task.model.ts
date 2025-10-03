export type Task = {
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
