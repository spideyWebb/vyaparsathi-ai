import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-gst',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-heading font-extrabold text-[#192837]">GST Returns & Compliance</h2>
          <p class="text-xs text-slate-500">Calculate tax liability, claim ITC, and file GSTR-1 / 3B</p>
        </div>
        <div class="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl">
          <span class="text-xs font-black text-emerald-800">100% Compliance Score</span>
        </div>
      </div>

      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 class="text-lg font-bold text-[#192837]">Estimated Tax Liability (Calculated from DB Invoices)</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span class="text-[11px] font-bold text-slate-400">CGST (Central Tax)</span>
            <div class="text-lg font-extrabold text-slate-900 mt-1">₹{{ cgst() }}</div>
          </div>
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span class="text-[11px] font-bold text-slate-400">SGST (State Tax)</span>
            <div class="text-lg font-extrabold text-slate-900 mt-1">₹{{ sgst() }}</div>
          </div>
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span class="text-[11px] font-bold text-slate-400">IGST (Integrated Tax)</span>
            <div class="text-lg font-extrabold text-slate-900 mt-1">₹0</div>
          </div>
          <div class="bg-[#7342E2]/10 p-4 rounded-2xl border border-[#7342E2]/20">
            <span class="text-[11px] font-bold text-[#7342E2]">Net Tax Payable</span>
            <div class="text-lg font-extrabold text-[#7342E2] mt-1">₹{{ netPayable() }}</div>
          </div>
        </div>

        @if (netPayable() > 0) {
          <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-900 font-bold">
            <span>GST Tax liability calculated from {{ invoicesCount() }} invoices saved in database.</span>
            <button class="bg-emerald-600 text-white px-3 py-1.5 rounded-xl hover:bg-emerald-700">File GSTR-1</button>
          </div>
        } @else {
          <div class="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 font-medium">
            No GST tax liabilities pending for this period. Create invoices to calculate tax liability.
          </div>
        }
      </div>
    </div>
  `,
})
export class GstComponent implements OnInit {
  cgst = signal<number>(0);
  sgst = signal<number>(0);
  netPayable = signal<number>(0);
  invoicesCount = signal<number>(0);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadGstData();
  }

  async loadGstData(): Promise<void> {
    try {
      const base = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:8081/api/v1'
        : 'https://vyaparsathi-api.onrender.com/api/v1';
      const res: any = await firstValueFrom(
        this.http.get<any>(`${base}/sales/invoices`)
      );
      if (res && res.success && Array.isArray(res.data)) {
        const invoices = res.data;
        const totalTax = invoices.reduce((acc: number, inv: any) => acc + (inv.taxAmount || 0), 0);
        const half = Math.round(totalTax / 2);
        this.cgst.set(half);
        this.sgst.set(half);
        this.netPayable.set(totalTax);
        this.invoicesCount.set(invoices.length);
      }
    } catch (err) {
      console.warn('GST DB load error:', err);
    }
  }
}
