import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  authError: any;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.auth.getUserState()
      .subscribe( user => {
        if (user) {
          this.router.navigateByUrl('/t/places/discover');
        }
    });
   }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.auth.createUser(form.value);
    form.reset();
  }
}
