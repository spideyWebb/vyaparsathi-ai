import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-xl font-heading font-extrabold text-[#192837]">Finance & P&L Statement</h2>
          <p class="text-xs text-slate-500">Operating margins, expenses, and net cash balance</p>
        </div>
        <button
          (click)="showExpenseModal.set(true)"
          class="bg-[#7342E2] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all"
        >
          + Log Expense
        </button>
      </div>

      <!-- Log Expense Modal -->
      @if (showExpenseModal()) {
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-200 shadow-2xl">
            <h3 class="text-lg font-bold text-[#192837] mb-4">Log Operating Expense</h3>
            <form (submit)="handleAddExpense($event)" class="space-y-3">
              <div>
                <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  [ngModel]="expDesc()"
                  (ngModelChange)="expDesc.set($event)"
                  name="expDesc"
                  placeholder="e.g. Shop Rent / Electricity"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:border-[#7342E2]"
                />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    [ngModel]="expAmount()"
                    (ngModelChange)="expAmount.set($event)"
                    name="expAmount"
                    placeholder="1500"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:border-[#7342E2]"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Category</label>
                  <input
                    type="text"
                    [ngModel]="expCategory()"
                    (ngModelChange)="expCategory.set($event)"
                    name="expCategory"
                    placeholder="Rent / Utilities"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:border-[#7342E2]"
                  />
                </div>
              </div>

              <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  (click)="showExpenseModal.set(false)"
                  class="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-5 py-2 rounded-xl text-xs font-bold bg-[#7342E2] text-white hover:bg-[#6232c9]"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span class="text-xs font-extrabold uppercase text-slate-400">Gross Sales</span>
          <h3 class="text-2xl font-extrabold text-[#192837] mt-3">₹{{ grossSales() }}</h3>
          <p class="text-[11px] text-slate-500 mt-1">COGS: ₹0</p>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span class="text-xs font-extrabold uppercase text-slate-400">Operating Expenses</span>
          <h3 class="text-2xl font-extrabold text-[#192837] mt-3">₹{{ totalExpenses() }}</h3>
          <p class="text-[11px] text-slate-500 mt-1">{{ expenses().length }} logged expense entries</p>
        </div>
        <div class="bg-gradient-to-br from-[#7342E2] to-[#5b2ec6] p-5 rounded-2xl text-white shadow-lg">
          <span class="text-xs font-extrabold uppercase text-purple-200">Net Profit</span>
          <h3 class="text-3xl font-extrabold mt-3">₹{{ netProfit() }}</h3>
          <p class="text-xs text-purple-100 mt-1">0.00% Profit Margin</p>
        </div>
      </div>

      <!-- Expense List -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 class="text-base font-bold text-[#192837] mb-3">Logged Expenses</h3>
        @if (expenses().length > 0) {
          <div class="divide-y divide-slate-100">
            @for (e of expenses(); track e.id) {
              <div class="py-3 flex items-center justify-between">
                <div>
                  <h4 class="text-xs font-bold text-slate-900">{{ e.description }}</h4>
                  <span class="text-[10px] text-slate-400 font-semibold">{{ e.category }} • {{ e.date }}</span>
                </div>
                <span class="text-sm font-extrabold text-rose-600">- ₹{{ e.amount }}</span>
              </div>
            }
          </div>
        } @else {
          <div class="p-8 text-center text-xs text-slate-400 font-medium">
            No operating expenses logged yet. Click "+ Log Expense" to add entries.
          </div>
        }
      </div>
    </div>
  `,
})
export class FinanceComponent implements OnInit {
  private get apiUrl(): string {
    const base = typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:8081/api/v1'
      : 'https://vyaparsathi-api.onrender.com/api/v1';
    return `${base}/finance/expenses`;
  }
  expenses = signal<any[]>([]);
  grossSales = signal<number>(0);
  showExpenseModal = signal<boolean>(false);

  expDesc = signal<string>('');
  expAmount = signal<number>(1000);
  expCategory = signal<string>('Utilities');

  totalExpenses = computed(() =>
    this.expenses().reduce((sum, item) => sum + item.amount, 0)
  );

  netProfit = computed(() => this.grossSales() - this.totalExpenses());

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  async loadExpenses(): Promise<void> {
    try {
      const res: any = await firstValueFrom(this.http.get<any>(this.apiUrl));
      if (res && res.success && Array.isArray(res.data)) {
        this.expenses.set(res.data);
      }
    } catch (err) {
      console.warn('Failed to load expenses from API:', err);
    }
  }

  async handleAddExpense(e: Event): Promise<void> {
    e.preventDefault();
    if (!this.expDesc().trim()) return;

    const payload = {
      description: this.expDesc().trim(),
      category: this.expCategory().trim() || 'General',
      amount: this.expAmount() || 1000,
    };

    try {
      const res: any = await firstValueFrom(this.http.post<any>(this.apiUrl, payload));
      if (res && res.success && res.data) {
        this.expenses.update((list) => [res.data, ...list]);
      } else {
        const newExp = { id: 'exp_' + Date.now(), date: new Date().toISOString().split('T')[0], ...payload };
        this.expenses.update((list) => [newExp, ...list]);
      }
    } catch (err) {
      const newExp = { id: 'exp_' + Date.now(), date: new Date().toISOString().split('T')[0], ...payload };
      this.expenses.update((list) => [newExp, ...list]);
    }

    this.expDesc.set('');
    this.showExpenseModal.set(false);
  }
}
