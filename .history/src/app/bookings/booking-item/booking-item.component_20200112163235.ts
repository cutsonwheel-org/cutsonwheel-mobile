import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Bookings } from '../bookings';
import { AuthService } from 'src/app/auth/auth.service';
import { LoadingController } from '@ionic/angular';
import { BookingsService } from '../bookings.service';
import { UsersService } from 'src/app/users/users.service';

@Component({
  selector: 'app-booking-item',
  templateUrl: './booking-item.component.html',
  styleUrls: ['./booking-item.component.scss'],
})
export class BookingItemComponent implements OnInit {
  @Input() booking: Bookings;
  @Output() wasCanceled = new EventEmitter<boolean>();

  userId: string;
  isAssistant: boolean;

  constructor(
    private authsService: AuthService,
    private loadingCtrl: LoadingController,
    private bookingsService: BookingsService,
    private userService: UsersService
  ) {
    this.isAssistant = false;
  }

  ngOnInit() {
    const user = this.authsService.getUsersProfile();
    if (user) {
      this.userId = user.uid;
      this.userService.getUser(user.uid).subscribe((profile) => {
        this.isAssistant = profile.roles.assistant;
      });
    }
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
}
