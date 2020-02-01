import { Component, OnInit } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/users/users.service';
import { ImagePicker } from 'src/app/shared/pickers/image-picker/image-picker';
import { ImagePickerService } from 'src/app/shared/pickers/image-picker/image-picker.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private authSub: Subscription;
  user: firebase.User;
  firstname: string;
  lastname: string;
  middlename: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private usersService: UsersService,
    private imagePickerService: ImagePickerService,
  ) {}

  ngOnInit() {
    this.authSub = this.authService.getUserState().pipe(
      switchMap(user => {
        if (user) {
          this.user = user;
          return this.usersService.getUser(user.uid);
        } else {
          return of(null);
        }
      })
    ).subscribe( profile => {
        if (this.user) {
          this.firstname = profile.firstname;
          this.lastname = profile.lastname;
          this.middlename = profile.middlename;
        }
    });
  }

  onNext() {
    if (!this.firstname || !this.lastname ) {
      return;
    }

    const data = {
      id: this.user.uid,
      firstname: this.firstname,
      lastname: this.lastname,
      middlename: this.middlename
    };
    this.usersService.update(data).then((response) => {
      console.log(response);
    });
  }

}
