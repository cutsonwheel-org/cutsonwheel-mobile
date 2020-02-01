import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Bookings } from '../bookings';
import { AuthService } from 'src/app/auth/auth.service';
import { LoadingController } from '@ionic/angular';
import { BookingsService } from '../bookings.service';
import { UsersService } from 'src/app/users/users.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-booking-item',
  templateUrl: './booking-item.component.html',
  styleUrls: ['./booking-item.component.scss'],
})
export class BookingItemComponent implements OnInit, OnDestroy {
  @Input() booking: Bookings;
  @Output() wasCanceled = new EventEmitter<boolean>();

  user: firebase.User;
  isAssistant: boolean;

  private userSub: Subscription;

  constructor(
    private authsService: AuthService,
    private loadingCtrl: LoadingController,
    private bookingsService: BookingsService,
    private userService: UsersService,
    private router: Router
  ) {
    this.isAssistant = false;
  }

  ngOnInit() {
    const user = this.authsService.getUsersProfile();
    if (user) {
      this.user = user;
      this.userSub = this.userService.getUser(user.uid)
        .subscribe((profile) => {
          this.isAssistant = profile.roles.assistant;
        }
      );
    }
  }

  onView(bookingId: string) {
    this.router.navigateByUrl('/t/bookings/booking-detail/' + bookingId);
  }

  onCancel(bookingId: string) {
    this.loadingCtrl
      .create({
        message: 'Updating status...'
      })
      .then(loadingEl => {
        loadingEl.present();
        const booking  = {
          id: bookingId,
          status: 'canceled'
        };
        this.bookingsService.update(booking).then(() => {
            loadingEl.dismiss();
            this.wasCanceled.emit(true);
        });
      });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
