import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-6 flex items-center justify-between">
      <!-- Search / Page Title -->
      <div class="flex items-center gap-4">
        <h1 class="text-base font-heading font-extrabold text-[#192837] tracking-tight">
          VyaparSathi AI MSME Workspace
        </h1>
      </div>

      <!-- Action Items & User Profile -->
      <div class="flex items-center gap-4">
        <!-- Notification Bell with Floating Dropdown Overlay -->
        <div class="relative">
          <button
            (click)="toggleNotifications()"
            class="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all relative"
            title="Notifications"
          >
            <span class="text-base">🔔</span>
            @if (unreadCount() > 0) {
              <span class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white">
                {{ unreadCount() }}
              </span>
            }
          </button>

          <!-- Notification Dropdown Panel -->
          @if (showNotifications()) {
            <div class="absolute right-0 mt-2 w-80 bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h4 class="text-xs font-extrabold text-[#192837] uppercase tracking-wider">Store Notifications</h4>
                @if (unreadCount() > 0) {
                  <button
                    (click)="markAllRead()"
                    class="text-[10px] font-bold text-[#7342E2] hover:underline"
                  >
                    Mark all read
                  </button>
                }
              </div>

              <div class="space-y-2 max-h-64 overflow-y-auto">
                @for (n of notifications(); track n.id) {
                  <div
                    class="p-3 rounded-2xl border transition-all"
                    [class.bg-purple-50]="!n.read"
                    [class.border-purple-100]="!n.read"
                    [class.bg-slate-50]="n.read"
                    [class.border-slate-100]="n.read"
                  >
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-xs font-bold text-[#192837]">{{ n.text }}</span>
                      <span class="text-[9px] font-semibold text-slate-400">{{ n.time }}</span>
                    </div>
                    <p class="text-[11px] text-slate-600 leading-snug">{{ n.desc }}</p>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- User Profile Dropdown -->
        <div class="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div class="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#7342E2] to-[#5b2ec6] text-white flex items-center justify-center font-extrabold text-xs shadow-md">
            {{ getUserInitials() }}
          </div>

          <div class="hidden sm:block text-left">
            <h3 class="text-xs font-extrabold text-[#192837]">
              {{ authService.user()?.businessName || 'Sharma General Store' }}
            </h3>
            <span class="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live Account
            </span>
          </div>

          <button
            (click)="logout()"
            class="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
            title="Log Out"
          >
            <span class="text-xs font-bold uppercase">Logout</span>
          </button>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  showNotifications = signal<boolean>(false);

  notifications = signal([
    { id: 1, text: 'Welcome to VyaparSathi AI', desc: 'Your store account is active and ready for billing & inventory management.', time: 'Just now', read: false },
    { id: 2, text: 'Inventory Stock Alerts', desc: 'Add items in Inventory tab to enable automated reorder reminders.', time: '10m ago', read: false },
    { id: 3, text: 'Billing & GST Compliance', desc: 'Create invoices in Sales tab to calculate live cash flow & GST tax.', time: '1h ago', read: false },
  ]);

  unreadCount = computed(() => this.notifications().filter((n) => !n.read).length);

  constructor(public authService: AuthService, private router: Router) {}

  toggleNotifications(): void {
    this.showNotifications.update((v) => !v);
  }

  markAllRead(): void {
    this.notifications.update((list) => list.map((n) => ({ ...n, read: true })));
  }

  getUserInitials(): string {
    const name = this.authService.user()?.businessName || 'Sharma Store';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
