import { Component, computed, ElementRef, input, output, ViewChild } from '@angular/core';

export type ConfirmDialogType = 'confirm' | 'error' | 'success';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
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
        }
    });

    @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;

    confirm = output<void>();

    show() {
        this.dialogRef.nativeElement.showModal();
    }

    onConfirm() {
        this.confirm.emit();
    }
}
