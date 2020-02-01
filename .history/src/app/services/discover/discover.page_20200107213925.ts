import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Observable, of } from 'rxjs';

import { Offers } from '../offers/offers';
import { OffersService } from '../offers/offers.service';

import { UsersService } from '../../users/users.service';
import { AuthService } from 'src/app/auth/auth.service';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit {
  public isLoading: boolean;
  /** firestore data */
  public offers$: Observable<Offers[]>;

  user: firebase.User;
  userInfo: any;

  get offersData() {
    return this.offersService.getOffers('');
  }

  constructor(
    private offersService: OffersService,
    private menuCtrl: MenuController,
    private userService: UsersService,
    private authService: AuthService,
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    this.offers$ = this.offersData;

    this.authService.getUserState().pipe(
      switchMap(user => {
        if (user) {
          this.user = user;
          return this.userService.getUser(user.uid);
        } else {
          return of(null);
        }
      })
    ).subscribe((profile) => {
      this.isLoading = false;
      this.userInfo = { ...profile, ...this.user };
    });
  }

  ionViewWillEnter() {
    this.offers$ = this.offersData;
  }

  onOpenMenu() {
    this.menuCtrl.toggle();
  }

  onClear(ev: any) {
    this.offers$ = this.offersData;
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    const searchTerm = event.detail.value;
    if (!searchTerm) {
      this.offers$ = this.offersData;
    }
    this.offers$ = this.offersService.getOffers(searchTerm);
  }

}
