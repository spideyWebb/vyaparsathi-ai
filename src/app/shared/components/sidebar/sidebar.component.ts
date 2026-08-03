import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarService } from '../../../core/services/sidebar.service';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  template: `
    <!-- Mobile Backdrop Overlay -->
    @if (sidebarService.isOpen()) {
      <div
        (click)="sidebarService.close()"
        class="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden animate-in fade-in"
      ></div>
    }

    <!-- Sidebar Drawer Container -->
    <aside
      class="fixed left-0 top-0 z-50 flex h-screen flex-col justify-between bg-[linear-gradient(180deg,#142033_0%,#101828_100%)] text-white transition-all duration-300 shadow-2xl md:z-30"
      [class.translate-x-0]="sidebarService.isOpen()"
      [class.-translate-x-full]="!sidebarService.isOpen()"
      [class.md:translate-x-0]="true"
      [class.w-64]="true"
    >
      <div>
        <!-- Sidebar Header -->
        <div class="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <div class="cursor-pointer" (click)="navigate('/dashboard')">
            <app-logo [isLight]="true"></app-logo>
          </div>
          <button
            (click)="sidebarService.close()"
            class="rounded-lg bg-white/5 p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:hidden"
            title="Close Menu"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Store User Info Card -->
        <div class="mx-3 my-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5">
          <div class="flex h-9 w-9 items-center justify-center rounded-full bg-[#7342E2] text-xs font-bold text-white shadow-md flex-shrink-0">
            {{ authService.user()?.businessName ? authService.user()?.businessName?.charAt(0) : 'S' }}
          </div>
          <div class="overflow-hidden">
            <h4 class="truncate text-xs font-bold text-white leading-tight">
              {{ authService.user()?.businessName || 'Sharma Traders' }}
            </h4>
            <p class="truncate text-[10px] text-emerald-400 font-medium mt-0.5">✓ Verified MSME Store</p>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="space-y-1 px-3 py-2">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              (click)="sidebarService.close()"
              routerLinkActive="bg-[#7342E2] text-white shadow-lg shadow-[#7342E2]/30"
              class="flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-bold text-white/70 transition-all hover:bg-white/5 hover:text-white"
            >
              <svg class="h-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="item.iconPath" />
              </svg>
              <span class="flex flex-1 items-center justify-between truncate">
                {{ item.label }}
                @if (item.badge) {
                  <span class="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-black">
                    {{ item.badge }}
                  </span>
                }
              </span>
            </a>
          }
        </nav>
      </div>

      <!-- Footer Logout -->
      <div class="border-t border-white/10 p-3">
        <button
          (click)="logout()"
          class="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  navItems = [
    { label: 'Dashboard', path: '/dashboard', iconPath: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { label: 'Inventory', path: '/inventory', iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { label: 'Sales & Invoices', path: '/sales', iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { label: 'Finance & PnL', path: '/finance', iconPath: 'M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { label: 'GST Filing', path: '/gst', iconPath: 'M9 14l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'AI Business Assistant', path: '/ai-chat', iconPath: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', badge: 'AI' },
  ];

  constructor(
    public authService: AuthService,
    public sidebarService: SidebarService,
    private router: Router
  ) {}

  navigate(path: string): void {
    this.sidebarService.close();
    this.router.navigate([path]);
  }

  logout(): void {
    this.sidebarService.close();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
