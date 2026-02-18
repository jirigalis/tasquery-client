import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../../shared/models/toast.model';
import { nanoid } from 'nanoid';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    readonly toasts = signal<Toast[]>([]);
    private readonly DEFAULT_DURATION = 3000;

    show(type: ToastType, message: string, duration?: number) {
        const id = nanoid();
        const newToast: Toast = { id, type, message, duration };

        this.toasts.update(current => [...current, newToast]);

        setTimeout(() => {
            this.remove(id);
        }, duration || this.DEFAULT_DURATION);
    }

    success(message: string, duration?: number) {
        this.show('success', message, duration);
    }

    error(message: string, duration = 5000) { // Error necháme déle (5s)
        this.show('error', message, duration);
    }

    info(message: string, duration?: number) {
        this.show('info', message, duration);
    }

    warning(message: string, duration?: number) {
        this.show('warning', message, duration);
    }

    remove(id: string) {
        this.toasts.update(current => current.filter(t => t.id !== id));
    }
}
