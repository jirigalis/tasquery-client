import { Component } from '@angular/core';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { LpComparisonComponent } from './components/lp-comparison/lp-comparison.component';
import { LpFaqComponent } from './components/lp-faq/lp-faq.component';
import { LpFooterComponent } from './components/lp-footer/lp-footer.component';
import { LpHeroComponent } from './components/lp-hero/lp-hero.component';
import { LpLogoWallComponent } from './components/lp-logo-wall/lp-logo-wall.component';
import { LpSocialsComponent } from './components/lp-socials/lp-socials.component';
import { LpWaitlistCtaComponent } from './components/lp-waitlist-cta/lp-waitlist-cta.component';
import { LpUseCasesComponent } from './components/lp-use-cases/lp-use-cases.component';
import { LpDesignedForSpeedComponent } from './components/lp-designed-for-speed/lp-designed-for-speed.component';

@Component({
  selector: 'app-landing-page',
    imports: [
        NavigationComponent,
        LpComparisonComponent,
        LpFaqComponent,
        LpFooterComponent,
        LpHeroComponent,
        LpLogoWallComponent,
        LpSocialsComponent,
        LpWaitlistCtaComponent,
        LpUseCasesComponent,
        LpDesignedForSpeedComponent,
    ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {}
