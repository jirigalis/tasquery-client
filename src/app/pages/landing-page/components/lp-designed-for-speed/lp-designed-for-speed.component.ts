import { Component } from '@angular/core';
import { CircleCheckIcon, CircleXIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-lp-designed-for-speed',
  imports: [LucideAngularModule],
  templateUrl: './lp-designed-for-speed.component.html',
  styleUrl: './lp-designed-for-speed.component.css',
})
export class LpDesignedForSpeedComponent {
  protected readonly icons = {
    circleCheck: CircleCheckIcon,
    circleX: CircleXIcon,
  };
}
