import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-xl font-heading font-extrabold text-[#192837]">Product Inventory</h2>
          <p class="text-xs text-slate-500">Track stock levels, prices, and automated reorder alerts</p>
        </div>
        <button
          (click)="showAddModal.set(true)"
          class="bg-[#7342E2] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all"
        >
          + Add New Product
        </button>
      </div>

      <!-- Add Product Modal -->
      @if (showAddModal()) {
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-200 shadow-2xl">
            <h3 class="text-lg font-bold text-[#192837] mb-4">Add New Item to Stock</h3>
            <form (submit)="handleAddProduct($event)" class="space-y-3">
              <div>
                <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  [ngModel]="newName()"
                  (ngModelChange)="newName.set($event)"
                  name="newName"
                  placeholder="e.g. Basmati Rice 5kg"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:border-[#7342E2]"
                />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    [ngModel]="newPrice()"
                    (ngModelChange)="newPrice.set($event)"
                    name="newPrice"
                    placeholder="480"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:border-[#7342E2]"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Initial Stock *</label>
                  <input
                    type="number"
                    required
                    [ngModel]="newStock()"
                    (ngModelChange)="newStock.set($event)"
                    name="newStock"
                    placeholder="25"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:border-[#7342E2]"
                  />
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Category</label>
                <input
                  type="text"
                  [ngModel]="newCategory()"
                  (ngModelChange)="newCategory.set($event)"
                  name="newCategory"
                  placeholder="Grocery / Dairy"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:border-[#7342E2]"
                />
              </div>

              <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  (click)="showAddModal.set(false)"
                  class="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-5 py-2 rounded-xl text-xs font-bold bg-[#7342E2] text-white hover:bg-[#6232c9]"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Inventory Data Table -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        @if (products().length > 0) {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                  <th class="p-4">Product Name / SKU</th>
                  <th class="p-4">Category</th>
                  <th class="p-4">Sale Price</th>
                  <th class="p-4">GST Rate</th>
                  <th class="p-4">Stock Status</th>
                  <th class="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-xs font-medium text-slate-800">
                @for (p of products(); track p.id) {
                  <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="p-4">
                      <div class="font-bold text-slate-900">{{ p.name }}</div>
                      <div class="text-[10px] text-slate-400 font-mono">{{ p.sku }}</div>
                    </td>
                    <td class="p-4">
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {{ p.category }}
                      </span>
                    </td>
                    <td class="p-4 font-bold text-[#192837]">₹{{ p.price }} / {{ p.unit }}</td>
                    <td class="p-4 text-slate-600 font-bold">{{ p.gstRate }}%</td>
                    <td class="p-4">
                      <span
                        class="px-2.5 py-1 rounded-full text-[11px] font-bold"
                        [class.bg-rose-100]="p.stock <= p.minStock"
                        [class.text-rose-700]="p.stock <= p.minStock"
                        [class.bg-emerald-100]="p.stock > p.minStock"
                        [class.text-emerald-700]="p.stock > p.minStock"
                      >
                        {{ p.stock }} {{ p.unit }}s
                      </span>
                    </td>
                    <td class="p-4 text-right">
                      <button
                        (click)="addStock(p.id)"
                        class="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-lg text-xs transition-colors"
                      >
                        +5 Stock
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="p-12 text-center flex flex-col items-center justify-center">
            <div class="w-12 h-12 rounded-full bg-purple-50 text-[#7342E2] flex items-center justify-center text-xl font-bold mb-3">
              📦
            </div>
            <h3 class="text-base font-bold text-[#192837]">No products in your inventory yet</h3>
            <p class="text-xs text-slate-500 mt-1 max-w-sm">
              Your account starts with a 100% clean slate. Add your first item to begin tracking stock and invoices.
            </p>
            <button
              (click)="showAddModal.set(true)"
              class="mt-4 bg-[#7342E2] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md hover:bg-[#6232c9] transition-all"
            >
              + Add First Product
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
export class InventoryComponent implements OnInit {
  private get apiUrl(): string {
    const base = typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:8081/api/v1'
      : 'https://vyaparsathi-api.onrender.com/api/v1';
    return `${base}/inventory/products`;
  }
  products = signal<any[]>([]);
  showAddModal = signal<boolean>(false);

  newName = signal<string>('');
  newPrice = signal<number>(200);
  newStock = signal<number>(20);
  newCategory = signal<string>('Grocery');

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    try {
      const res: any = await firstValueFrom(this.http.get<any>(this.apiUrl));
      if (res && res.success && Array.isArray(res.data)) {
        this.products.set(res.data);
      }
    } catch (err) {
      console.warn('Failed to load products from API:', err);
    }
  }

  addStock(id: string): void {
    this.products.update((list) =>
      list.map((item) => (item.id === id ? { ...item, stock: item.stock + 5 } : item))
    );
  }

  async handleAddProduct(e: Event): Promise<void> {
    e.preventDefault();
    if (!this.newName().trim()) return;

    const payload = {
      name: this.newName().trim(),
      sku: 'SKU-' + Date.now().toString().substring(7),
      category: this.newCategory().trim() || 'Grocery',
      price: this.newPrice() || 200,
      costPrice: Math.round((this.newPrice() || 200) * 0.8),
      stock: this.newStock() || 20,
      minStock: 5,
      unit: 'Pack',
      gstRate: 5,
    };

    try {
      const res: any = await firstValueFrom(this.http.post<any>(this.apiUrl, payload));
      if (res && res.success && res.data) {
        this.products.update((list) => [res.data, ...list]);
      } else {
        const newItem = { id: 'p_' + Date.now(), ...payload };
        this.products.update((list) => [newItem, ...list]);
      }
    } catch (err) {
      const newItem = { id: 'p_' + Date.now(), ...payload };
      this.products.update((list) => [newItem, ...list]);
    }

    this.newName.set('');
    this.showAddModal.set(false);
  }
}
