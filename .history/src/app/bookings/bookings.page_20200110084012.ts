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
  isAssistant: boolean;
  userInfo: any;
  public selectedSegment: string;
  public loadedBookings$: Observable<Bookings[]>;

  constructor(
    private bookingService: BookingsService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private userService: UsersService,
    private router: Router
  ) {
    this.selectedSegment = 'pending';
  }

  ngOnInit() {

    const currenctUser = this.authService.getUsersProfile();
    if (currenctUser) {
      this.userService.getUser(currenctUser.uid).subscribe((profile) => {
        this.userInfo = { ...profile, ...currenctUser };
        this.isAssistant = this.userInfo.roles.assistant;

        this.populateBookings(this.userInfo, 'pending');
      });
    }
  }

  private populateBookings(user: any, status: string) {
    let loadedBooking;
    if (user.roles.assistant) {
      /** assistant */
      loadedBooking = this.getAssistantBookings(user.uid, status);
    } else {
      /** client */
      loadedBooking = this.getClientBookings(user.uid, status);
    }
    this.loadedBookings$ = loadedBooking;
  }

  private getAssistantBookings(userId: string, status: string) {
    return this.bookingService.getByAssistantId(userId, status);
  }

  private getClientBookings(userId: string, status: string) {
    return this.bookingService.getByClientId(userId, status);
  }

  ionViewWillEnter() {

  }

  segmentChanged(ev: any, user: any) {
    this.selectedSegment = ev.detail.value;
    this.populateBookings(user, ev.detail.value);
  }

  onViewBooking(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.router.navigateByUrl('/t/bookings/booking-detail/' + bookingId);
  }

  // onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
  //   slidingEl.close();
  //   this.loadingCtrl.create({ message: 'Cancelling...' }).then(loadingEl => {
  //     loadingEl.present();
  //     this.bookingService.deleteBooking(bookingId).then(() => {
  //       loadingEl.dismiss();
  //     });
  //   });
  // }

}
