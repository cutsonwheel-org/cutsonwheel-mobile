import { Component, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Bookings } from './bookings';
import { BookingsService } from './bookings.service';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';

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
    private userService: UsersService
  ) {}

  ngOnInit() {
    let loadedBooking;
    const currenctUser = this.authService.getUsersProfile();
    if (currenctUser) {
      this.userService.getUser(currenctUser.uid).subscribe((profile) => {
        this.userInfo = { profile, ...currenctUser };
        console.log(this.userInfo);
        if (this.userInfo.role === 'assistant') {
          console.log('assistant');
          loadedBooking = this.bookingService.getBookingsByAssistant(currenctUser.uid);
        } else {
          console.log('client');
          loadedBooking = this.bookingService.getBookingsByClient(currenctUser.uid);
        }
        loadedBooking.subscribe((res) => {
          console.log(res);
        });
      });
    }
  }

  ionViewWillEnter() {

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
