import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-tabs-page',
  templateUrl: './tabs-page.page.html',
  styleUrls: ['./tabs-page.page.scss'],
})
export class TabsPagePage implements OnInit {

  user: firebase.User;
  isLoading: boolean;
  userInfo: any;
  role: string;

  constructor(
    public authService: AuthService,
    public userService: UsersService
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    const currenctUser = this.authService.getUsersProfile();
    if (currenctUser) {
      this.userService.getUser(currenctUser.uid).subscribe((profile) => {
        this.isLoading = false;
        this.userInfo = { profile, ...currenctUser };
        this.role = this.userInfo.profile.role;
      });
    }
  }

}
