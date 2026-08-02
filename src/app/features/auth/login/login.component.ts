import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LogoComponent } from '../../../shared/components/logo/logo.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LogoComponent],
  template: `
    <div class="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <!-- Logo Header -->
      <div class="mb-6 cursor-pointer" (click)="navigate('/')">
        <app-logo></app-logo>
      </div>

      <!-- Auth Card -->
      <div class="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl relative z-10">
        
        <!-- Neon Auth Cloud Badge -->
        <div class="mb-5 p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border border-emerald-200 rounded-2xl flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">Neon Database Connected</span>
          </div>
          <button
            (click)="triggerNeonAuthQuickLogin()"
            class="text-[10px] font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg transition-all"
          >
            Neon OAuth
          </button>
        </div>

        <!-- Auth Mode Tabs (Sign In vs Sign Up) -->
        <div class="flex items-center p-1 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            (click)="setMode('SIGNIN')"
            class="flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all"
            [class.bg-white]="mode() === 'SIGNIN'"
            [class.text-[#192837]]="mode() === 'SIGNIN'"
            [class.shadow-xs]="mode() === 'SIGNIN'"
            [class.text-slate-500]="mode() !== 'SIGNIN'"
          >
            Sign In
          </button>
          <button
            type="button"
            (click)="setMode('SIGNUP')"
            class="flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all"
            [class.bg-[#7342E2]]="mode() === 'SIGNUP'"
            [class.text-white]="mode() === 'SIGNUP'"
            [class.shadow-xs]="mode() === 'SIGNUP'"
            [class.text-slate-500]="mode() !== 'SIGNUP'"
          >
            Create Account (Sign Up)
          </button>
        </div>

        <!-- Title -->
        <div class="text-center mb-6">
          <h2 class="text-2xl font-heading font-extrabold text-[#192837]">
            {{ mode() === 'SIGNUP' ? 'Create Vyapar Account' : 'Sign In to Store' }}
          </h2>
          <p class="text-xs text-slate-500 mt-1">
            {{ mode() === 'SIGNUP' ? 'Enter business details to start a clean isolated store account' : 'Enter your registered Mobile Number, Email or Username' }}
          </p>
        </div>

        <!-- Error Message Alert -->
        @if (authService.errorMessage()) {
          <div class="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-700 text-center leading-relaxed">
            ⚠️ {{ authService.errorMessage() }}
          </div>
        }

        <!-- Form -->
        <form (submit)="handleSubmit($event)" class="space-y-3.5">
          @if (mode() === 'SIGNUP') {
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Business / Store Name *</label>
              <input
                type="text"
                required
                [ngModel]="businessName()"
                (ngModelChange)="businessName.set($event)"
                name="businessName"
                placeholder="e.g. Sharma Traders & Kirana"
                class="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#7342E2] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Mobile Number or Email *</label>
              <input
                type="text"
                required
                [ngModel]="contact()"
                (ngModelChange)="contact.set($event)"
                name="contact"
                placeholder="e.g. 9876543210 or sharma@kirana.com"
                class="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#7342E2] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Username *</label>
              <input
                type="text"
                required
                [ngModel]="username()"
                (ngModelChange)="username.set($event)"
                name="username"
                placeholder="e.g. sharma_store"
                class="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#7342E2] focus:bg-white transition-all"
              />
            </div>
          } @else {
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Mobile Number, Email or Username *</label>
              <input
                type="text"
                required
                [ngModel]="username()"
                (ngModelChange)="username.set($event)"
                name="username"
                placeholder="e.g. 9876543210 or sharma@kirana.com"
                class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#7342E2] focus:bg-white transition-all"
              />
            </div>
          }

          <div>
            <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Password *</label>
            <input
              type="password"
              required
              [ngModel]="password()"
              (ngModelChange)="password.set($event)"
              name="password"
              placeholder="••••••••"
              class="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#7342E2] focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-[#7342E2] text-white font-bold text-xs rounded-full shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {{ mode() === 'SIGNUP' ? 'Create Account' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  mode = signal<'SIGNIN' | 'SIGNUP'>('SIGNIN');
  businessName = signal<string>('');
  contact = signal<string>('');
  username = signal<string>('');
  password = signal<string>('');

  constructor(public authService: AuthService, private router: Router) {}

  setMode(m: 'SIGNIN' | 'SIGNUP'): void {
    this.mode.set(m);
    this.authService.errorMessage.set(null);
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  async triggerNeonAuthQuickLogin(): Promise<void> {
    const neonUser = 'neon_user_' + Math.floor(1000 + Math.random() * 9000);
    const email = neonUser + '@neon.tech';
    const success = await this.authService.neonAuthSync(neonUser, email, 'Neon MSME Store');
    if (success) {
      this.router.navigate(['/dashboard']);
    }
  }

  async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();
    this.authService.errorMessage.set(null);

    let success = false;
    if (this.mode() === 'SIGNUP') {
      if (!this.businessName().trim() || !this.contact().trim() || !this.username().trim() || !this.password().trim()) return;
      success = await this.authService.signup(
        this.businessName().trim(),
        this.contact().trim(),
        this.username().trim(),
        this.password().trim()
      );
    } else {
      if (!this.username().trim() || !this.password().trim()) return;
      success = await this.authService.login(this.username().trim(), this.password().trim());
    }

    if (success) {
      this.router.navigate(['/dashboard']);
    }
  }
}
