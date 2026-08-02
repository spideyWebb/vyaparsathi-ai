import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  template: `
    <nav class="relative z-20 mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
      <div class="cursor-pointer" (click)="navigate('/')">
        <app-logo></app-logo>
      </div>

      <div class="hidden items-center gap-8 md:flex">
        @for (link of navLinks; track link.label) {
          <a [href]="link.href" class="text-sm font-medium text-slate-600 transition-colors hover:text-[#142033]">
            {{ link.label }}
          </a>
        }
      </div>

      <div class="hidden items-center gap-3 md:flex">
        @if (authService.isAuthenticated()) {
          <button
            (click)="navigate('/dashboard')"
            class="rounded-full bg-[#142033] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-lg active:scale-95"
          >
            Go to Dashboard
          </button>
        } @else {
          <button
            (click)="navigate('/signup')"
            class="rounded-full bg-[#7342E2] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-lg active:scale-95"
          >
            Start For Free
          </button>
          <button
            (click)="navigate('/login')"
            class="rounded-full border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-[#142033] transition-all hover:bg-white active:scale-95"
          >
            Sign In
          </button>
        }
      </div>

      <button
        (click)="onMenuToggle.emit()"
        class="rounded-full p-2 text-[#142033] transition-colors hover:bg-black/5 md:hidden"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </nav>
  `,
})
export class NavbarComponent {
  @Output() onMenuToggle = new EventEmitter<void>();

  navLinks = [
    { label: 'Solutions', href: '#solutions' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'Features', href: '#features' },
    { label: 'Support', href: '#support' },
  ];

  constructor(public authService: AuthService, private router: Router) {}

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
