import { Component, input, output } from '@angular/core';
import { ClipboardCheckIcon, CopyIcon, DownloadIcon, LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-export-dialog',
    imports: [
        LucideAngularModule
    ],
    templateUrl: './export-dialog.component.html',
    styleUrl: './export-dialog.component.css'
})
export class ExportDialogComponent {
    format = input('json');
    content = input<string>();
    onDownload = output();
    readonly copyIcon = CopyIcon;
    readonly downloadIcon = DownloadIcon;
    readonly clipboardCheckIcon = ClipboardCheckIcon
    toastHidden = true;

    close() {
        (document.getElementById('export_modal') as HTMLInputElement).checked = false;
    }

    download() {
        this.onDownload.emit()
        this.close();
    }

    copyToClipboard() {
        navigator.clipboard.writeText(JSON.stringify(this.content())).then(() => {
            this.toastHidden = false;
            setTimeout(() => {
                this.toastHidden = true;
            }, 2500);
        });
    }
}
