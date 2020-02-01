import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { auth } from 'firebase/app';
import { switchMap } from 'rxjs/operators';

interface User {
  role: string;
  firstname: string;
  lastname: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favorateColor?: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  newUser: any;
  user$: Observable<User>;
  // user$: Observable<User>;
  constructor(
    private http: HttpClient,
    private angularFireAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastCtrl: ToastController
  ) {
    this.user$ = this.angularFireAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return null;
        }
      })
    );
  }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  facebookLogin() {
    const provider = new auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.angularFireAuth.auth.signInWithPopup(provider);
  }

  getUserState() {
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
          // userCredential.user.updateProfile( {
          //   displayName: user.firstName + ' ' + user.lastName
          // });
          this.updateUserData(userCredential).then(() => {
            loadingEl.dismiss();
            this.router.navigateByUrl('/t/services/discover');
          });
          // this.insertUserData(userCredential)
          //   .then(() => {
          //     loadingEl.dismiss();
          //     this.router.navigateByUrl('/t/services/discover');
          //   });
        })
        .catch( error => {
          loadingEl.dismiss();
          this.showAlert(error.code);
        });
    });
  }

  private updateUserData(userCredential: firebase.auth.UserCredential) {
    const userRef: AngularFirestoreDocument<User> = this.afs.collection('users').doc(userCredential.user.uid);
    const data: User = {
      role: this.newUser.role,
      firstname: this.newUser.firstName,
      lastname: this.newUser.lastName,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      photoURL: userCredential.user.photoURL
    };

    return this.afs.collection('users').doc(userCredential.user.uid).set(data);
  }

  insertUserData(userCredential: firebase.auth.UserCredential) {
    return this.afs.collection('users').doc(userCredential.user.uid).set({
      firstname: this.newUser.firstName,
      lastname: this.newUser.lastName,
      role: this.newUser.role
    });
  }

  logout() {
    this.angularFireAuth.auth.signOut();
    localStorage.clear();
    this.router.navigate(['auth/login']);
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
