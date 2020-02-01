import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userISAuthenticated$ = false;

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
