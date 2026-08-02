import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeroSectionComponent } from '../../shared/components/hero-section/hero-section.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, HeroSectionComponent],
  template: `
    <app-hero-section></app-hero-section>

    <!-- ===== TRUST STRIP ===== -->
    <section class="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 py-8">
      <div class="rounded-2xl bg-white border border-[#192837]/8 px-6 py-5 flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-80">
        <span class="text-xs font-semibold text-[#192837]/40 uppercase tracking-widest">Backed by</span>
        <div class="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          <span class="font-heading font-bold text-[#192837]/40 text-lg">NPCI</span>
          <span class="font-heading font-bold text-[#192837]/40 text-lg">GSTN</span>
          <span class="font-heading font-bold text-[#192837]/40 text-lg">Razorpay</span>
          <span class="font-heading font-bold text-[#192837]/40 text-lg">PhonePe</span>
          <span class="font-heading font-bold text-[#192837]/40 text-lg">UPI</span>
        </div>
      </div>
    </section>

    <!-- ===== PROBLEM / WHY ===== -->
    <section id="solutions" class="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 py-[clamp(48px,8vw,80px)]">
      <div class="text-center max-w-[640px] mx-auto mb-12">
        <span class="text-sm font-semibold text-[#7342E2] uppercase tracking-widest">The Problem</span>
        <h2 class="font-heading font-extrabold text-[#192837] text-[clamp(1.5rem,4vw,2.4rem)] mt-3 leading-tight">
          Bharat ke Vyapaariyon Ka Asli Dukh
        </h2>
        <p class="text-[#192837]/70 mt-3 text-[clamp(0.9rem,2vw,1.05rem)] leading-relaxed">
          6.3 crore MSMEs in India still run on pen, paper, and memory. GST late fees pile up. Inventory goes stale. D2C customers get ghosted. And UPI payments? A reconciliation nightmare.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        @for (pain of painPoints; track pain.title) {
          <div class="group rounded-2xl bg-white border border-[#192837]/8 p-6 hover:shadow-lg hover:border-[#7342E2]/20 transition-all cursor-default">
            <div class="w-11 h-11 rounded-xl bg-[#7342E2]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 text-[#7342E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" [attr.d]="pain.icon"/>
              </svg>
            </div>
            <h3 class="font-semibold text-[#192837] text-lg mb-1.5">{{ pain.title }}</h3>
            <p class="text-sm text-[#192837]/60 leading-relaxed">{{ pain.desc }}</p>
          </div>
        }
      </div>
    </section>

    <!-- ===== USE CASES / SOLUTIONS GRID ===== -->
    <section id="use-cases" class="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 py-[clamp(48px,8vw,80px)]">
      <div class="text-center max-w-[640px] mx-auto mb-12">
        <span class="text-sm font-semibold text-[#7342E2] uppercase tracking-widest">AI Agents</span>
        <h2 class="font-heading font-extrabold text-[#192837] text-[clamp(1.5rem,4vw,2.4rem)] mt-3 leading-tight">
          Your MSME Back-Office in a Box
        </h2>
        <p class="text-[#192837]/70 mt-3 text-[clamp(0.9rem,2vw,1.05rem)] leading-relaxed">
          Six powerful AI agents working 24/7 — speaking Hindi, English, and 10 more Indian languages.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        @for (useCase of useCases; track useCase.title) {
          <div class="group relative rounded-2xl bg-white border border-[#192837]/8 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <!-- Top accent bar -->
            <div class="h-1 w-full bg-gradient-to-r from-[#7342E2] to-[#A78BFA]"></div>
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-[#7342E2]/10 flex items-center justify-center group-hover:bg-[#7342E2] transition-colors">
                  <svg class="w-6 h-6 text-[#7342E2] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" [attr.d]="useCase.icon"/>
                  </svg>
                </div>
                <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-[#7342E2]/10 text-[#7342E2]">{{ useCase.tag }}</span>
              </div>
              <h3 class="font-semibold text-[#192837] text-lg mb-2">{{ useCase.title }}</h3>
              <p class="text-sm text-[#192837]/65 leading-relaxed mb-4">{{ useCase.desc }}</p>
              <div class="flex items-center gap-2 text-xs font-medium text-[#7342E2]">
                <span>{{ useCase.stat }}</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- ===== HOW IT WORKS ===== -->
    <section id="how-it-works" class="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 py-[clamp(48px,8vw,80px)]">
      <div class="text-center max-w-[640px] mx-auto mb-14">
        <span class="text-sm font-semibold text-[#7342E2] uppercase tracking-widest">Simple Setup</span>
        <h2 class="font-heading font-extrabold text-[#192837] text-[clamp(1.5rem,4vw,2.4rem)] mt-3 leading-tight">
          Chalu Karein Bas 5 Minute Mein
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
        <!-- connector line -->
        <div class="hidden sm:block absolute top-[28px] left-[16%] right-[16%] h-[2px] bg-[#7342E2]/15"></div>

        @for (step of steps; track step.num; let i = $index) {
          <div class="relative flex flex-col items-center text-center">
            <div class="relative z-10 w-14 h-14 rounded-full bg-[#7342E2] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-[#7342E2]/25 mb-5">
              {{ step.num }}
            </div>
            <h3 class="font-semibold text-[#192837] text-lg mb-2">{{ step.title }}</h3>
            <p class="text-sm text-[#192837]/60 leading-relaxed max-w-[260px]">{{ step.desc }}</p>
          </div>
        }
      </div>
    </section>

    <!-- ===== TESTIMONIALS ===== -->
    <section class="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 py-[clamp(48px,8vw,80px)]">
      <div class="text-center max-w-[640px] mx-auto mb-12">
        <span class="text-sm font-semibold text-[#7342E2] uppercase tracking-widest">Success Stories</span>
        <h2 class="font-heading font-extrabold text-[#192837] text-[clamp(1.5rem,4vw,2.4rem)] mt-3 leading-tight">
          Dukaan Walon Ki Zubaani
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        @for (t of testimonials; track t.name) {
          <div class="rounded-2xl bg-white border border-[#192837]/8 p-6 flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <div class="flex items-center gap-1 mb-4">
                @for (star of [1,2,3,4,5]; track star) {
                  <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                }
              </div>
              <p class="text-[#192837]/80 text-sm leading-relaxed italic mb-4">"{{ t.quote }}"</p>
            </div>
            <div class="flex items-center gap-3 pt-4 border-t border-[#192837]/8">
              <div class="w-9 h-9 rounded-full bg-[#7342E2]/15 flex items-center justify-center text-[#7342E2] font-bold text-xs">
                {{ t.initials }}
              </div>
              <div>
                <p class="text-sm font-semibold text-[#192837]">{{ t.name }}</p>
                <p class="text-xs text-[#192837]/50">{{ t.biz }}</p>
              </div>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- ===== PRICING / CTA STRIP ===== -->
    <section id="pricing" class="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 py-[clamp(48px,8vw,80px)]">
      <div class="relative rounded-3xl bg-[#192837] overflow-hidden px-6 sm:px-12 py-[clamp(40px,6vw,64px)] text-center">
        <!-- Decorative blobs -->
        <div class="absolute top-0 right-0 w-72 h-72 bg-[#7342E2] rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-[#7342E2] rounded-full blur-[100px] opacity-15 translate-y-1/2 -translate-x-1/3"></div>

        <div class="relative z-10 max-w-[560px] mx-auto">
          <h2 class="font-heading font-extrabold text-white text-[clamp(1.5rem,4vw,2.2rem)] leading-tight">
            Abhi Start Karein — 100% Free For Lifetime!
          </h2>
          <p class="text-white/60 mt-3 text-[clamp(0.9rem,2vw,1.05rem)] leading-relaxed">
            No credit card needed. Setup in under 2 minutes. 100% Free for MSMEs and Kirana stores. Join 10,000+ Bharatiya vyapaari already saving 10+ hours every week.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <button
              (click)="navigate(authService.isAuthenticated() ? '/dashboard' : '/signup')"
              class="min-w-[200px] bg-[#7342E2] text-white font-semibold px-7 py-4 rounded-full shadow-lg shadow-[#7342E2]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>{{ authService.isAuthenticated() ? 'Go to Dashboard' : 'Start Your Free Journey' }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </button>
            <button
              (click)="scrollTo('use-cases')"
              class="min-w-[200px] bg-white/10 text-white font-semibold px-7 py-4 rounded-full border border-white/20 hover:bg-white/20 active:scale-95 transition-all"
            >
              Explore Solutions
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FAQ ===== -->
    <section id="support" class="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 py-[clamp(48px,8vw,80px)]">
      <div class="max-w-[720px] mx-auto">
        <div class="text-center mb-10">
          <span class="text-sm font-semibold text-[#7342E2] uppercase tracking-widest">FAQ</span>
          <h2 class="font-heading font-extrabold text-[#192837] text-[clamp(1.5rem,4vw,2.2rem)] mt-3">
            Common Questions
          </h2>
        </div>

        <div class="space-y-3">
          @for (faq of faqs; track faq.q; let i = $index) {
            <div class="rounded-xl bg-white border border-[#192837]/8 overflow-hidden">
              <button
                (click)="toggleFaq(i)"
                class="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F8F9FA] transition-colors"
              >
                <span class="font-medium text-[#192837] text-sm sm:text-base pr-4">{{ faq.q }}</span>
                <svg
                  class="w-5 h-5 text-[#7342E2] flex-shrink-0 transition-transform"
                  [class.rotate-180]="openFaq() === i"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              @if (openFaq() === i) {
                <div class="px-5 pb-4 text-sm text-[#192837]/65 leading-relaxed border-t border-[#192837]/6 pt-3">
                  {{ faq.a }}
                </div>
              }
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="relative z-10 border-t border-[#192837]/8 mt-8">
      <div class="max-w-[1280px] mx-auto px-5 sm:px-8 py-10">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 256 256" fill="none" class="w-7 h-7">
              <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" fill="#192837"/>
            </svg>
            <span class="font-heading font-extrabold text-lg text-[#192837]">Vyapar<span class="text-[#7342E2]">Sathi</span></span>
          </div>
          <p class="text-xs text-[#192837]/40 text-center">
            Made with ❤️ for Bharat's MSMEs &middot; GSTN Integrated &middot; NPCI Compliant
          </p>
          <div class="flex items-center gap-5 text-sm text-[#192837]/60">
            <a href="#" class="hover:text-[#7342E2] transition-colors">Privacy</a>
            <a href="#" class="hover:text-[#7342E2] transition-colors">Terms</a>
            <a href="#" class="hover:text-[#7342E2] transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class LandingComponent {
  openFaqIndex = -1;

  constructor(public authService: AuthService, private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  openFaq(): number {
    return this.openFaqIndex;
  }

  toggleFaq(i: number) {
    this.openFaqIndex = this.openFaqIndex === i ? -1 : i;
  }

  painPoints = [
    {
      title: 'GST Late Fees',
      desc: 'Missing filing deadlines costs ₹10,000+ per month in penalties. No reminders, no tracking.',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: 'Inventory Blackouts',
      desc: 'Running out of stock unexpectedly or overstocking dead inventory — both bleed money.',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    },
    {
      title: 'UPI Reconciliation Chaos',
      desc: 'Matching UPI payments from GPay, PhonePe, Paytm against invoices manually every night.',
      icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    },
    {
      title: 'Ghosted D2C Customers',
      desc: 'No follow-ups, no bilingual support. Potential buyers drop off because replies come too late.',
      icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    },
    {
      title: 'Messy Invoicing',
      desc: 'Handwritten bills, no GST numbers, lost records. Accountants charge extra to clean up the mess.',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    },
    {
      title: 'No Business Insights',
      desc: 'No clue which products are profitable, which customers owe money, or where cash is leaking.',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    },
  ];

  useCases = [
    {
      title: 'WhatsApp Invoicing',
      desc: 'Generate GST-compliant invoices directly inside WhatsApp. Share with customers in one tap. No app download needed.',
      icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
      tag: 'Retail',
      stat: 'Used by 4,200+ kirana stores',
    },
    {
      title: 'GST Reminder Agent',
      desc: 'Never miss a deadline. Auto-calculates GSTR-1, GSTR-3B due dates and pings you on WhatsApp 3 days before.',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      tag: 'Compliance',
      stat: 'Zero late fees for active users',
    },
    {
      title: 'Inventory + Reorder Agent',
      desc: 'Tracks stock levels in real-time. Auto-creates purchase orders when inventory dips below your safety threshold.',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      tag: 'Operations',
      stat: '30% less stockouts on average',
    },
    {
      title: 'Bilingual D2C Support',
      desc: 'AI chatbot that replies in Hindi, English, Tamil, Telugu, Marathi & more. Handles order tracking, returns, and upsells 24/7.',
      icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129',
      tag: 'Sales',
      stat: 'Supports 12 Indian languages',
    },
    {
      title: 'UPI Reconciliation',
      desc: 'Auto-matches UPI transactions from GPay, PhonePe, Paytm, and bank statements against your invoices every hour.',
      icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
      tag: 'Finance',
      stat: 'Saves 8 hrs/week on reconciliation',
    },
    {
      title: 'MSME Back-Office in a Box',
      desc: 'One dashboard for invoices, inventory, GST, sales reports, and customer CRM. Built for non-tech business owners.',
      icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
      tag: 'All-in-One',
      stat: 'Everything in one place',
    },
  ];

  steps = [
    {
      num: 1,
      title: 'Sign Up with Phone',
      desc: 'Enter your mobile number. Verify with OTP. No email, no passwords to remember.',
    },
    {
      num: 2,
      title: 'Connect Your Business',
      desc: 'Add GSTIN, link UPI IDs, and connect your WhatsApp Business account in 2 minutes.',
    },
    {
      num: 3,
      title: 'AI Agents Go Live',
      desc: 'Your agents start working instantly. Invoices, reminders, inventory — all on autopilot.',
    },
  ];

  testimonials = [
    {
      quote: 'Pehle GST late fees har mahine ₹12,000+ jaate the. Ab VyaparSathi ka reminder aata hai WhatsApp pe — bilkul time par. Bahut fayda hua.',
      name: 'Ramesh Gupta',
      initials: 'RG',
      biz: 'Gupta Kirana & General Store, Jaipur',
    },
    {
      quote: 'UPI reconciliation was my nightly headache. PhonePe, GPay, cash — sab alag. Ab subah utho toh sab match hua hota hai. Magic hai yeh.',
      name: 'Priya Sharma',
      initials: 'PS',
      biz: 'Sharma Electronics, Delhi',
    },
    {
      quote: 'My D2C customers used to ghost me because I replied in English only. Ab Hindi mein baat hoti hai, orders double ho gaye.',
      name: 'Arjun Patel',
      initials: 'AP',
      biz: 'Patel Handlooms, Surat',
    },
  ];

  faqs = [
    {
      q: 'Kya yeh small kirana store ke liye bhi kaam karega?',
      a: 'Bilkul! VyaparSathi AI specifically chhote dukaan walon ke liye bana hai. Bas phone number se sign up karein, GSTIN optional hai for unregistered businesses.',
    },
    {
      q: 'Kya mera data safe hai?',
      a: 'Absolutely. We are ISO 27001 compliant, use bank-grade AES-256 encryption, and your data never leaves Indian servers. NPCI and GSTN integrations are fully certified.',
    },
    {
      q: 'Free trial ke baad kitna charge hota hai?',
      a: 'Pehle 30 din completely free — no credit card needed. Uske baad plans start at ₹499/month for small businesses. Enterprise pricing available for chains and distributors.',
    },
    {
      q: 'Kya WhatsApp Business account chahiye hoga?',
      a: 'Haan, WhatsApp Business API integration ke liye aapka WhatsApp Business account hona zaroori hai. Agar nahi hai, toh setup flow mein 2 minute mein bana sakte hain.',
    },
    {
      q: 'Kya yeh Tally ya Zoho se integrate hota hai?',
      a: 'Currently we support Excel/CSV import-export for Tally migration. Native Tally and Zoho integrations are in beta and launching next quarter.',
    },
  ];
}
