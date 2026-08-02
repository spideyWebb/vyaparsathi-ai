import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MobileMenuComponent } from '../../shared/components/mobile-menu/mobile-menu.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, MobileMenuComponent],
  template: `
    <div class="relative min-h-screen w-full overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(115,66,226,0.12),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f4f6fb_100%)]">
      <div class="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[linear-gradient(180deg,rgba(255,255,255,0.75),rgba(255,255,255,0))]"></div>
      <div class="pointer-events-none absolute left-0 top-24 h-72 w-72 rounded-full bg-[#7342E2]/10 blur-3xl"></div>
      <div class="pointer-events-none absolute right-0 top-72 h-80 w-80 rounded-full bg-slate-900/5 blur-3xl"></div>

      <app-navbar (onMenuToggle)="isMenuOpen.set(!isMenuOpen())"></app-navbar>
      <app-mobile-menu [isOpen]="isMenuOpen()" (onClose)="isMenuOpen.set(false)"></app-mobile-menu>

      <main class="relative z-10">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class LandingLayoutComponent {
  isMenuOpen = signal(false);
}
