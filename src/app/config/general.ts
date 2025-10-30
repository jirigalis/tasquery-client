import { TaskPriority } from '../utils/task.model';

export const GENERAL_CONFIG = {
    APP_NAME: 'Tasquery',
    MAX_TITLE_LENGTH: 100,
    MAX_LABELS_LENGTH: 100,
    MAX_BODY_LENGTH: 500,
    TASK_PRIORITIES: [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH],
    TEST_MODE: false,
}
