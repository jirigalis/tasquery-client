import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { CircleCheckIcon, CircleXIcon, InfoIcon, LucideAngularModule, TriangleAlertIcon, XIcon } from 'lucide-angular';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-toast',
    imports: [
        NgClass,
        LucideAngularModule
    ],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.css'
})
export class ToastComponent {
    toastService: ToastService = inject(ToastService);

    protected readonly icons = {
        success: CircleCheckIcon,
        error: CircleXIcon,
        info: InfoIcon,
        warning: TriangleAlertIcon,
        close: XIcon
    }
}
