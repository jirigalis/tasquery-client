import { Task } from './task.model';

export interface TaskCollection {
    id: string;
    title: string;
    createdAt: string;
    tasks: Task[];
}
