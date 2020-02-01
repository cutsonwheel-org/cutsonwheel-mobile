import { Injectable } from '@angular/core';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userISAuthenticated$ = false;
  private userId$ = 'abc';

  get userIsAuthenticated() {
    return this.userISAuthenticated$;
  }

  get userId() {
    return this.userId$;
  }

  constructor(private firebaseAuthentication: FirebaseAuthentication) { }

  login() {
    // this.firebaseAuthentication.createUserWithEmailAndPassword('test@gmail.com', '123')
    //   .then((res: any) => console.log(res))
    //   .catch((error: any) => console.error(error));
    this.userISAuthenticated$ = true;
  }

  logout() {
    this.userISAuthenticated$ = false;
  }
}
