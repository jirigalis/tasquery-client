import { Task } from './task.model';

export enum RefineAction {
    EDGE_CASES = 'edge_cases', // Adds technical edge cases to AC
    NON_TECH = 'non_tech',     // Simplifies for PM / Business
    PUNCHY = 'punchy',         // Reduces word count, Linear-style
    TESTS = 'tests',           // Generates QA/Unit test checklist
    SECURITY = 'security',     // Audits for security implications
    CHECKLIST = 'checklist'    // Transforms description into a checklist
}

export interface RefineRequest {
    task: Task,
    action: RefineAction,
}
