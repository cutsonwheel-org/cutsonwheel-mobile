import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Observable } from 'rxjs';

import { Offers } from '../offers/offers';
import { OffersService } from '../offers/offers.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit {
  public isLoading: boolean;
  public offers: Observable<Offers[]>;

  get offersData() {
    return this.offersService.getOffers('');
  }

  constructor(
    private offersService: OffersService,
    private menuCtrl: MenuController
  ) {
    this.isLoading = false;
  }

  ngOnInit() {
    this.offers = this.offersData;
  }

  ionViewWillEnter() {
    this.offers = this.offersData;
  }

  onOpenMenu() {
    this.menuCtrl.toggle();
  }

  onClear() {
    this.offers = this.offersData;
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    const searchTerm = event.detail.value;
    if (!searchTerm) {
      this.offers = this.offersData;
    }
    this.offers = this.offersService.getOffers(searchTerm);
  }

}
