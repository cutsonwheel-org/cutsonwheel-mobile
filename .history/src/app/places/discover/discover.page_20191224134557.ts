import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription, Observable } from 'rxjs';

import { PlacesService } from '../places.service';

import { AuthService } from '../../auth/auth.service';
import { Places } from '../places';
import { take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit {
  public isLoading: boolean;
  public loadedPlaces: Observable<Places[]>;

  get offersData() {
    return this.placesService.getOffers('');
  }

  constructor(
    private placesService: PlacesService,
    private menuCtrl: MenuController
  ) {
    this.isLoading = false;
  }

  ngOnInit() {
    this.loadedPlaces = this.offersData;
  }

  ionViewWillEnter() {
    this.loadedPlaces = this.offersData;
  }

  onOpenMenu() {
    this.menuCtrl.toggle();
  }

  onClear() {
    this.loadedPlaces = this.offersData;
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    const searchTerm = event.detail.value;
    if (!searchTerm) {
      this.loadedPlaces = this.offersData;
    }
    this.loadedPlaces = this.placesService.getOffers(searchTerm);
  }

}
