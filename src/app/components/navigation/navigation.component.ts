import { Component, inject, input } from '@angular/core';
import { LucideAngularModule, MenuIcon } from 'lucide-angular';
import { ContactModalComponent } from '../../shared/ui/contact-modal/contact-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
    imports: [
        LucideAngularModule,
        ContactModalComponent
    ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
    public readonly menuIcon = MenuIcon;
    showMenu = input(true);

    private router = inject(Router);

    navigateHome() {
        this.router.navigate(['/']);
    }
}
