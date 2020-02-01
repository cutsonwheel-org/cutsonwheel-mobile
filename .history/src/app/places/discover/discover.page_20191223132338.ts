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


  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

  const images = [
    'bandit',
    'batmobile',
    'blues-brothers',
    'bueller',
    'delorean',
    'eleanor',
    'general-lee',
    'ghostbusters',
    'knight-rider',
    'mirth-mobile'
  ];

  function getImgSrc() {
    const src = 'https://dummyimage.com/600x400/${Math.round( Math.random() * 99999)}/fff.png';
    rotateImg++;
    if (rotateImg === images.length) {
      rotateImg = 0;
    }
    return src;
  }

  let rotateImg = 0;

  constructor(
    private placesService: PlacesService,
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {}
  items: any[] = [];

  ngOnInit() {
    this.relevantPlaces = this.placesService.getOffers(1000);

    for (let i = 0; i < 1000; i++) {
      this.items.push({
        name: i + ' - ' + images[rotateImg],
        imgSrc: getImgSrc(),
        avatarSrc: getImgSrc(),
        imgHeight: Math.floor(Math.random() * 50 + 150),
        content: lorem.substring(0, Math.random() * (lorem.length - 100) + 100)
      });

      rotateImg++;
      if (rotateImg === images.length) {
        rotateImg = 0;
      }
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
    // this.authService.userId.pipe(take(1)).subscribe(userId => {
      if (event.detail.value === 'all') {
        // this.relevantPlaces = this.loadedPlaces;
        this.relevantPlaces = this.placesService.getOffers(1);
        // this.listedLoadedPlaces = this.placesService.getOffers(1);
      } else {
        this.relevantPlaces = this.placesService.getOffers(1000);
        // this.relevantPlaces = this.loadedPlaces.filter(
        //   place => place.userId !== userId
        // );
        // this.listedLoadedPlaces = this.relevantPlaces.slice(1);
      }
    // });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
