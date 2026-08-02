import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LandingLayoutComponent } from './layouts/landing-layout/landing-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { LandingComponent } from './features/landing/landing.component';
import { LoginComponent } from './features/auth/login/login.component';
import { OnboardingComponent } from './features/auth/onboarding/onboarding.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { InventoryComponent } from './features/inventory/inventory.component';
import { SalesComponent } from './features/sales/sales.component';
import { FinanceComponent } from './features/finance/finance.component';
import { GstComponent } from './features/gst/gst.component';
import { AiChatComponent } from './features/ai-chat/ai-chat.component';

export const routes: Routes = [
  // ─── Public Routes ───
  {
    path: '',
    component: LandingLayoutComponent,
    children: [
      { path: '', component: LandingComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: LoginComponent },

  // ─── Protected Routes (require login) ───
  {
    path: 'onboarding',
    component: OnboardingComponent,
    canActivate: [authGuard],
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'finance', component: FinanceComponent },
      { path: 'gst', component: GstComponent },
      { path: 'ai-chat', component: AiChatComponent },
    ],
  },

  // ─── Catch-all ───
  { path: '**', redirectTo: '' },
];
