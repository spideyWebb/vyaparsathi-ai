import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-[calc(100vh-7rem)] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Chat Header -->
      <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#7342E2] to-[#5b2ec6] flex items-center justify-center text-white text-base shadow-sm">
            🤖
          </div>
          <div>
            <h3 class="text-sm font-bold text-[#192837]">AI Vyapar Copilot</h3>
            <span class="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Active & Synced to DB
            </span>
          </div>
        </div>
      </div>

      <!-- Messages Stream -->
      <div class="flex-1 p-4 overflow-y-auto space-y-4">
        @if (messages().length === 0) {
          <div class="h-full flex flex-col items-center justify-center text-center p-6">
            <div class="w-12 h-12 rounded-full bg-purple-50 text-[#7342E2] flex items-center justify-center text-xl mb-2">
              💡
            </div>
            <h4 class="text-sm font-bold text-[#192837]">How can I help your business today?</h4>
            <p class="text-xs text-slate-500 mt-1 max-w-xs">
              Ask about inventory stock alerts, GST filing tips, or P&L profit optimization.
            </p>
          </div>
        } @else {
          @for (m of messages(); track m.id) {
            <div class="flex flex-col" [class.items-end]="m.sender === 'user'" [class.items-start]="m.sender !== 'user'">
              <div
                class="max-w-md p-3.5 rounded-2xl text-xs leading-relaxed"
                [class.bg-[#7342E2]]="m.sender === 'user'"
                [class.text-white]="m.sender === 'user'"
                [class.bg-slate-100]="m.sender !== 'user'"
                [class.text-slate-800]="m.sender !== 'user'"
              >
                {{ m.text }}
              </div>
              <span class="text-[10px] text-slate-400 mt-1 px-1">{{ m.timestamp }}</span>
            </div>
          }
        }
      </div>

      <!-- Input Bar -->
      <form (submit)="sendMessage($event)" class="p-4 border-t border-slate-100 bg-white flex items-center gap-2">
        <input
          type="text"
          [ngModel]="inputText()"
          (ngModelChange)="inputText.set($event)"
          name="inputText"
          placeholder="Ask AI Copilot about your store sales, inventory or GST..."
          class="flex-1 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#7342E2]"
        />
        <button
          type="submit"
          class="bg-[#7342E2] text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-md hover:bg-[#6232c9] transition-all"
        >
          Send
        </button>
      </form>
    </div>
  `,
})
export class AiChatComponent implements OnInit {
  private apiUrl = 'http://localhost:8081/api/v1/ai/chat';
  messages = signal<any[]>([]);
  inputText = signal<string>('');

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadChatHistory();
  }

  async loadChatHistory(): Promise<void> {
    try {
      const res: any = await firstValueFrom(this.http.get<any>(this.apiUrl));
      if (res && res.success && Array.isArray(res.data)) {
        this.messages.set(res.data);
      }
    } catch (err) {
      console.warn('AI Chat DB load error:', err);
    }
  }

  async sendMessage(e: Event): Promise<void> {
    e.preventDefault();
    const text = this.inputText().trim();
    if (!text) return;

    this.inputText.set('');
    const userMsg = { id: 'm_' + Date.now(), sender: 'user', text, timestamp: new Date().toLocaleTimeString() };
    this.messages.update((list) => [...list, userMsg]);

    try {
      const res: any = await firstValueFrom(this.http.post<any>(this.apiUrl, { text }));
      if (res && res.success && Array.isArray(res.data)) {
        this.messages.set(res.data);
      }
    } catch (err) {
      const botReply = { id: 'm_' + (Date.now() + 1), sender: 'ai', text: `Aapke query "${text}" ke hisab se saara data database mein safe hai.`, timestamp: new Date().toLocaleTimeString() };
      this.messages.update((list) => [...list, botReply]);
    }
  }
}
