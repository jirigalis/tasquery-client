import { computed, inject, Injectable, signal } from '@angular/core';
import { TaskCollection } from '../../shared/models/task-collection.model';
import { LocalStorageService } from './local-storage.service';
import { Task } from "../../shared/models/task.model";

@Injectable({
  providedIn: 'root'
})
export class TaskCollectionsService {
    private storage = inject(LocalStorageService);
    private collectionsSignal = signal<TaskCollection[]>(this.storage.load());
    activeCollection = signal<TaskCollection | null>(null);

    collections = computed(() => this.collectionsSignal());

    setActive(collection: TaskCollection | null) {
        this.activeCollection.set(collection);
    }

    clearActive() {
        this.activeCollection.set(null);
    }

    add(collection: TaskCollection) {
        const updated = [...this.collectionsSignal(), collection];
        this.collectionsSignal.set(updated);
        this.storage.save(updated);
    }

    delete(collectionId: string) {
        const updated = this.collectionsSignal().filter(c => c.id !== collectionId);
        this.collectionsSignal.set(updated);
        this.storage.save(updated);
    }

    updateCollection(id: string, updatedTasks: Task[]): void {
        const updated = this.collectionsSignal().map((c: TaskCollection) => {
            if (c.id === id) {
                return {
                    ...c,
                    tasks: updatedTasks,
                }
            }

            return c;
        });

        this.collectionsSignal.set(updated);
        this.storage.save(updated);

        const currentActive = this.activeCollection();
        if (currentActive && currentActive.id === id) {
            const updatedActiveCollection = updated.find(c => c.id === id) || null;
            this.activeCollection.set(updatedActiveCollection);
        }
    }

    updateCollectionTitle(id: string, newTitle: string): void {
        const updated = this.collectionsSignal().map((c: TaskCollection) => {
            if (c.id === id) {
                return {
                    ...c,
                    title: newTitle,
                }
            }

            return c;
        });

        this.collectionsSignal.set(updated);

        if (this.activeCollection()?.id === id) {
            const updatedActive = updated.find(c => c.id === id) || null;
            this.activeCollection.set(updatedActive);
        }
        this.storage.save(updated);
    }
}
