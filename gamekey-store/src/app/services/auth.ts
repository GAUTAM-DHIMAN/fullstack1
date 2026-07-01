import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private apiBase = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  // Save token in browser storage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Retrieve token from browser storage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Delete token (logout)
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Check if token exists
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // Register a new user and store the returned token
  register(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBase}/register/`, { username, password }).pipe(
      tap(response => this.setToken(response.token))
    );
  }

  // Login existing user via DRF's obtain-auth-token endpoint
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBase}/login/`, { username, password }).pipe(
      tap(response => this.setToken(response.token))
    );
  }
}
