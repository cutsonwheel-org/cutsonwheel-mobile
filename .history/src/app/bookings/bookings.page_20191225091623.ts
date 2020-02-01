import { Component, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Bookings } from './bookings';
import { BookingsService } from './bookings.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss']
})
export class BookingsPage implements OnInit {
  isLoading = false;
  public loadedBookings: Observable<Bookings[]>;

  get bookingData() {
    return this.bookingService.getBookings('');
  }

  constructor(
    private bookingService: BookingsService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loadedBookings = this.bookingData;
  }

  // ionViewWillEnter() {
  //   this.isLoading = true;
  //   this.bookingData.subscribe((res) => {
  //     this.isLoading = false;
  //   });
  // }

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
