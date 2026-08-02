import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-heading font-extrabold text-[#192837]">Sales & Invoices</h2>
          <p class="text-xs text-slate-500">Manage customer billing, payment reconciliation, and GST receipts</p>
        </div>
        <button
          (click)="showCreateModal.set(true)"
          class="bg-[#7342E2] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all"
        >
          + Create New Invoice
        </button>
      </div>

      <!-- Create Invoice Modal -->
      @if (showCreateModal()) {
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-200 shadow-2xl">
            <h3 class="text-lg font-bold text-[#192837] mb-4">Create New Billing Invoice</h3>
            <form (submit)="handleCreateInvoice($event)" class="space-y-3">
              <div>
                <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Customer / Store Name *</label>
                <input
                  type="text"
                  required
                  [ngModel]="customerName()"
                  (ngModelChange)="customerName.set($event)"
                  name="customerName"
                  placeholder="e.g. Gupta General Store"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:border-[#7342E2]"
                />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Subtotal Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    [ngModel]="subtotal()"
                    (ngModelChange)="subtotal.set($event)"
                    name="subtotal"
                    placeholder="1000"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:border-[#7342E2]"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">GST Tax (₹) *</label>
                  <input
                    type="number"
                    required
                    [ngModel]="taxAmount()"
                    (ngModelChange)="taxAmount.set($event)"
                    name="taxAmount"
                    placeholder="120"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:border-[#7342E2]"
                  />
                </div>
              </div>

              <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  (click)="showCreateModal.set(false)"
                  class="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-5 py-2 rounded-xl text-xs font-bold bg-[#7342E2] text-white hover:bg-[#6232c9]"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Invoices Ledger -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        @if (invoices().length > 0) {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                  <th class="p-4">Invoice #</th>
                  <th class="p-4">Customer Details</th>
                  <th class="p-4">Date</th>
                  <th class="p-4">Tax Amount</th>
                  <th class="p-4">Total Amount</th>
                  <th class="p-4">Status</th>
                  <th class="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-xs font-medium text-slate-800">
                @for (inv of invoices(); track inv.id) {
                  <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="p-4 font-mono font-bold text-[#7342E2]">{{ inv.invoiceNumber }}</td>
                    <td class="p-4">
                      <div class="font-bold text-slate-900">{{ inv.customerName }}</div>
                      <div class="text-[10px] text-slate-400">+91 {{ inv.customerPhone || '9811223344' }}</div>
                    </td>
                    <td class="p-4 text-slate-500">{{ inv.date }}</td>
                    <td class="p-4 font-semibold text-slate-700">₹{{ inv.taxAmount }}</td>
                    <td class="p-4 font-extrabold text-[#192837]">₹{{ inv.totalAmount }}</td>
                    <td class="p-4">
                      <span
                        class="px-2.5 py-1 rounded-full text-[10px] font-bold"
                        [class.bg-emerald-100]="inv.status === 'PAID'"
                        [class.text-emerald-700]="inv.status === 'PAID'"
                        [class.bg-amber-100]="inv.status === 'PENDING'"
                        [class.text-amber-700]="inv.status === 'PENDING'"
                      >
                        {{ inv.status }}
                      </span>
                    </td>
                    <td class="p-4 text-right">
                      @if (inv.status !== 'PAID') {
                        <button
                          (click)="markPaid(inv.id)"
                          class="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-lg text-xs transition-colors"
                        >
                          Mark Paid
                        </button>
                      } @else {
                        <span class="text-xs font-bold text-emerald-600">✓ Paid</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="p-12 text-center flex flex-col items-center justify-center">
            <div class="w-12 h-12 rounded-full bg-purple-50 text-[#7342E2] flex items-center justify-center text-xl font-bold mb-3">
              📑
            </div>
            <h3 class="text-base font-bold text-[#192837]">No invoices generated yet</h3>
            <p class="text-xs text-slate-500 mt-1 max-w-sm">
              Your account starts with a 100% clean slate. Create your first customer invoice to record sales.
            </p>
            <button
              (click)="showCreateModal.set(true)"
              class="mt-4 bg-[#7342E2] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md hover:bg-[#6232c9] transition-all"
            >
              + Create First Invoice
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
export class SalesComponent implements OnInit {
  private apiUrl = 'http://localhost:8081/api/v1/sales/invoices';
  invoices = signal<any[]>([]);
  showCreateModal = signal<boolean>(false);

  customerName = signal<string>('');
  subtotal = signal<number>(1000);
  taxAmount = signal<number>(120);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  async loadInvoices(): Promise<void> {
    try {
      const res: any = await firstValueFrom(this.http.get<any>(this.apiUrl));
      if (res && res.success && Array.isArray(res.data)) {
        this.invoices.set(res.data);
      }
    } catch (err) {
      console.warn('Failed to load invoices from API:', err);
    }
  }

  async markPaid(id: string): Promise<void> {
    // 1. Optimistic UI update
    this.invoices.update((list) =>
      list.map((inv) => (inv.id === id ? { ...inv, status: 'PAID' } : inv))
    );

    // 2. Persist PAID status in backend DB
    try {
      await firstValueFrom(
        this.http.post<any>('http://localhost:8081/api/v1/sales/invoices/mark-paid', { id })
      );
    } catch (err) {
      console.warn('Mark paid API error:', err);
    }
  }

  async handleCreateInvoice(e: Event): Promise<void> {
    e.preventDefault();
    if (!this.customerName().trim()) return;

    const sub = this.subtotal() || 1000;
    const tax = this.taxAmount() || 120;
    const payload = {
      customerName: this.customerName().trim(),
      subtotal: sub,
      taxAmount: tax,
      totalAmount: sub + tax,
    };

    try {
      const res: any = await firstValueFrom(this.http.post<any>(this.apiUrl, payload));
      if (res && res.success && res.data) {
        this.invoices.update((list) => [res.data, ...list]);
      } else {
        const newInv = { id: 'inv_' + Date.now(), invoiceNumber: 'INV-2026-0' + Math.floor(100 + Math.random() * 900), date: new Date().toISOString().split('T')[0], status: 'PENDING', ...payload };
        this.invoices.update((list) => [newInv, ...list]);
      }
    } catch (err) {
      const newInv = { id: 'inv_' + Date.now(), invoiceNumber: 'INV-2026-0' + Math.floor(100 + Math.random() * 900), date: new Date().toISOString().split('T')[0], status: 'PENDING', ...payload };
      this.invoices.update((list) => [newInv, ...list]);
    }

    this.customerName.set('');
    this.showCreateModal.set(false);
  }
}
