import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { io, type Socket } from 'socket.io-client';

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
  private socket: Socket;

  private accessToken = signal<string | null>(null);
  private currentUser = signal<User | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor() {
    this.socket = io(environment.socketUrl, {
      autoConnect: false,
      withCredentials: true,
      auth: (send) => send({ token: this.getToken() }),
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de connexió al socket:', error.message);
    });
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, data);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials, {
      withCredentials: true
    }).pipe(
      tap((response: LoginResponse) => {
        this.accessToken.set(response.token);
        this.currentUser.set(response.user);
        this.connectSocket();
      }),
    );
  }

  refresh(): Observable<string> {
    return this.http.post<RefreshResponse>(`${this.baseUrl}/refresh`, {}, {
      withCredentials: true
    }).pipe(
      map((response: RefreshResponse) => response.token),
      tap((token: string) => {
        this.accessToken.set(token);
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (!this.currentUser()) {
          this.currentUser.set({ _id: payload.sub, role: payload.role } as User);
        }
        this.connectSocket();
      }),
    );
  }

  initSession(): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>(`${this.baseUrl}/refresh`, {}, {
      withCredentials: true
    }).pipe(
      tap((response: RefreshResponse) => {
        this.accessToken.set(response.token);
        const payload = JSON.parse(atob(response.token.split('.')[1]));
        this.currentUser.set({
          _id: payload.sub,
          role: payload.role,
          name: '',
          email: ''
        } as User);
        this.connectSocket();
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
    this.socket.disconnect();
    this.accessToken.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private connectSocket(): void {
    if (!this.socket.connected) {
      this.socket.auth = { token: this.getToken() };
      this.socket.connect();
    }
  }

  getToken(): string | null {
    return this.accessToken();
  }
}