import { TaskPriority } from '../shared/models/task.model';

export const GENERAL_CONFIG = {
    APP_NAME: 'Tasquery',
    MAX_TITLE_LENGTH: 100,
    MAX_LABELS_LENGTH: 100,
    MAX_REQUEST_BODY_LENGTH: 500,
    MAX_TASK_CONTENT_LENGTH: 1000,
    TASK_PRIORITIES: Object.values(TaskPriority),
    TEST_MODE: false,
}
