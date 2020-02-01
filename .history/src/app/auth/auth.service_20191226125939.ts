import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

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
    private router: Router,
    private loadingController: LoadingController
  ) { }

  getUserState() {
    return this.angularFireAuth.authState;
  }

  getIdToken() {
    return this.angularFireAuth.idToken;
  }

  login(enteredEmail: string, enteredPassword: string) {
    this.loadingController.create({
      keyboardClose: true,
      message: 'Loging in...'
    }).then(loadingEl => {
      loadingEl.present();

      this.angularFireAuth.auth.signInWithEmailAndPassword(enteredEmail, enteredPassword)
      .catch(error => {
        console.log(error);
        this.eventAuthError.next(error);
      })
      .then(userCredential => {
        if (userCredential) {
          loadingEl.dismiss();
          this.router.navigateByUrl('/t/places/discover');
        }
      });
    });
  }

  createUser(user) {

    this.loadingController.create({
      keyboardClose: true,
      message: 'Registering...'
    }).then(loadingEl => {
      loadingEl.present();

      this.angularFireAuth.auth.createUserWithEmailAndPassword( user.email, user.password)
        .then( userCredential => {
          this.newUser = user;
          userCredential.user.updateProfile( {
            displayName: user.firstName + ' ' + user.lastName
          });

          this.insertUserData(userCredential)
            .then(() => {
              loadingEl.dismiss();
              this.router.navigateByUrl('/t/places/discover');
            });
        })
        .catch( error => {
          this.eventAuthError.next(error);
        });
    });
  }

  insertUserData(userCredential: firebase.auth.UserCredential) {
    return this.afs.collection('users').doc(userCredential.user.uid).set({
      email: this.newUser.email,
      firstname: this.newUser.firstName,
      lastname: this.newUser.lastName,
      role: this.newUser.role
    });
  }

  logout() {
    this.angularFireAuth.auth.signOut();
  }

}
