import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-tabs-page',
  templateUrl: './tabs-page.page.html',
  styleUrls: ['./tabs-page.page.scss'],
})
export class TabsPagePage implements OnInit {

  isLoading: boolean;
  role: string;

  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) { }

  ngOnInit() {
    // auth.user$ | async as user
    const currenctUser = this.authService.getUsersProfile();
    if (currenctUser) {
      this.userService.getUser(currenctUser.uid).subscribe((profile) => {
        this.isLoading = false;
        this.role = profile.role;
      });
    }
  }

}
