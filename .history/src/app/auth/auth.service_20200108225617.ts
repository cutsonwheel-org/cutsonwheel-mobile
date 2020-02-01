import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Users } from '../users/users';

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
    private alertController: AlertController,
    private toastCtrl: ToastController
  ) {}

  getUserState(): Observable<firebase.User> {
    return this.angularFireAuth.authState;
  }

  getUsersProfile() {
    return this.angularFireAuth.auth.currentUser;
  }

  getIdToken() {
    return this.angularFireAuth.idToken;
  }

  updateEmail(newEmail: string) {
    this.loadingController.create({
      keyboardClose: true,
      message: 'Updating...'
    }).then(loadingEl => {
      loadingEl.present();
      this.angularFireAuth.auth.currentUser.updateEmail(newEmail)
      .catch(error => {
        loadingEl.dismiss();
        this.showAlert(error.code);
      })
      .then(() => {
        loadingEl.dismiss();
        this.showToast('Updating email done.');
      });
    });
  }

  sendEmailVerification() {
    this.loadingController.create({
      keyboardClose: true,
      message: 'Sending...'
    }).then(loadingEl => {
      loadingEl.present();
      this.angularFireAuth.auth.currentUser.sendEmailVerification()
      .catch(error => {
        loadingEl.dismiss();
        this.showAlert(error.code);
      })
      .then(() => {
        loadingEl.dismiss();
        this.showToast('Email verification sent.');
      });
    });
  }

  updatePassword(newPassword: string) {
    this.loadingController.create({
      keyboardClose: true,
      message: 'Updating...'
    }).then(loadingEl => {
      loadingEl.present();
      this.angularFireAuth.auth.currentUser.updatePassword(newPassword)
      .catch(error => {
        loadingEl.dismiss();
        this.showAlert(error.code);
      })
      .then(() => {
        loadingEl.dismiss();
        this.showToast('Updating password done.');
      });
    });
  }

  sendPasswordResetEmail(toEmail: string) {
    this.loadingController.create({
      keyboardClose: true,
      message: 'Sending...'
    }).then(loadingEl => {
      loadingEl.present();
      this.angularFireAuth.auth.sendPasswordResetEmail(toEmail)
      .catch(error => {
        loadingEl.dismiss();
        this.showAlert(error.code);
      })
      .then(() => {
        loadingEl.dismiss();
        this.showToast('Reset Password sent.');
      });
    });
  }

  login(enteredEmail: string, enteredPassword: string) {
    // const googleAuth = gapi.auth2.getAuthInstance();
    // const googleUser = await googleAuth.signIn();

    // const token = googleUser.getAuthResponse().id_token;

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

  createUser(user: any) {
    this.loadingController.create({
      keyboardClose: true,
      message: 'Creating account...'
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
      firstname: this.newUser.firstName,
      lastname: this.newUser.lastName,
      email: userCredential.user.email,
      displayName: this.newUser.firstName + ' ' + this.newUser.lastName,
      roles: {
        client: (this.newUser.role === 'client') ? true : false,
        assistant: (this.newUser.role === 'assistant') ? true : false,
      },
      visibility : 'public',
      notification: [
        { label: 'Send push notification', val: 'send-push-notification', isChecked: true },
        { label: 'Send an email for invitations', val: 'send-for-invitations', isChecked: true },
        { label: 'Send an email events and updates', val: 'send-events-updates', isChecked: true }
      ]
    });
  }

  canRead(user: Users): boolean {
    const allowed = ['admin', 'client', 'assistant'];
    return this.checkAuthorization(user, allowed);
  }

  canEdit(user: Users): boolean {
    const allowed = ['admin', 'client'];
    return this.checkAuthorization(user, allowed);
  }

  canDelete(user: Users): boolean {
    const allowed = ['admin'];
    return this.checkAuthorization(user, allowed);
  }

  private checkAuthorization(user: Users, allowedRoles: string[]): boolean {
    if (!user) { return false; }
    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true;
      }
    }
    return false;
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

  private showToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }
}
