import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { OffersService } from '../offers.service';
import { Offers } from '../offers';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss']
})
export class OfferBookingsPage implements OnInit, OnDestroy {
  offer: Offers;
  private offerSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private offersService: OffersService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('offerId')) {
        this.navCtrl.navigateBack('/t/places/offers');
        return;
      }
      this.offerSub = this.offersService
        .getOffer(paramMap.get('offerId'))
        .subscribe(offer => {
          this.offer = offer;
        });
    });
  }

  ngOnDestroy() {
    if (this.offerSub) {
      this.offerSub.unsubscribe();
    }
  }
}
