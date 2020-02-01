import { Component, OnInit, Input } from '@angular/core';
import { Bookings } from '../bookings';
import { OffersService } from 'src/app/services/offers/offers.service';
import { Offers } from 'src/app/services/offers/offers';

@Component({
  selector: 'app-booking-item',
  templateUrl: './booking-item.component.html',
  styleUrls: ['./booking-item.component.scss'],
})
export class BookingItemComponent implements OnInit {
  @Input() booking: Bookings;
  @Input() role: string;

  offer: any;

  constructor(
    private offersService: OffersService
  ) { }

  ngOnInit() {
    console.log(this.booking.assistant.offerId);
    this.offersService.getOffer(this.booking.assistant.offerId).subscribe((offer) => {
      this.offer = offer;
      console.log(offer);
    });
    console.log(this.role);
  }

}
