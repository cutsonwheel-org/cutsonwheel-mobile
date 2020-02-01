import { Component, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Bookings } from './bookings';
import { BookingsService } from './bookings.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss']
})
export class BookingsPage implements OnInit {
  isLoading = false;
  public loadedBookings$: Observable<Bookings[]>;

  constructor(
    private bookingService: BookingsService,
    private loadingCtrl: LoadingController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getUsersProfile();
    this.loadedBookings$ = this.bookingService.getBookingsByClient(user.uid);
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
