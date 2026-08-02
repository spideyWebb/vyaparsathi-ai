import { Component, signal, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LogoComponent } from '../../../shared/components/logo/logo.component';
import { AuthService } from '../../../core/services/auth.service';

export type OnboardingStep = 'BUSINESS' | 'GST' | 'PREFERENCES' | 'DONE';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, LogoComponent],
  template: `
    <div class="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <!-- Decorative -->
      <div class="absolute top-[-10%] right-[-5%] w-80 h-80 bg-[#7342E2] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
      <div class="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-[#7342E2] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

      <!-- Logo -->
      <div class="mb-6 cursor-pointer hover:opacity-80 transition-opacity" (click)="navigate('/')">
        <app-logo></app-logo>
      </div>

      <!-- Progress Steps -->
      <div class="w-full max-w-lg mb-6">
        <div class="flex items-center justify-between relative">
          <div class="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-200 -translate-y-1/2 z-0"></div>
          <div
            class="absolute top-1/2 left-0 h-[2px] bg-[#7342E2] -translate-y-1/2 z-0 transition-all duration-500"
            [style.width]="progressWidth()"
          ></div>
          @for (s of stepLabels; track s.key; let i = $index) {
            <div class="relative z-10 flex flex-col items-center gap-1.5">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                [class.bg-[#7342E2]]="stepIndex() >= i"
                [class.text-white]="stepIndex() >= i"
                [class.bg-slate-200]="stepIndex() < i"
                [class.text-slate-500]="stepIndex() < i"
              >
                @if (stepIndex() > i) {
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                } @else {
                  {{ i + 1 }}
                }
              </div>
              <span class="text-[10px] font-semibold uppercase tracking-wide"
                [class.text-[#7342E2]]="stepIndex() >= i"
                [class.text-slate-400]="stepIndex() < i"
              >{{ s.label }}</span>
            </div>
          }
        </div>
      </div>

      <!-- Card -->
      <div class="w-full max-w-lg bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50 relative z-10">

        <!-- ─── STEP 1: BUSINESS INFO ─── -->
        @if (step() === 'BUSINESS') {
          <div class="space-y-5">
            <div class="text-center mb-2">
              <h2 class="text-xl font-extrabold text-[#192837]">Tell us about your business</h2>
              <p class="text-sm text-slate-500 mt-1">Bas kuch basic details — 2 minute lagenge</p>
            </div>

            <!-- Business Name -->
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Business Name <span class="text-red-400">*</span></label>
              <input
                type="text"
                [(ngModel)]="businessName"
                name="businessName"
                placeholder="e.g. Sharma Traders & Kirana"
                class="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#7342E2] focus:bg-white focus:ring-2 focus:ring-[#7342E2]/10 transition-all"
              />
            </div>

            <!-- Business Type -->
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Business Type</label>
              <div class="grid grid-cols-2 gap-2">
                @for (type of businessTypes; track type) {
                  <button
                    type="button"
                    (click)="businessType.set(type)"
                    class="py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all"
                    [class.bg-[#7342E2]]="businessType() === type"
                    [class.text-white]="businessType() === type"
                    [class.border-[#7342E2]]="businessType() === type"
                    [class.bg-slate-50]="businessType() !== type"
                    [class.text-slate-700]="businessType() !== type"
                    [class.border-slate-200]="businessType() !== type"
                  >
                    {{ type }}
                  </button>
                }
              </div>
            </div>

            <!-- Owner Name -->
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Owner Name <span class="text-red-400">*</span></label>
              <input
                type="text"
                [(ngModel)]="ownerName"
                name="ownerName"
                placeholder="e.g. Ramesh Sharma"
                class="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#7342E2] focus:bg-white focus:ring-2 focus:ring-[#7342E2]/10 transition-all"
              />
            </div>

            <!-- Error -->
            @if (errorMessage()) {
              <p class="text-xs text-red-500 font-medium flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {{ errorMessage() }}
              </p>
            }

            <button
              (click)="nextStep()"
              class="w-full py-3.5 bg-[#7342E2] text-white font-semibold text-sm rounded-full shadow-md shadow-[#7342E2]/20 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Next: GST Details</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </button>
          </div>
        }

        <!-- ─── STEP 2: GST DETAILS ─── -->
        @if (step() === 'GST') {
          <div class="space-y-5">
            <div class="text-center mb-2">
              <h2 class="text-xl font-extrabold text-[#192837]">GST Information</h2>
              <p class="text-sm text-slate-500 mt-1">GSTIN optional hai — baad mein bhi add kar sakte hain</p>
            </div>

            <!-- GSTIN -->
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">GSTIN Number <span class="text-slate-400 font-normal normal-case">(optional)</span></label>
              <input
                type="text"
                [(ngModel)]="gstin"
                name="gstin"
                maxlength="15"
                placeholder="07AAAAA0000A1Z5"
                (input)="onGstinInput($event)"
                class="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm font-mono tracking-wider text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#7342E2] focus:bg-white focus:ring-2 focus:ring-[#7342E2]/10 transition-all uppercase"
                [class.border-red-300]="gstinError()"
              />
              @if (gstinError()) {
                <p class="text-xs text-red-500 mt-1.5 font-medium">{{ gstinError() }}</p>
              }
            </div>

            <!-- GST Registration Type -->
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Registration Type</label>
              <div class="grid grid-cols-2 gap-2">
                @for (reg of gstRegTypes; track reg) {
                  <button
                    type="button"
                    (click)="gstRegType.set(reg)"
                    class="py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all"
                    [class.bg-[#7342E2]]="gstRegType() === reg"
                    [class.text-white]="gstRegType() === reg"
                    [class.border-[#7342E2]]="gstRegType() === reg"
                    [class.bg-slate-50]="gstRegType() !== reg"
                    [class.text-slate-700]="gstRegType() !== reg"
                    [class.border-slate-200]="gstRegType() !== reg"
                  >
                    {{ reg }}
                  </button>
                }
              </div>
            </div>

            <!-- PAN (auto-extracted or manual) -->
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">PAN Number</label>
              <input
                type="text"
                [(ngModel)]="pan"
                name="pan"
                maxlength="10"
                placeholder="AAAAA0000A"
                class="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm font-mono tracking-wider text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#7342E2] focus:bg-white focus:ring-2 focus:ring-[#7342E2]/10 transition-all uppercase"
              />
            </div>

            <div class="flex gap-3">
              <button
                (click)="prevStep()"
                class="flex-1 py-3.5 bg-slate-100 text-slate-700 font-semibold text-sm rounded-full hover:bg-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                <span>Back</span>
              </button>
              <button
                (click)="nextStep()"
                class="flex-1 py-3.5 bg-[#7342E2] text-white font-semibold text-sm rounded-full shadow-md shadow-[#7342E2]/20 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Next: Preferences</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </button>
            </div>
          </div>
        }

        <!-- ─── STEP 3: PREFERENCES ─── -->
        @if (step() === 'PREFERENCES') {
          <div class="space-y-5">
            <div class="text-center mb-2">
              <h2 class="text-xl font-extrabold text-[#192837]">AI Preferences</h2>
              <p class="text-sm text-slate-500 mt-1">Choose how your AI copilot will talk to you</p>
            </div>

            <!-- Language Preference -->
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-2 tracking-wide">AI Copilot Language</label>
              <div class="grid grid-cols-3 gap-2">
                @for (lang of languages; track lang.id) {
                  <button
                    type="button"
                    (click)="languagePref.set(lang.id)"
                    class="py-3 px-2 rounded-xl border text-sm font-bold transition-all"
                    [class.bg-[#7342E2]]="languagePref() === lang.id"
                    [class.text-white]="languagePref() === lang.id"
                    [class.border-[#7342E2]]="languagePref() === lang.id"
                    [class.bg-slate-50]="languagePref() !== lang.id"
                    [class.text-slate-700]="languagePref() !== lang.id"
                    [class.border-slate-200]="languagePref() !== lang.id"
                  >
                    {{ lang.label }}
                  </button>
                }
              </div>
            </div>

            <!-- WhatsApp Integration Toggle -->
            <div class="rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-[#192837]">WhatsApp Invoicing</p>
                  <p class="text-xs text-slate-500">Send invoices directly on WhatsApp</p>
                </div>
              </div>
              <button
                type="button"
                (click)="toggleWhatsappEnabled()"
                class="relative w-11 h-6 rounded-full transition-colors duration-300"
                [class.bg-[#7342E2]]="whatsappEnabled()"
                [class.bg-slate-300]="!whatsappEnabled()"
              >
                <span
                  class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300"
                  [class.translate-x-5]="whatsappEnabled()"
                ></span>
              </button>
            </div>

            <!-- UPI Auto-Reconcile Toggle -->
            <div class="rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#7342E2]/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-[#7342E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-[#192837]">Auto UPI Reconciliation</p>
                  <p class="text-xs text-slate-500">Match payments automatically</p>
                </div>
              </div>
              <button
                type="button"
                (click)="toggleUpiAutoReconcile()"
                class="relative w-11 h-6 rounded-full transition-colors duration-300"
                [class.bg-[#7342E2]]="upiAutoReconcile()"
                [class.bg-slate-300]="!upiAutoReconcile()"
              >
                <span
                  class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300"
                  [class.translate-x-5]="upiAutoReconcile()"
                ></span>
              </button>
            </div>

            <!-- Error -->
            @if (errorMessage()) {
              <p class="text-xs text-red-500 font-medium flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {{ errorMessage() }}
              </p>
            }

            <div class="flex gap-3">
              <button
                (click)="prevStep()"
                class="flex-1 py-3.5 bg-slate-100 text-slate-700 font-semibold text-sm rounded-full hover:bg-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                <span>Back</span>
              </button>
              <button
                (click)="submitOnboarding()"
                [disabled]="authService.isLoading()"
                class="flex-1 py-3.5 bg-[#7342E2] text-white font-semibold text-sm rounded-full shadow-md shadow-[#7342E2]/20 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                @if (authService.isLoading()) {
                  <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  Setting up...
                } @else {
                  <span>Launch Dashboard</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                }
              </button>
            </div>
          </div>
        }

        <!-- ─── STEP 4: DONE ─── -->
        @if (step() === 'DONE') {
          <div class="text-center py-6 space-y-5">
            <div class="w-20 h-20 mx-auto rounded-full bg-[#7342E2]/10 flex items-center justify-center animate-bounce">
              <svg class="w-10 h-10 text-[#7342E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            </div>
            <div>
              <h2 class="text-2xl font-extrabold text-[#192837]">Ready to Go! 🚀</h2>
              <p class="text-sm text-slate-500 mt-2">Your AI agents are now live and working for<br/><span class="font-semibold text-[#7342E2]">{{ businessName() }}</span></p>
            </div>
            <div class="bg-slate-50 rounded-2xl p-4 text-left space-y-2">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">What's enabled:</p>
              <div class="flex items-center gap-2 text-sm text-slate-700">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                WhatsApp Invoicing
              </div>
              <div class="flex items-center gap-2 text-sm text-slate-700">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                GST Reminder Agent
              </div>
              <div class="flex items-center gap-2 text-sm text-slate-700">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                Inventory Tracking
              </div>
              <div class="flex items-center gap-2 text-sm text-slate-700">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                Bilingual AI Support ({{ languagePref() }})
              </div>
            </div>
            <button
              (click)="goToDashboard()"
              class="w-full py-3.5 bg-[#7342E2] text-white font-semibold text-sm rounded-full shadow-lg shadow-[#7342E2]/30 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Open Dashboard</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </button>
          </div>
        }
      </div>

      <p class="text-xs text-slate-400 mt-6 text-center">
        🔒 100% secure · Data stays in India
      </p>
    </div>
  `,
})
export class OnboardingComponent implements OnInit {
  step = signal<OnboardingStep>('BUSINESS');
  businessName = signal<string>('');
  businessType = signal<string>('Retail & Kirana');
  ownerName = signal<string>('');
  gstin = signal<string>('');
  gstRegType = signal<string>('Regular');
  pan = signal<string>('');
  languagePref = signal<'hi' | 'en' | 'hinglish'>('hinglish');
  whatsappEnabled = signal<boolean>(true);
  upiAutoReconcile = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  gstinError = signal<string | null>(null);

  stepLabels = [
    { key: 'BUSINESS' as OnboardingStep, label: 'Business' },
    { key: 'GST' as OnboardingStep, label: 'GST' },
    { key: 'PREFERENCES' as OnboardingStep, label: 'AI Setup' },
  ];

  businessTypes = [
    'Retail & Kirana',
    'Wholesale & Distributor',
    'Manufacturing',
    'Service Provider',
    'Restaurant & Food',
    'E-commerce / D2C',
  ];

  gstRegTypes = ['Regular', 'Composition', 'Unregistered'];

  languages = [
    { id: 'hinglish' as const, label: 'Hinglish' },
    { id: 'hi' as const, label: 'हिंदी' },
    { id: 'en' as const, label: 'English' },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Pre-fill from auth service if available
    const user = this.authService.user();
    if (user) {
      if (user.businessName) this.businessName.set(user.businessName);
      if (user.gstin) this.gstin.set(user.gstin);
      if (user.businessType) this.businessType.set(user.businessType);
      if (user.languagePref) this.languagePref.set(user.languagePref);
    }
  }

  stepIndex(): number {
    const map: Record<OnboardingStep, number> = {
      BUSINESS: 0,
      GST: 1,
      PREFERENCES: 2,
      DONE: 3,
    };
    return map[this.step()];
  }

  progressWidth(): string {
    const idx = this.stepIndex();
    if (idx >= 3) return '100%';
    const pct = (idx / 2) * 100;
    return `${pct}%`;
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  onGstinInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.gstin.set(input.value.toUpperCase().slice(0, 15));
    input.value = this.gstin();
    this.gstinError.set(null);
  }

  validateGstin(): boolean {
    const g = this.gstin().trim();
    if (!g) return true; // optional
    const pattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!pattern.test(g)) {
      this.gstinError.set('Enter a valid 15-character GSTIN');
      return false;
    }
    // Auto-extract PAN from GSTIN
    this.pan.set(g.substring(2, 12));
    return true;
  }

  validateBusinessStep(): boolean {
    this.errorMessage.set(null);
    if (!this.businessName().trim()) {
      this.errorMessage.set('Business name is required');
      return false;
    }
    if (!this.ownerName().trim()) {
      this.errorMessage.set('Owner name is required');
      return false;
    }
    return true;
  }

  nextStep(): void {
    if (this.step() === 'BUSINESS') {
      if (!this.validateBusinessStep()) return;
      this.step.set('GST');
    } else if (this.step() === 'GST') {
      if (!this.validateGstin()) return;
      this.step.set('PREFERENCES');
    }
  }

  prevStep(): void {
    if (this.step() === 'GST') {
      this.step.set('BUSINESS');
    } else if (this.step() === 'PREFERENCES') {
      this.step.set('GST');
    }
  }

  toggleWhatsappEnabled(): void {
    this.whatsappEnabled.update((value) => !value);
  }

  toggleUpiAutoReconcile(): void {
    this.upiAutoReconcile.update((value) => !value);
  }

  async submitOnboarding(): Promise<void> {
    this.errorMessage.set(null);

    if (!this.languagePref()) {
      this.errorMessage.set('Please select a language preference');
      return;
    }

    const result = await this.authService.completeOnboarding({
      businessName: this.businessName(),
      ownerName: this.ownerName(),
      businessType: this.businessType(),
      gstin: this.gstin() || undefined,
      pan: this.pan() || undefined,
      gstRegType: this.gstRegType(),
      languagePref: this.languagePref(),
      whatsappEnabled: this.whatsappEnabled(),
      upiAutoReconcile: this.upiAutoReconcile(),
    });

    if (result.success) {
      this.step.set('DONE');
    } else {
      this.errorMessage.set(result.message || 'Something went wrong. Please try again.');
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
