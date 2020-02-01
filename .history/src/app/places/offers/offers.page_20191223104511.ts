import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { PlacesService } from '../places.service';
import { Places } from '../places';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit, OnDestroy {
  // offers: Places[];
  isLoading = false;
  private placesSub: Subscription;
  public offers: Observable<Places[]>;

  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit() {
    this.offers = this.placesService.getOffers();
    // this.placesSub = this.placesService.places.subscribe(places => {
    //   this.offers = places;
    // });
  }

  // ionViewWillEnter() {
  //   this.isLoading = true;
  //   this.placesService.fetchPlaces().subscribe(() => {
  //     this.isLoading = false;
  //   });
  // }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/t/', 'places', 'offers', 'edit-offer', offerId]);
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
