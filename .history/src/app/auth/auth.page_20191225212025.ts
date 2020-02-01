import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  // authenticate(email: string, password: string) {
  //   this.loadingController.create({
  //     keyboardClose: true,
  //     message: 'Logging in...'
  //   }).then(loadingEl => {
  //     loadingEl.present();
  //     if (this.isLogin) {
  //       this.authService.login(email, password).then(() => {
  //         this.isLoading = false;
  //         loadingEl.dismiss();
  //         this.router.navigateByUrl('/t/places/discover');
  //       }).catch(err => {
  //         loadingEl.dismiss();
  //         this.showAlert(err.code);
  //       });
  //     } else {
  //       this.authService.signup(email, password).then((res) => {
  //         this.isLoading = false;
  //         loadingEl.dismiss();
  //         this.router.navigateByUrl('/t/places/discover');
  //       }).catch(err => {
  //         loadingEl.dismiss();
  //         this.showAlert(err.code);
  //       });
  //     }
  //   });
  // }

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
      buttons: ['okey']
    })
    .then(alertEl => alertEl.present());
  }

  onSwitchMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    // this.authenticate(email, password);
    // form.reset();
  }
}
