import { Component, computed, input, output } from '@angular/core';

export type ConfirmDialogType = 'confirm' | 'error' | 'success';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
    visible = input<boolean>(false);
    message = input<string>('');
    title = input<string>('Confirm');
    type = input<ConfirmDialogType>('confirm');
    confirmButtonClass = computed(() => {
        switch (this.type()) {
            case 'confirm':
                return 'btn-primary';
            case 'error':
                return 'btn-error';
            case 'success':
                return 'btn-success';
            default:
                return 'btn-primary';
        }})

    cancel = output<void>();
    confirm = output<void>();

    onCancel() {
        this.cancel.emit();
    }

    onConfirm() {
        this.confirm.emit();
    }
}
