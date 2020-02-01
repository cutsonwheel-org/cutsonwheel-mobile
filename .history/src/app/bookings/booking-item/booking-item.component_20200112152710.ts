import { Component, OnInit, Input } from '@angular/core';
import { Bookings } from '../bookings';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-booking-item',
  templateUrl: './booking-item.component.html',
  styleUrls: ['./booking-item.component.scss'],
})
export class BookingItemComponent implements OnInit {
  @Input() booking: Bookings;

  userId: string;

  constructor(
    private authsService: AuthService
  ) { }

  ngOnInit() {
    const user = this.authsService.getUsersProfile();
    if (user) {
      this.userId = user.uid;
    }
  }

  onCancel(bookingId: string) {
    console.log(bookingId);
  }
}
