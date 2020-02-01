import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { UsersService } from 'src/app/users/users.service';
import { switchMap } from 'rxjs/operators';
import { of, Observable, Subscription } from 'rxjs';
import { Users } from 'src/app/users/users';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit, OnDestroy {
  user: firebase.User;
  users: Users;

  isLoading: boolean;
  selectedExperience: string;
  selectedClassification: string;

  private authSub: Subscription;
  private userSub: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    this.authSub = this.authService.getUserState().pipe(
      switchMap(user => {
        if (user) {
          this.user = user;
          return this.userService.getUser(user.uid);
        } else {
          return of(null);
        }
      })
    ).subscribe((users) => {
        this.isLoading = false;
        this.users = users;
    });

    if (this.users) {
      this.userSub = this.userService.getUser(this.user.uid)
        .subscribe((detail) => {
          this.selectedExperience = detail.skills.level;
          this.selectedClassification = detail.skills.name;
        }
      );
    }
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
