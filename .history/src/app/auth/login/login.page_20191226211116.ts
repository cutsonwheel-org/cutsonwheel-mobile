import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  authError: any;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.auth.getUserState()
      .subscribe( user => {
        if (user) {
          this.router.navigateByUrl('/t/services/discover');
        }
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
