import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  template: `
    @if (isOpen) {
      <div
        (click)="onClose.emit()"
        class="fixed inset-0 z-40 bg-[rgba(15,23,42,0.32)] backdrop-blur-[4px] transition-opacity duration-300"
      ></div>

      <div
        class="fixed right-0 top-0 z-50 flex h-[100dvh] w-[min(88vw,360px)] flex-col justify-between bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-[-12px_0_48px_rgba(15,23,42,0.16)] transition-transform duration-400"
      >
        <div>
          <div class="flex items-center justify-between p-6">
            <app-logo></app-logo>
            <button
              (click)="onClose.emit()"
              class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-[#142033] transition-colors hover:bg-slate-200"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mx-6 mb-4 h-px bg-slate-200"></div>

          <div class="flex flex-col space-y-2 px-6">
            @for (link of navLinks; track link.label) {
              <a
                [href]="link.href"
                (click)="onClose.emit()"
                class="block rounded-xl px-4 py-3 text-[1.05rem] font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                {{ link.label }}
              </a>
            }
          </div>
        </div>

        <div class="space-y-3 p-6">
          @if (authService.isAuthenticated()) {
            <button
              (click)="navigate('/dashboard')"
              class="w-full rounded-full bg-[#142033] py-3.5 text-[0.95rem] font-semibold text-white shadow-sm transition-all hover:shadow-lg"
            >
              Go to Dashboard
            </button>
          } @else {
            <button
              (click)="navigate('/signup')"
              class="w-full rounded-full bg-[#7342E2] py-3.5 text-[0.95rem] font-semibold text-white shadow-sm transition-all hover:shadow-lg"
            >
              Start For Free
            </button>
            <button
              (click)="navigate('/login')"
              class="w-full rounded-full border border-slate-200 bg-white py-3.5 text-[0.95rem] font-semibold text-[#142033] transition-all hover:bg-slate-50"
            >
              Sign In
            </button>
          }
        </div>
      </div>
    }
  `,
})
export class MobileMenuComponent {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();

  navLinks = [
    { label: 'Solutions', href: '#solutions' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Support', href: '#support' },
  ];

  constructor(public authService: AuthService, private router: Router) {}

  navigate(path: string): void {
    this.onClose.emit();
    this.router.navigate([path]);
  }
}
