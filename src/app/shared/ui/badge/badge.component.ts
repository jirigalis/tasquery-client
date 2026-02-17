import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  imports: [],
  templateUrl: './badge.component.html',
})
export class BadgeComponent {
    label = input('');
    type = computed(() => {
        switch (this.label()) {
            case 'primary':
                return 'badge-primary';
            case 'feature':
            case 'enhancement':
            case 'success':
                return 'badge-success';
            case 'warning':
                return 'badge-warning';
            case 'error':
            case 'bug':
                return 'badge-error';
            default:
                return 'badge-info';
        }
    });

    size = input<string>('md');
    sizeClass = computed(() => {
        switch (this.size()) {
            case 'sm':
                return 'badge-sm';
            case 'lg':
                return 'badge-lg';
            default:
                return 'badge-md';
        }
    });
}
