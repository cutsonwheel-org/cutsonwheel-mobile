import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  authError: any;
  functions: firebase.functions.Functions;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    const clientEmail = 'rebucasrandy1986@gmail.com';
    const addClientRole = this.functions.httpsCallable('addClientRole');
    addClientRole({ email: clientEmail }).then((result) => {
      console.log(result);
    });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.auth.login(form.value.email, form.value.password);
    form.reset();
  }

}
