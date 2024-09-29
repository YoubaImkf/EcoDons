import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3001/users';
  private tokenKey = 'jwtToken';
  private userKey = 'authUser';

  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isLoggedIn());
  private userNameSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this.getUser());

  constructor(private http: HttpClient) {}

  signup(userData: { name: string; email: string; password: string; location: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userData);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.get(`${this.apiUrl}?email=${credentials.email}`);
  }

  storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.isLoggedInSubject.next(true); 
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  storeUser(user: string) {
    localStorage.setItem(this.userKey, user);
    this.userNameSubject.next(user); 
  }

  getUser(): string | null {
    return localStorage.getItem(this.userKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isLoggedInSubject.next(false); 
    this.userNameSubject.next(null); 
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }


  get userName$(): Observable<string | null> {
    return this.userNameSubject.asObservable();
  }

  getUserName(): string | null {
    return this.getUser();
  }
}
