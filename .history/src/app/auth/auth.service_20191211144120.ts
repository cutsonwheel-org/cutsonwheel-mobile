import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userISAuthenticated$ = true;

  get userIsAuthenticated() {
    return this.userISAuthenticated$;
  }

  constructor() { }

  login() {
    this.userISAuthenticated$ = true;
  }

  logout() {
    this.userISAuthenticated$ = false;
  }
}
