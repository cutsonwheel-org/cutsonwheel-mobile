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
    let loadedBooking;
    const currenctUser = this.authService.getUsersProfile();
    if (currenctUser) {
      this.userService.getUser(currenctUser.uid).subscribe((profile) => {
        this.userInfo = { profile, ...currenctUser };
        this.isAssistant = this.userInfo.profile.roles.assistant;
        if (this.userInfo.profile.roles.assistant) {
          /** assistant */
          loadedBooking = this.getAssistantBookings(currenctUser.uid, 'pending'); // this.bookingService.getByAssistantId(currenctUser.uid);
        } else {
          /** client */
          loadedBooking = this.getClientBookings(currenctUser.uid, 'pending'); // this.bookingService.getByClientId(currenctUser.uid);
        }
        this.loadedBookings$ = loadedBooking;
      });
    }
  }

  private getAssistantBookings(userId: string, status: string) {
    return this.bookingService.getByAssistantId(userId, status);
  }

  private getClientBookings(userId: string, status: string) {
    return this.bookingService.getByClientId(userId, status);
  }

  ionViewWillEnter() {

  }

  segmentChanged(ev: any) {
    this.selectedSegment = ev.detail.value;
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
