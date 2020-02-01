import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription, Observable } from 'rxjs';

import { PlacesService } from '../places.service';

import { AuthService } from '../../auth/auth.service';
import { Places } from '../places';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {
  // loadedPlaces: Places[];
  listedLoadedPlaces: Places[];
  // relevantPlaces: any;
  public relevantPlaces: Observable<Places[]>;
  isLoading = false;
  private placesSub: Subscription;
  public loadedPlaces: Observable<Places[]>;

  constructor(
    private placesService: PlacesService,
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.relevantPlaces = this.placesService.getOffers();
    for (const offer of this.relevantPlaces) {
      console.log(offer.id);
    }
    // this.listedLoadedPlaces = this.relevantPlaces.slice(1);

    // this.placesSub = this.placesService.places.subscribe(places => {
    //   this.loadedPlaces = places;
    //   this.relevantPlaces = this.loadedPlaces;
    //   this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    // });
  }

  // ionViewWillEnter() {
  //   this.isLoading = true;
  //   this.placesService.fetchAllPlaces().subscribe(() => {
  //     this.isLoading = false;
  //   });
  // }

  onOpenMenu() {
    this.menuCtrl.toggle();
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    this.authService.userId.pipe(take(1)).subscribe(userId => {
      if (event.detail.value === 'all') {
        this.relevantPlaces = this.loadedPlaces;
        this.listedLoadedPlaces = this.relevantPlaces.slice(1);
      } else {
        // this.relevantPlaces = this.loadedPlaces.filter(
        //   place => place.userId !== userId
        // );
        this.listedLoadedPlaces = this.relevantPlaces.slice(1);
      }
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
