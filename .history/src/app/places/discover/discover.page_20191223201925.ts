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
  }

  ionViewWillEnter() {
    this.relevantPlaces = this.placesService.getOffers();
  }

  onOpenMenu() {
    this.menuCtrl.toggle();
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail.value);
    const searchTerm = event.detail.value;
    if (!searchTerm) {
      return;
    }
    return this.relevantPlaces.pipe(
        map(items => items.filter(item =>
          console.log(items)
          // item.attending
        )
      ),
    );

    // console.log(place);
    //       if (place.title && searchTerm) {
    //         if (place.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
    //           return true;
    //         }
    //         return false;
    //       }

    // this.authService.userId.pipe(take(1)).subscribe(userId => {
      // if (event.detail.value === 'all') {
      //   // this.relevantPlaces = this.loadedPlaces;
      //   this.relevantPlaces = this.placesService.getOffers();
      //   // this.listedLoadedPlaces = this.placesService.getOffers(1);
      // } else {
      //   this.relevantPlaces = this.placesService.getOffers();
      //   // this.relevantPlaces = this.loadedPlaces.filter(
      //   //   place => place.userId !== userId
      //   // );
      //   // this.listedLoadedPlaces = this.relevantPlaces.slice(1);
      // }
    // });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
