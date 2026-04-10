import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Task } from '../../shared/models/task.model';
import { ParseRequestPayload, PresetMode } from '../../shared/models/task-preset.model';
import { RefineAction } from '../../shared/models/refine.model';

@Injectable({
    providedIn: 'root'
})
export class ParseService {
    private readonly http: HttpClient = inject(HttpClient);
    private apiUrl: string = environment.apiUrl;

    parseText(payload: ParseRequestPayload): Observable<Task[]> {
        return this.http.post<Task[]>(this.apiUrl + '/parse', payload);
    }

    refineTask(task: Task, action: RefineAction, preset: PresetMode): Observable<Task> {
        const { title, content, priority, tags } = task;
        const payload = {
            task: {
                title,
                content,
                priority,
                tags,
            },
            action,
            preset,
        };

        return this.http.post<Task>(this.apiUrl + '/parse/refine', payload);
    }
}
