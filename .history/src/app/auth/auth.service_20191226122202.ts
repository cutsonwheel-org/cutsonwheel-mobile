import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private eventAuthError = new BehaviorSubject<string>(null);
  eventAuthError$ = this.eventAuthError.asObservable();

  newUser: any;

  constructor(
    private http: HttpClient,
    private angularFireAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) { }

  getUserState() {
    return this.angularFireAuth.authState;
  }

  getIdToken() {
    return this.angularFireAuth.idToken;
  }

  login(enteredEmail: string, enteredPassword: string) {
    this.angularFireAuth.auth.signInWithEmailAndPassword(enteredEmail, enteredPassword)
    .catch(error => {
      this.eventAuthError.next(error);
    })
    .then(userCredential => {
      if (userCredential) {
        this.router.navigateByUrl('/t/places/discover');
      }
    });
  }

  createUser(user) {
    this.angularFireAuth.auth.createUserWithEmailAndPassword( user.email, user.password)
      .then( userCredential => {
        this.newUser = user;
        userCredential.user.updateProfile( {
          displayName: user.firstName + ' ' + user.lastName
        });

        this.insertUserData(userCredential)
          .then(() => {
            this.router.navigateByUrl('/t/places/discover');
          });
      })
      .catch( error => {
        this.eventAuthError.next(error);
      });
  }

  insertUserData(userCredential: firebase.auth.UserCredential) {
    return this.afs.collection('users').doc(userCredential.user.uid).set({
      email: this.newUser.email,
      firstname: this.newUser.firstName,
      lastname: this.newUser.lastName,
      role: this.newUser.role
    });
    // return this.afs.doc(`users/${userCredential.user.uid}`).set({
    //   email: this.newUser.email,
    //   firstname: this.newUser.firstName,
    //   lastname: this.newUser.lastName,
    //   role: 'network user'
    // });
  }

  logout() {
    this.angularFireAuth.auth.signOut();
  }

}
