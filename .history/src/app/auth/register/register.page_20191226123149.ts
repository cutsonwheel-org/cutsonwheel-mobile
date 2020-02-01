import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  authError: any;

  constructor(
    private auth: AuthService,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.auth.eventAuthError$.subscribe( data => {
      this.authError = data;
    });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.loadingController.create({
      keyboardClose: true,
      message: 'Registering...'
    }).then(loadingEl => {
      loadingEl.present();
      this.auth.createUser(form.value);
      // this.authService.signup(email, password).then((res) => {
      //   this.isLoading = false;
      //   loadingEl.dismiss();
      //   this.router.navigateByUrl('/t/places/discover');
      // }).catch(err => {
      //   loadingEl.dismiss();
      //   this.showAlert(err.code);
      // });
    });

  }
}
