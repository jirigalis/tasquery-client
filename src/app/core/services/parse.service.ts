import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Task } from '../../shared/models/task.model';
import { ParseRequestPayload } from '../../shared/models/task-preset.model';

export type ExportType = 'json' | 'csv' | 'markdown';

export enum RefineAction {
    CHECKLIST = 'checklist',
    NON_TECH = 'non-tech',
    EDGE_CASES = 'edge-cases',
    SECURITY = 'security',
    TESTS = 'tests'
}

@Injectable({
    providedIn: 'root'
})
export class ParseService {
    private readonly http: HttpClient = inject(HttpClient);
    private apiUrl: string = environment.apiUrl;

    parseText(payload: ParseRequestPayload): Observable<Task[]> {
        return this.http.post<Task[]>(this.apiUrl + '/parse', payload);
    }

    refineTask(task: Task, action: RefineAction): Observable<Task> {
        return this.http.post<Task>(this.apiUrl + '/parse/refine', { task, action });
    }
}
