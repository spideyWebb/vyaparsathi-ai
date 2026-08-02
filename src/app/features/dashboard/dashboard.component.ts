import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Welcome Banner -->
      <div class="bg-gradient-to-r from-[#192837] via-[#24374a] to-[#7342E2] rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-bold uppercase tracking-wider text-amber-300">
              ✨ Store Overview
            </span>
          </div>
          <h2 class="text-2xl font-heading font-extrabold tracking-tight">
            Welcome, {{ authService.user()?.businessName || 'Store Owner' }}!
          </h2>
          <p class="text-xs text-slate-300 mt-1 max-w-xl">
            Your store database is synced. Add products to inventory or create invoices to view real-time metrics and AI insights.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            (click)="navigate('/sales')"
            class="bg-[#7342E2] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:shadow-lg active:scale-95 transition-all"
          >
            + New Invoice
          </button>
          <button
            (click)="navigate('/inventory')"
            class="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
          >
            + Add Stock
          </button>
        </div>
      </div>

      <!-- KPI Stat Cards (Calculated Dynamically from User's Account Database) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Sales</span>
            <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Live DB</span>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <h3 class="text-2xl font-extrabold text-[#192837] tracking-tight">₹{{ totalSales() }}</h3>
          </div>
          <p class="text-xs text-slate-500 mt-1">{{ totalInvoicesCount() }} invoices recorded</p>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Low Stock Items</span>
            <span
              class="text-xs font-bold px-2 py-0.5 rounded-full"
              [class.bg-emerald-100]="lowStockCount() === 0"
              [class.text-emerald-700]="lowStockCount() === 0"
              [class.bg-rose-100]="lowStockCount() > 0"
              [class.text-rose-700]="lowStockCount() > 0"
            >
              {{ lowStockCount() === 0 ? 'OK' : 'Alert' }}
            </span>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <h3 class="text-2xl font-extrabold text-[#192837] tracking-tight">{{ lowStockCount() }} Products</h3>
          </div>
          <p class="text-xs text-slate-500 mt-1">Out of {{ totalProductsCount() }} total items</p>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Net Profit (P&L)</span>
            <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-[#7342E2]/10 text-[#7342E2]">Calculated</span>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <h3 class="text-2xl font-extrabold text-[#192837] tracking-tight">₹{{ netProfit() }}</h3>
          </div>
          <p class="text-xs text-slate-500 mt-1">Gross Sales - ₹{{ totalExpenses() }} expenses</p>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Net GST Payable</span>
            <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">Tax Liability</span>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <h3 class="text-2xl font-extrabold text-[#192837] tracking-tight">₹{{ totalGst() }}</h3>
          </div>
          <p class="text-xs text-slate-500 mt-1">Tax collected from invoices</p>
        </div>
      </div>

      <!-- Chart & AI Insights Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Cash Flow Summary -->
        <div class="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-[#192837]">Store Transactions Summary</h3>
              <p class="text-xs text-slate-500">Live Cash Inflow vs Outflow tracking from database</p>
            </div>
          </div>
          
          @if (totalInvoicesCount() > 0 || totalExpenses() > 0) {
            <div class="space-y-4 pt-2">
              <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <span class="text-xs font-bold text-emerald-800 uppercase">Total Sales Inflow</span>
                  <h4 class="text-xl font-extrabold text-emerald-900 mt-0.5">₹{{ totalSales() }}</h4>
                </div>
                <span class="text-2xl">💰</span>
              </div>
              <div class="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-between">
                <div>
                  <span class="text-xs font-bold text-rose-800 uppercase">Total Operating Outflow</span>
                  <h4 class="text-xl font-extrabold text-rose-900 mt-0.5">₹{{ totalExpenses() }}</h4>
                </div>
                <span class="text-2xl">💸</span>
              </div>
            </div>
          } @else {
            <div class="relative w-full h-48 pt-4 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <span class="text-2xl mb-1">📈</span>
              <p class="text-xs font-bold text-slate-700">No Sales Transactions Recorded</p>
              <p class="text-[11px] text-slate-400 mt-0.5">Create invoices to visualize cash flow trends</p>
            </div>
          }
        </div>

        <!-- AI Insights Feed -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 class="text-base font-bold text-[#192837] mb-3">AI Business Insights</h3>
            <div class="space-y-3">
              @if (lowStockCount() > 0) {
                <div (click)="navigate('/inventory')" class="p-3.5 rounded-xl border border-rose-100 bg-rose-50 hover:bg-rose-100/60 transition-all cursor-pointer">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-rose-200 text-rose-800">Inventory Alert</span>
                    <span class="text-[10px] font-bold text-rose-700">High Priority</span>
                  </div>
                  <h4 class="text-xs font-bold text-rose-900 mt-1">Reorder Required for {{ lowStockCount() }} Products</h4>
                  <p class="text-[11px] text-rose-700 mt-1">Stock levels dropped below minimum threshold in database.</p>
                </div>
              }

              @if (totalSales() > 0) {
                <div (click)="navigate('/sales')" class="p-3.5 rounded-xl border border-purple-100 bg-purple-50 hover:bg-purple-100/60 transition-all cursor-pointer">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-200 text-purple-800">Sales Trend</span>
                    <span class="text-[10px] font-bold text-purple-700">Positive</span>
                  </div>
                  <h4 class="text-xs font-bold text-purple-900 mt-1">Total ₹{{ totalSales() }} Revenue Generated</h4>
                  <p class="text-[11px] text-purple-700 mt-1">Database registered {{ totalInvoicesCount() }} invoices successfully.</p>
                </div>
              }

              @if (lowStockCount() === 0 && totalSales() === 0) {
                <div class="p-6 border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl text-center">
                  <span class="text-xl">🤖</span>
                  <h4 class="text-xs font-bold text-slate-800 mt-1">No AI Insights Yet</h4>
                  <p class="text-[11px] text-slate-500 mt-1">
                    Add inventory items or create invoices to receive intelligent AI business recommendations.
                  </p>
                </div>
              }
            </div>
          </div>
          <button
            (click)="navigate('/ai-chat')"
            class="w-full mt-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
          >
            Ask AI Copilot
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  totalSales = signal<number>(0);
  totalInvoicesCount = signal<number>(0);
  totalProductsCount = signal<number>(0);
  lowStockCount = signal<number>(0);
  totalExpenses = signal<number>(0);
  netProfit = signal<number>(0);
  totalGst = signal<number>(0);

  constructor(
    public authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  async loadDashboardData(): Promise<void> {
    try {
      const base = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:8081/api/v1'
        : 'https://vyaparsathi-api.onrender.com/api/v1';
      // Parallel API calls to fetch user's database records
      const [prodRes, invRes, expRes]: any = await Promise.all([
        firstValueFrom(this.http.get<any>(`${base}/inventory/products`)).catch(() => null),
        firstValueFrom(this.http.get<any>(`${base}/sales/invoices`)).catch(() => null),
        firstValueFrom(this.http.get<any>(`${base}/finance/expenses`)).catch(() => null),
      ]);

      const products = (prodRes && prodRes.data) || [];
      const invoices = (invRes && invRes.data) || [];
      const expenses = (expRes && expRes.data) || [];

      // Compute stats dynamically from database rows
      const salesSum = invoices.reduce((acc: number, inv: any) => acc + (inv.totalAmount || 0), 0);
      const gstSum = invoices.reduce((acc: number, inv: any) => acc + (inv.taxAmount || 0), 0);
      const expSum = expenses.reduce((acc: number, exp: any) => acc + (exp.amount || 0), 0);
      const lowStock = products.filter((p: any) => (p.stock || 0) <= (p.minStock || 5)).length;

      this.totalSales.set(salesSum);
      this.totalInvoicesCount.set(invoices.length);
      this.totalProductsCount.set(products.length);
      this.lowStockCount.set(lowStock);
      this.totalExpenses.set(expSum);
      this.netProfit.set(salesSum - expSum);
      this.totalGst.set(gstSum);
    } catch (err) {
      console.warn('Dashboard DB load error:', err);
    }
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
