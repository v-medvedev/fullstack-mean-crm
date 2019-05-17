import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { User } from "../interfaces";

@Injectable({
  providedIn: "root"
})
export class AuthService {

  private token = null;

  constructor(private http: HttpClient) {
  }

  login(user: User): Observable<{token: string}> {
    return this.http.post<{token: string}>('/api/auth/login', user)
      .pipe(
        tap(({token}) => {
          this.setToken(token);
          localStorage.setItem('auth-token', token);
        })
      )
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  register(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/register', user);
  }

  logout() {
    this.setToken(null);
    localStorage.clear();
  }

}
