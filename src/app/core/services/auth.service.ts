import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, AuthResponse, ApiResponse } from '../models/user.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/v1';

  // Reactive State via Signals
  user = signal<User | null>(this.getStoredUser());
  token = signal<string | null>(localStorage.getItem('vyapar_token'));
  isAuthenticated = computed(() => !!this.token() && !!this.user());
  errorMessage = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  private getStoredUser(): User | null {
    const data = localStorage.getItem('vyapar_user');
    return data ? JSON.parse(data) : null;
  }

  async neonAuthSync(neonUserId: string, email: string, businessName?: string): Promise<boolean> {
    this.errorMessage.set(null);
    try {
      const res: any = await firstValueFrom(
        this.http.post<any>(`${this.apiUrl}/auth/neon-sync`, { neonUserId, email, businessName })
      );
      if (res && res.success && res.data) {
        const { accessToken, refreshToken, user } = res.data;
        this.token.set(accessToken);
        this.user.set(user);

        localStorage.setItem('vyapar_token', accessToken);
        localStorage.setItem('vyapar_refresh_token', refreshToken);
        localStorage.setItem('vyapar_user', JSON.stringify(user));
        return true;
      }
    } catch (err: any) {
      console.warn('Neon Auth Sync HTTP error:', err);
    }
    return false;
  }

  async signup(businessName: string, contact: string, username: string, password: string): Promise<boolean> {
    this.errorMessage.set(null);
    try {
      const res: any = await firstValueFrom(
        this.http.post<any>(`${this.apiUrl}/auth/signup`, { businessName, contact, username, password })
      );
      if (res && res.success && res.data) {
        const { accessToken, refreshToken, user } = res.data;
        this.token.set(accessToken);
        this.user.set(user);

        localStorage.setItem('vyapar_token', accessToken);
        localStorage.setItem('vyapar_refresh_token', refreshToken);
        localStorage.setItem('vyapar_user', JSON.stringify(user));
        return true;
      } else if (res && res.message) {
        this.errorMessage.set(res.message);
        return false;
      }
    } catch (err: any) {
      const msg = err?.error?.message || 'Failed to create account. Mobile/Email or Username might already exist.';
      this.errorMessage.set(msg);
    }
    return false;
  }

  async login(username: string, password: string): Promise<boolean> {
    this.errorMessage.set(null);
    try {
      const res: any = await firstValueFrom(
        this.http.post<any>(`${this.apiUrl}/auth/login`, { username, password })
      );

      if (res && res.success && res.data) {
        const { accessToken, refreshToken, user } = res.data;
        this.token.set(accessToken);
        this.user.set(user);

        localStorage.setItem('vyapar_token', accessToken);
        localStorage.setItem('vyapar_refresh_token', refreshToken);
        localStorage.setItem('vyapar_user', JSON.stringify(user));
        return true;
      } else if (res && res.message) {
        this.errorMessage.set(res.message);
        return false;
      }
    } catch (err: any) {
      const msg = err?.error?.message || "Account not found for this Mobile/Email or Username. Please click 'Create Account (Sign Up)' to register.";
      this.errorMessage.set(msg);
    }
    return false;
  }

  async register(phone: string, businessName?: string): Promise<string> {
    const success = await this.signup(businessName || 'My Store', phone, phone, '123456');
    return success ? '123456' : '';
  }

  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    return this.login(phone, otp);
  }

  async updateProfile(updates: Partial<User>): Promise<User | null> {
    const current = this.user();
    if (!current) return null;

    const updated: User = { ...current, ...updates };
    this.user.set(updated);
    localStorage.setItem('vyapar_user', JSON.stringify(updated));

    try {
      await firstValueFrom(
        this.http.post<ApiResponse<User>>(`${this.apiUrl}/users/onboarding`, updated)
      );
    } catch (ignored) {}

    return updated;
  }

  async completeOnboarding(updates: Partial<User>): Promise<any> {
    const user = await this.updateProfile(updates);
    return { success: true, data: user, message: 'Onboarding completed' };
  }

  logout(): void {
    this.user.set(null);
    this.token.set(null);
    this.errorMessage.set(null);
    localStorage.removeItem('vyapar_token');
    localStorage.removeItem('vyapar_refresh_token');
    localStorage.removeItem('vyapar_user');
  }
}
