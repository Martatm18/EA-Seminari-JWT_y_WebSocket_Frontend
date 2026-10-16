import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = `${environment.apiUrl}/auth`;

  private accessToken = signal<string | null>(null);
  private currentUser = signal<User | null>(null);
  
  readonly user = this.currentUser.asReadonly();

  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, data);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials, {
      withCredentials: true
    }).pipe(
      tap((response) => {
        this.accessToken.set(response.token);
        this.currentUser.set(response.user);
      }),
    );
  }

  refresh(): Observable<string> {
    return this.http.post<RefreshResponse>(`${this.baseUrl}/refresh`, {}, {
      withCredentials: true
    }).pipe(
      map((response) => response.token),
      tap((token) => {
        this.accessToken.set(token);
        // Recuperamos el usuario del payload del token al refrescar
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (!this.currentUser()) {
          this.currentUser.set({ _id: payload.sub, role: payload.role } as User);
        }
      }),
    );
  }

  initSession(): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>(`${this.baseUrl}/refresh`, {}, {
      withCredentials: true
    }).pipe(
      tap((response) => {
        this.accessToken.set(response.token);
        // Al recargar la página, leemos el token y restauramos el usuario básico en la signal
        const payload = JSON.parse(atob(response.token.split('.')[1]));
        this.currentUser.set({
          _id: payload.sub,
          role: payload.role,
          name: '',
          email: ''
        } as User);
      })
    );
  }

  logout(): void {
    this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true }).subscribe({
      complete: () => this.clearSession(),
      error: () => this.clearSession()
    });
  }

  private clearSession(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.accessToken();
  }
}