import { Component, OnInit, Input } from '@angular/core';
import { Bookings } from '../bookings';
import { OffersService } from 'src/app/services/offers/offers.service';
import { Offers } from 'src/app/services/offers/offers';
import { map } from 'rxjs/operators';
import { UsersService } from 'src/app/users/users.service';
import { Users } from 'src/app/users/users';

@Component({
  selector: 'app-booking-item',
  templateUrl: './booking-item.component.html',
  styleUrls: ['./booking-item.component.scss'],
})
export class BookingItemComponent implements OnInit {
  @Input() booking: Bookings;
  @Input() isAssistantRole: boolean;

  offer: Offers;
  fullname: string;
  lbl: string;
  user: Users;

  constructor( ) { }

  ngOnInit() { }
}
