import { Component, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Bookings } from './bookings';
import { BookingsService } from './bookings.service';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss']
})
export class BookingsPage implements OnInit {
  isLoading = false;
  userInfo: any;

  public loadedBookings$: Observable<Bookings[]>;

  constructor(
    private bookingService: BookingsService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private userService: UsersService,
    private router: Router
  ) {}

  ngOnInit() {
    let loadedBooking;
    const currenctUser = this.authService.getUsersProfile();
    if (currenctUser) {
      this.userService.getUser(currenctUser.uid).subscribe((profile) => {
        this.userInfo = { profile, ...currenctUser };
        if (this.userInfo.profile.role === 'assistant') {
          /** assistant */
          loadedBooking = this.bookingService.getBookingsByAssistant(currenctUser.uid);
        } else {
          /** client */
          loadedBooking = this.bookingService.getBookingsByClient(currenctUser.uid);
        }
        this.loadedBookings$ = loadedBooking;
      });
    }
  }

  ionViewWillEnter() {

  }

  onViewBooking(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    console.log(this.userInfo);
    this.router.navigateByUrl('/t/bookings/booking-detail/' + bookingId);
  }

  onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.loadingCtrl.create({ message: 'Cancelling...' }).then(loadingEl => {
      loadingEl.present();
      this.bookingService.deleteBooking(bookingId).then(() => {
        loadingEl.dismiss();
      });
    });
  }

}
