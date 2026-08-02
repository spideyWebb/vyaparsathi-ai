import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  template: `
    <aside
      class="fixed left-0 top-0 z-30 flex h-screen flex-col justify-between bg-[linear-gradient(180deg,#142033_0%,#101828_100%)] text-white transition-all duration-300 shadow-xl"
      [class.w-64]="sidebarOpen()"
      [class.w-20]="!sidebarOpen()"
    >
      <div>
        <div class="flex h-16 items-center justify-between border-b border-white/10 px-4">
          @if (sidebarOpen()) {
            <div class="cursor-pointer" (click)="navigate('/dashboard')">
              <app-logo [isLight]="true"></app-logo>
            </div>
          } @else {
            <div class="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#7342E2] font-bold text-white shadow-md">
              VS
            </div>
          }
          <button
            (click)="toggleSidebar()"
            class="rounded-lg bg-white/5 p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="sidebarOpen() ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'" />
            </svg>
          </button>
        </div>

        @if (sidebarOpen()) {
          <div class="mx-3 my-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#7342E2] text-sm font-bold text-white shadow-md">
              {{ authService.user()?.businessName ? authService.user()?.businessName?.charAt(0) : 'S' }}
            </div>
            <div class="overflow-hidden">
              <h4 class="truncate text-sm font-semibold text-white">{{ authService.user()?.businessName || 'Sharma Traders' }}</h4>
              <p class="truncate text-xs text-emerald-400 font-medium">✓ Verified MSME Store</p>
            </div>
          </div>
        }

        <nav class="space-y-1 px-3 py-2">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-[#7342E2] text-white shadow-lg shadow-[#7342E2]/30"
              class="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-white/70 transition-all hover:bg-white/5 hover:text-white"
              [class.justify-center]="!sidebarOpen()"
              [class.px-0]="!sidebarOpen()"
            >
              <svg class="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="item.iconPath" />
              </svg>
              @if (sidebarOpen()) {
                <span class="flex flex-1 items-center justify-between truncate">
                  {{ item.label }}
                  @if (item.badge) {
                    <span class="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-black">
                      {{ item.badge }}
                    </span>
                  }
                </span>
              }
            </a>
          }
        </nav>
      </div>

      <div class="border-t border-white/10 p-3">
        <button
          (click)="logout()"
          class="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          [class.justify-center]="!sidebarOpen()"
        >
          <svg class="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          @if (sidebarOpen()) {
            <span>Logout</span>
          }
        </button>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  sidebarOpen = signal(true);

  navItems = [
    { label: 'Dashboard', path: '/dashboard', iconPath: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { label: 'Inventory', path: '/inventory', iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { label: 'Sales & Invoices', path: '/sales', iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { label: 'Finance & PnL', path: '/finance', iconPath: 'M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { label: 'GST Filing', path: '/gst', iconPath: 'M9 14l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'AI Business Assistant', path: '/ai-chat', iconPath: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', badge: 'AI' },
  ];

  constructor(public authService: AuthService, private router: Router) {}

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
