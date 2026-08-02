import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(115,66,226,0.08),transparent_32%),linear-gradient(180deg,#f8fafc_0%,#f4f6fb_100%)] text-[#142033]">
      <app-sidebar></app-sidebar>
      <div class="ml-64 flex flex-1 flex-col transition-all duration-300">
        <app-header></app-header>
        <main class="flex-1 overflow-y-auto p-6 lg:p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class DashboardLayoutComponent {}
