import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export type ExportType = 'json' | 'csv' | 'markdown';

export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}

export interface Task {
    title: string;
    body: string;
    labels?: string[];
    priority?: TaskPriority | string;
}

@Injectable({
    providedIn: 'root'
})
export class ParseService {
    private readonly http: HttpClient = inject(HttpClient);
    private apiUrl: string = environment.apiUrl;

    private _testOutput: Task[] =
        [
            {
                "title": "Fix login error causing failure on login attempt",
                "body": "Investigate and resolve the 'Unexpected error, please try again later' issue that occurs after clicking the login button, which prevents users from logging in.",
                "labels": [
                    "bug",
                    "login",
                    "backend"
                ],
                "priority": TaskPriority.HIGH
            },
            {
                "title": "Add better error handling for login",
                "body": "The current error handling for the login process is insufficient. Improve the error messages to provide more context and guidance to users.",
                "labels": [
                    "enhancement",
                    "login",
                    "frontend"
                ],
                "priority": TaskPriority.MEDIUM
            }
        ]
    ;

    private readonly testOutput2: Task[] = [
            {
                "title": "Rename registration form fields",
                "body": "Change the field labels from 'username' to 'Enter your username' and 'password' to 'Enter your password' for better clarity.",
                "labels": [
                    "ui",
                    "enhancement"
                ],
                "priority": "medium"
            },
            {
                "title": "Add password validation",
                "body": "Implement password validation to ensure that users create secure passwords during registration.",
                "labels": [
                    "bug",
                    "feature",
                    "security"
                ],
                "priority": "high"
            }
        ]

    constructor() {
    }

    parseText(inputText: string): Observable<Task[]> {
        return this.http.post<Task[]>(this.apiUrl + '/parse', { inputText });

        // For testing purposes, return the testOutput directly as an observable with a delay
        /*return new Observable<Task[]>(observer => {
            setTimeout(() => {
                observer.next(this.testOutput);
                observer.complete();
            }, 100);
        });*/
    }

    exportTasks(tasks: any[], format: ExportType) {
        return this.http.post(this.apiUrl + '/export-format', { tasks: tasks, format: format }, { responseType: 'blob'});
    }
}
