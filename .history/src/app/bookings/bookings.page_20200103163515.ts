import { Component, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Bookings } from './bookings';
import { BookingsService } from './bookings.service';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { TabsPagePage } from '../tabs-page/tabs-page.page';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss']
})
export class BookingsPage extends TabsPagePage implements OnInit {
  isLoading = false;
  userInfo: any;

  public loadedBookings$: Observable<Bookings[]>;

  constructor(
    private bookingService: BookingsService,
    private loadingCtrl: LoadingController,
    public authService: AuthService,
    public userService: UsersService
  ) {
    super(authService, userService);
  }

  ngOnInit() {
    super.ngOnInit();
    console.log(this.userInfo.profile.role);
    // let loadedBooking;
    // const currenctUser = this.authService.getUsersProfile();
    // if (currenctUser) {
    //   this.userService.getUser(currenctUser.uid).subscribe((profile) => {
    //     this.userInfo = { profile, ...currenctUser };
    //     if (this.userInfo.profile.role === 'assistant') {
    //       console.log('assistant');
    //       loadedBooking = this.bookingService.getBookingsByAssistant(currenctUser.uid);
    //     } else {
    //       console.log('client');
    //       loadedBooking = this.bookingService.getBookingsByClient(currenctUser.uid);
    //     }
    //     this.loadedBookings$ = loadedBooking;
    //     loadedBooking.subscribe((res) => {
    //       console.log(res);
    //     });
    //   });
    // }
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
