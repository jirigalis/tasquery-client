import { Task } from './task.model';

/**
 * Generate a JSON string for a task.
 *
 * @param task
 */
export function generateJSON(task: Task): string {
    return JSON.stringify(task, null, 2);
}

/**
 * Generate a Markdown string for a task.
 *
 * @param task The task object containing the title, body, labels, and priority.
 */
export function generateMarkdown(task: Task): string {
    return `### ${task.title}

**Description:**
${task.body}

**Labels:** ${task.labels?.join(', ') || 'none'}
**Priority:** ${task.priority || 'unspecified'}
`;
}

export function generateCSV(task: Task): string {
    const headers: any = Array<keyof Task>;
    // const headers = ['Title', 'Description', 'Labels', 'Priority'];
    const values = [
        `"${task.title}"`,
        `"${task.body}"`,
        `"${(task.labels || []).join(',')}"`,
        `"${task.priority || ''}"`
    ];

    return `${headers.join(',')}\n${values.join(',')}`;
}
