import { Injectable, Injector } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { Observable } from 'rxjs';
import { Users } from './users/users';

@Injectable()
export class StartupService {

  userInfo: any;
  user: firebase.User;

  constructor(
    private injector: Injector,
    private userService: UsersService
  ) {}

  load(): Promise<any> {
    const auth = this.injector.get(AuthService);
    const currenctUser = auth.getUsersProfile();
    if (currenctUser) {
      const profile = this.userService.getUser(currenctUser.uid);
      console.log('initialized');
      // return { profile, ...currenctUser };
      return Promise.resolve({ profile, ...currenctUser });
    }
    // if (auth.isAuthenticated()) {
    //   auth.getLoggedInUser().subscribe(
    //     response => {
    //       //everything from here on is happening after app init
    //       return Promise.resolve(true);
    //     },
    //     error => {
    //       return Promise.reject(false);
    //     }
    //   );
    // } else {
    //   return Promise.resolve(true);
    // }
  }
}
