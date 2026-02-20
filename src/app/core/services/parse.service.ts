import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Task, TaskPriority } from '../../shared/models/task.model';
import { GENERAL_CONFIG } from '../../config/general';

export type ExportType = 'json' | 'csv' | 'markdown';

export enum GenerationMode {
    STANDARD = 'standard',
    JIRA_BUG = 'jira-bug',
    ACTION_ITEMS = 'action-items',
    USER_STORY = 'user-story',
}

export enum RefineAction {
    SHORTEN = 'shorten',
    TECHNICAL = 'technical',
    ADD_AC = 'add-ac',
}

export interface GenerationConfig {
    mode: GenerationMode;
    includeAcceptanceCriteria: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ParseService {
    private readonly http: HttpClient = inject(HttpClient);
    private apiUrl: string = environment.apiUrl;

    private readonly testOutput: Task[] = [
            {
                "id": 1,
                "title": "Fix login error causing failure on login attempt",
                "content": "Investigate and resolve the 'Unexpected error, please try again later' issue that occurs after clicking the login button, which prevents users from logging in.",
                "labels": [
                    "bug",
                    "login",
                    "backend"
                ],
                "priority": TaskPriority.HIGH
            },
            {
                "id": 2,
                "title": "Add better error handling for login",
                "content": "The current error handling for the login process is insufficient. Improve the error messages to provide more context and guidance to users.",
                "labels": [
                    "enhancement",
                    "login",
                    "frontend"
                ],
                "priority": TaskPriority.MEDIUM
            }
        ];

    parseText(inputText: string, config?: GenerationConfig): Observable<Task[]> {
        if (!GENERAL_CONFIG.TEST_MODE) {
            return this.http.post<Task[]>(this.apiUrl + '/parse', {
                inputText,
                config: config || { mode: GenerationMode.STANDARD, includeAcceptanceCriteria: false },
            });
        } else {
            // For testing purposes, return the testOutput directly as an observable with a delay
            return new Observable<Task[]>(observer => {
                setTimeout(() => {
                    observer.next(this.testOutput);
                    observer.complete();
                }, 500);
            });
        }
    }

    refineTask(task: Task, action: RefineAction): Observable<Task> {
        if (!GENERAL_CONFIG.TEST_MODE) {
            return this.http.post<Task>(this.apiUrl + '/parse/refine', { task, action });
        } else {
            return new Observable<Task>(observer => {
                setTimeout(() => {
                    const updated = {
                        ...task,
                        content: task.content + `\n\n*(AI Refined: ${action})*`
                    };
                    observer.next(updated);
                    observer.complete();
                }, 800);
            });
        }
    }
}
