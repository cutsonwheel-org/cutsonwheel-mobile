import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, from } from 'rxjs';
import { Auth } from './auth';
import { map, tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { AngularFireAuth } from '@angular/fire/auth';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private auth = new BehaviorSubject<Auth>(null);
  private activeLogoutTimer: any;

  get userIsAuthenticated() {
    return this.auth.asObservable().pipe(
      map(auths => {
        if (auths) {
          return !!auths.token;
        } else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this.auth.asObservable().pipe(
      map(auths => {
        if (auths) {
          return auths.id;
        } else {
          return null;
        }
      })
    );
  }

  get token() {
    return this.auth.asObservable().pipe(
      map(auths => {
        if (auths) {
          return auths.token;
        } else {
          return null;
        }
      })
    );
  }

  get email() {
    return this.auth.asObservable().pipe(
      map(auths => {
        if (auths) {
          return auths.email;
        } else {
          return null;
        }
      })
    );
  }

  constructor(
    private http: HttpClient,
    private angularFireAuth: AngularFireAuth
  ) { }

  login(enteredEmail: string, enteredPassword: string) {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(enteredEmail, enteredPassword).then(res => {
        const data = JSON.stringify({
          userId: res.user.uid,
          token: res.user.refreshToken,
          email: res.user.email,
          emailVerified: res.user.emailVerified,
          displayName: res.user.displayName,
          photoURL: res.user.photoURL,
          phoneNumber: res.user.phoneNumber,
          creationTime: res.user.metadata.creationTime,
          lastSignInTime: res.user.metadata.lastSignInTime
          // tokenExpirationDate: setTokenExpirationDate,
          // tenantId: res.user.tenantId
        });
        Plugins.Storage.set({
          key: 'authData',
          value: data
        });
        // this.setUserData(res.user);
      }
    );

    // return this.http.post<AuthResponseData>(
    //   `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
    //   {
    //     email: enteredEmail,
    //     password: enteredPassword,
    //     returnSecureToken: true
    //   }
    // ).pipe(tap(
    //   this.setUserData.bind(this)
    // ));
  }

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parseData = JSON.parse(storedData.value) as {
          token: string;
          userId: string;
          email: string;
          emailVerified: boolean;
          displayName: string;
          photoURL: string;
          phoneNumber: string;
          creationTime: Date;
          lastSignInTime: Date;
          // tokenExpirationDate: string;
        };
        // const expirationTime = new Date(parseData.tokenExpirationDate);
        // if (expirationTime <= new Date()) {
        //   return null;
        // }
        const user = new Auth(
          parseData.token,
          parseData.userId,
          parseData.email,
          parseData.emailVerified,
          parseData.displayName,
          parseData.photoURL,
          parseData.phoneNumber,
          parseData.creationTime,
          parseData.lastSignInTime
          // expirationTime
        );
        return user;
      }),
      tap(user => {
        if (user) {
          this.auth.next(user);
          // this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  signup(enteredEmail: string, enteredPassword: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`, {
      email: enteredEmail,
      password: enteredPassword,
      returnSecureToken: true
    }).pipe(tap(
      // this.setUserData.bind(this)
    ));
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.auth.next(null);
    Plugins.Storage.remove({ key: 'authData' });
  }

  // private autoLogout(duration: number) {
  //   if (this.activeLogoutTimer) {
  //     clearTimeout(this.activeLogoutTimer);
  //   }
  //   this.activeLogoutTimer = setTimeout(() => {
  //     this.logout();
  //   }, duration);
  // }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  // private setUserData(userData: AuthResponseData) {
  //   const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
  //   const user = new Auth(
  //     userData.localId, userData.email, userData.idToken, expirationTime
  //   );
  //   this.auth.next(user);
  //   this.autoLogout(user.tokenDuration);
  //   this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString(), userData.email);
  // }

  // private storeAuthData(setUserId: string, setToken: string, setTokenExpirationDate: string, setEmail: string) {
  //   const data = JSON.stringify({
  //     userId: setUserId,
  //     token: setToken,
  //     tokenExpirationDate: setTokenExpirationDate,
  //     email: setEmail
  //   });
  //   Plugins.Storage.set({
  //     key: 'authData',
  //     value: data
  //   });
  // }

}
