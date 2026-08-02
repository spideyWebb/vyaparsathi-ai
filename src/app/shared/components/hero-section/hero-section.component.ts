import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative z-10 mx-auto flex max-w-[1280px] flex-col items-center justify-center px-5 pb-[32px] pt-[clamp(40px,6vw,64px)] sm:px-8">
      <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7342E2]/20 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
        <span class="relative flex h-2.5 w-2.5">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7342E2] opacity-75"></span>
          <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#7342E2]"></span>
        </span>
        <span class="text-sm font-medium text-[#7342E2]">Trusted by 10,000+ MSMEs across Bharat</span>
      </div>

      <div class="mx-auto flex max-w-[760px] flex-col items-center gap-6 text-center">
        <h1 class="font-heading select-none text-[clamp(1.85rem,5.5vw,3.4rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-[#142033]">
          <span class="block">AI Agents for</span>
          <span class="block"><span class="text-[#7342E2]">Bharat's</span> Businesses</span>
          <span class="mt-2 block text-[clamp(1.1rem,3vw,1.6rem)] font-semibold tracking-normal text-slate-500">
            Har vyapaar ka intelligent partner
          </span>
        </h1>

        <p class="font-body max-w-[600px] text-[clamp(0.95rem,2.5vw,1.15rem)] leading-[1.7] text-slate-600">
          From WhatsApp invoicing for kirana stores to GST reminders and UPI reconciliation,
          VyaparSathi AI automates your back-office so you can focus on growth.
        </p>

        <div class="flex flex-col items-center gap-3 pt-2 sm:flex-row">
          <button
            (click)="navigate(authService.isAuthenticated() ? '/dashboard' : '/signup')"
            class="group flex min-w-[220px] items-center justify-center gap-3 rounded-full bg-[#7342E2] px-[28px] py-[17px] text-[clamp(0.9rem,2vw,1rem)] font-semibold text-white shadow-[0_12px_32px_rgba(115,66,226,0.25)] transition-all hover:scale-105 active:scale-95"
          >
            <span>{{ authService.isAuthenticated() ? 'Go to Dashboard' : 'Start Your Free Journey' }}</span>
            <svg class="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <button
            (click)="scrollTo('demo')"
            class="flex min-w-[220px] items-center justify-center gap-3 rounded-full border border-slate-200 bg-white/80 px-[28px] py-[17px] text-[clamp(0.9rem,2vw,1rem)] font-semibold text-[#142033] backdrop-blur transition-all hover:bg-white active:scale-95"
          >
            <svg class="h-5 w-5 text-[#7342E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Watch Demo</span>
          </button>
        </div>
      </div>

      <div class="mt-10 grid grid-cols-2 gap-6 text-center sm:grid-cols-4 sm:gap-10">
        <div class="flex flex-col items-center">
          <span class="font-heading text-[clamp(1.5rem,3vw,2rem)] font-bold text-[#142033]">10,000+</span>
          <span class="mt-1 text-xs sm:text-sm text-slate-500">Active MSMEs</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="font-heading text-[clamp(1.5rem,3vw,2rem)] font-bold text-[#142033]">Rs 500Cr+</span>
          <span class="mt-1 text-xs sm:text-sm text-slate-500">Invoices Processed</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="font-heading text-[clamp(1.5rem,3vw,2rem)] font-bold text-[#142033]">12</span>
          <span class="mt-1 text-xs sm:text-sm text-slate-500">Indian Languages</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="font-heading text-[clamp(1.5rem,3vw,2rem)] font-bold text-[#142033]">99.8%</span>
          <span class="mt-1 text-xs sm:text-sm text-slate-500">Uptime SLA</span>
        </div>
      </div>
    </section>
  `,
})
export class HeroSectionComponent {
  constructor(public authService: AuthService, private router: Router) {}

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
