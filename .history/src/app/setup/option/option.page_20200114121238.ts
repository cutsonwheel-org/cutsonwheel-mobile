import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/users/users.service';
import { Subscription } from 'rxjs';

interface Roles {
  client?: boolean;
  assistant?: boolean;
  admin?: boolean;
}
@Component({
  selector: 'app-option',
  templateUrl: './option.page.html',
  styleUrls: ['./option.page.scss'],
})
export class OptionPage implements OnInit {
  private authSub: Subscription;
  user: firebase.User;
  roles: Roles;

  constructor(
    private authService: AuthService,
    private router: Router,
    private usersService: UsersService,
  ) { }

  ngOnInit() {
    // this.authSub = this.authService.getUserState().pipe(
    //   switchMap(user => {
    //     if (user) {
    //       this.user = user;
    //       return this.usersService.getUser(user.uid);
    //     } else {
    //       return of(null);
    //     }
    //   })
    // ).subscribe( profile => {
    //     if (this.user) {
    //       this.firstname = profile.firstname;
    //       this.lastname = profile.lastname;
    //       this.middlename = profile.middlename;
    //       this.displayName = this.user.displayName;
    //     }
    // });
  }

  onNext() {
  //   if (!this.firstname || !this.lastname || !this.address) {
  //     return;
  //   }
  //   const data = {
  //     id: this.user.uid,
  //     firstname: this.firstname,
  //     lastname: this.lastname,
  //     middlename: this.middlename,
  //     displayName: this.displayName,
  //     location: {
  //       lat: this.lat,
  //       lng: this.lng,
  //       address: this.address,
  //       staticMapImageUrl: this.staticMapImageUrl
  //     }
  //   };
  //   this.usersService.update(data).then(() => {
  //     this.user.updateProfile({
  //       displayName: this.displayName
  //     }).then(() => {
  //       this.router.navigateByUrl('setup/option');
  //     });
  //   });
  }
}
