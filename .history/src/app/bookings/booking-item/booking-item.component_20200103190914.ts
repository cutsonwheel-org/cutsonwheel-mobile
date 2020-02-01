import { Component, OnInit, Input } from '@angular/core';
import { Bookings } from '../bookings';

@Component({
  selector: 'app-booking-item',
  templateUrl: './booking-item.component.html',
  styleUrls: ['./booking-item.component.scss'],
})
export class BookingItemComponent implements OnInit {
  @Input() booking: Bookings;
  @Input() role: string;

  constructor() { }

  ngOnInit() {
    console.log(this.role);
  }

}
