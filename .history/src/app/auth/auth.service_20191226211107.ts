import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  newUser: any;

  constructor(
    private http: HttpClient,
    private angularFireAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
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
        loadingEl.dismiss();
        this.showAlert(error.code);
      })
      .then(userCredential => {
        if (userCredential) {
          loadingEl.dismiss();
          this.router.navigateByUrl('/t/services/discover');
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
              this.router.navigateByUrl('/t/services/discover');
            });
        })
        .catch( error => {
          loadingEl.dismiss();
          this.showAlert(error.code);
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

  private showAlert(code: string) {
    let alertMessage = '';
    switch (code) {
      case 'auth/email-already-in-use':
        alertMessage = 'The email address is already in use by another account.';
        break;
      case 'auth/invalid-email':
        alertMessage = 'The email address is invalid.';
        break;
      case 'auth/operation-not-allowed':
        alertMessage = 'Password sign-in is disabled for this project.';
        break;
      case 'auth/weak-password':
        alertMessage = 'Password is weak.';
        break;
      case 'auth/wrong-password':
        alertMessage = 'password is invalid for the given email.';
        break;
      case 'auth/user-disabled':
        alertMessage = ' The user account has been disabled by an administrator.';
        break;
      case 'auth/user-not-found':
        alertMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
        break;
      case 'auth/expired-action-code':
        alertMessage = 'action code has expired.';
        break;
      case 'auth/invalid-action-code':
        alertMessage = 'code is already been used!';
        break;
      default:
        alertMessage = 'Encounter an error!Please try again.';
        break;
    }

    this.alertController.create({
      header: 'Authentication failed',
      message: alertMessage,
      buttons: ['Ok']
    })
    .then(alertEl => alertEl.present());
  }
}
