import { Component } from '@angular/core';
import { LucideAngularModule, TestTubeDiagonal } from 'lucide-angular';

@Component({
  selector: 'app-lp-hero',
  imports: [LucideAngularModule],
  templateUrl: './lp-hero.component.html',
  styleUrl: './lp-hero.component.css',
})
export class LpHeroComponent {
  protected readonly tubeIcon = TestTubeDiagonal;
}
