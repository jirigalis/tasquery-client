import { Injectable } from '@angular/core';
import { TaskCollection } from '../../shared/models/task-collection.model';

const STORAGE_KEY = 'tasquery_collections';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
    load(): TaskCollection[] {
        const json = localStorage.getItem(STORAGE_KEY);
        return json ? JSON.parse(json) as TaskCollection[] : [];
    }

    save(collections: TaskCollection[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
    }
}
