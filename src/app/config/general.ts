import { TaskPriority } from '../shared/models/task.model';

export const GENERAL_CONFIG = {
    APP_NAME: 'Tasquery',
    MAX_TITLE_LENGTH: 200,
    MAX_TAGS_LENGTH: 100,
    TIER1_MAX_INPUT_LENGTH: 1000,
    TIER2_MAX_INPUT_LENGTH: 3000,
    MAX_TASK_CONTENT_LENGTH: 3000,
    TASK_PRIORITIES: Object.values(TaskPriority),
    TEST_MODE: false,
}
