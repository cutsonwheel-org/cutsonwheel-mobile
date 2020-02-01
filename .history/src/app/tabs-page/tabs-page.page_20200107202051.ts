import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-tabs-page',
  templateUrl: './tabs-page.page.html',
  styleUrls: ['./tabs-page.page.scss'],
})
export class TabsPagePage implements OnInit {

  isLoading: boolean;
  user: firebase.User;
  userInfo: any;

  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) { }

  ngOnInit() {
    // auth.user$ | async as user
    this.authService.getUserState().pipe(
      switchMap(user => {
        if (user) {
          this.user = user;
          return this.userService.getUser(user.uid);
        } else {
          return of(null);
        }
      })
    ).subscribe((profile) => {
      this.userInfo = { ...profile, ...this.user };
    });

    // const currenctUser = this.authService.getUsersProfile();
    // if (currenctUser) {
    //   this.userService.getUser(currenctUser.uid).subscribe((profile) => {
    //     console.log(profile);
    //     this.isLoading = false;
    //     this.role = profile.role;
    //   });
    // }
  }

}
