import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  // @ViewChild(..., { static: false })
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

  authenticate(email: string, password: string) {
    this.loadingController.create({
      keyboardClose: true,
      message: 'Loagging in...'
    }).then(loadingEl => {
      loadingEl.present();
      if (this.isLogin) {
        this.authService.login(email, password).then(() => {
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/t/places/discover');
        }).catch(err => console.log(err));
      } else {
        this.authService.signup(email, password).then((res) => {
          console.log(res);
          this.isLoading = false;
          loadingEl.dismiss();
        }).catch(err => {
          loadingEl.dismiss();
          this.showAlert(err.code);
        });
      }
    });
  }

  private showAlert(code: string) {
    let alertMessage = '';
    switch (code) {
      case 'auth/email-already-in-use':
        alertMessage = 'The email address is already in use by another account.';
        break;
      case 'OPERATION_NOT_ALLOWED':
        alertMessage = 'Password sign-in is disabled for this project.';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        alertMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
        break;
      case 'EMAIL_NOT_FOUND':
        alertMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
        break;
      case 'INVALID_PASSWORD':
        alertMessage = 'The password is invalid or the user does not have a password.';
        break;
      case 'USER_DISABLED':
        alertMessage = ' The user account has been disabled by an administrator.';
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

    this.authenticate(email, password);
    form.reset();
  }
}
