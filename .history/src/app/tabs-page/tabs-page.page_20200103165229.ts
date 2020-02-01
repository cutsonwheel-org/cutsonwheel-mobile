import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { BookingsService } from '../bookings/bookings.service';
import { Observable } from 'rxjs';
import { Bookings } from '../bookings/bookings';

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

  public loadedBookings$: Observable<Bookings[]>;

  constructor(
    public authService: AuthService,
    public userService: UsersService,
    public bookingService: BookingsService,
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    const currenctUser = this.authService.getUsersProfile();
    if (currenctUser) {
      this.userService.getUser(currenctUser.uid).subscribe((profile) => {
        return { profile, ...currenctUser };
      });
    }
  }

  loadBookings() {
    let loadedBooking;
    const currenctUser = this.authService.getUsersProfile();
    if (currenctUser) {
      this.userService.getUser(currenctUser.uid).subscribe((profile) => {
        this.userInfo = { profile, ...currenctUser };
        if (this.userInfo.profile.role === 'assistant') {
          loadedBooking = this.bookingService.getBookingsByAssistant(currenctUser.uid);
        } else {
          loadedBooking = this.bookingService.getBookingsByClient(currenctUser.uid);
        }
        this.loadedBookings$ = loadedBooking;
      });
    }
  }
}
