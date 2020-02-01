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
    const searchTerm = event.detail.value;
    console.log(searchTerm);
    if (!searchTerm) {
      return;
    }
    // this.relevantPlaces = this.relevantPlaces.filter(currentGoal => {
    //   if (currentGoal.goalName && searchTerm) {
    //     if (currentGoal.goalName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
    //       return true;
    //     }
    //     return false;
    //   }
    // });

    this.relevantPlaces.pipe(
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
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
