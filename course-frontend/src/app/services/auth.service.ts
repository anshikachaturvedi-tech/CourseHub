import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data).pipe(
      tap((res: any) => {
        if (res && res.token) {
          sessionStorage.setItem('token', res.token);
          sessionStorage.setItem('role', res.role);
          sessionStorage.setItem('name', res.name);
          if (res.email) sessionStorage.setItem('email', res.email);
          else sessionStorage.removeItem('email');
        }
      })
    );
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  logout() {
    sessionStorage.clear();
    localStorage.removeItem('token');
  }

  private decodeJwtPayload(token: string): { exp?: number; role?: string } | null {
    try {
      const part = token.split('.')[1];
      if (!part) return null;
      const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
      return JSON.parse(atob(padded));
    } catch { return null; }
  }

  isLoggedIn(): boolean {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (!token) return false;
    const payload = this.decodeJwtPayload(token);
    if (!payload) { this.logout(); return false; }
    const exp = payload.exp;
    if (typeof exp !== 'number') return true;
    if (exp * 1000 <= Date.now() + 15000) { this.logout(); return false; }
    return true;
  }

  getToken(): string | null {
    return sessionStorage.getItem('token') || localStorage.getItem('token');
  }

  getRole(): string | null {
    // return sessionStorage.getItem('role') || this.decodeJwtPayload(this.getToken() ?? '')?.role ?? null;
    return sessionStorage.getItem('role') || (this.decodeJwtPayload(this.getToken() ?? '')?.role ?? null);
  }

  isAdmin(): boolean { return this.getRole() === 'admin'; }
  isTeacher(): boolean { return this.getRole() === 'teacher'; }
  getName(): string | null { return sessionStorage.getItem('name'); }
  getEmail(): string | null { return sessionStorage.getItem('email'); }
}
