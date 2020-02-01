import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userISAuthenticated$ = true;
  private userId$ = 'abc';

  get userIsAuthenticated() {
    return this.userISAuthenticated$;
  }

  get userId() {
    return this.userId$;
  }

  constructor() { }

  login() {
    this.userISAuthenticated$ = true;
  }

  logout() {
    this.userISAuthenticated$ = false;
  }
}
