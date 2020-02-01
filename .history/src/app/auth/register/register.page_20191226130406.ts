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
    private auth: AuthService
  ) { }

  ngOnInit() { }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.auth.createUser(form.value);
    form.reset();
  }
}
