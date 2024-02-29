import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _apiUrl = environment.apiUrl;
  private _authenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public authenticated = this._authenticatedSubject.asObservable();
  private _httpClient = inject(HttpClient);

  private hasToken(): boolean {
    return !!localStorage.getItem("salonToken");
  }

  getToken(): string | null {
    return localStorage.getItem("salonToken");
  }

  register(user: any) {
    return this._httpClient.post(`${this._apiUrl}/auth/register`, user);
  }

  login(email: string, password: string) {
    return this._httpClient.post<{ token: string }>(
      `${this._apiUrl}/auth/login`, 
      { email, password }, 
      { observe: 'response' }
    ).pipe(
      tap(res => {
        // Check if res.body is not null before accessing its token property
        if (res.body) {
          localStorage.setItem("salonToken", res.body.token);
          this._authenticatedSubject.next(true);
        } else {
          // Handle the case where res.body is null, if necessary
          console.error('Received null response body');
          throw new Error('Received null response body');
        }
      }),
      catchError(error => {
        // Handle error
        throw error;
      })
    );
  }

  logout() {
    localStorage.removeItem("salonToken");
    this._authenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this._authenticatedSubject.asObservable();
  }
}

