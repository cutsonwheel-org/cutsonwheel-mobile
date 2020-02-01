import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Observable, of, Subscription } from 'rxjs';

import { Offers } from '../offers/offers';
import { OffersService } from '../offers/offers.service';

import { UsersService } from '../../users/users.service';
import { AuthService } from 'src/app/auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { Users } from 'src/app/users/users';
@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {
  public isLoading: boolean;
  /** firestore data */
  public offers$: Observable<Offers[]>;

  user: firebase.User;
  users: Users;
  private authSub: Subscription;

  get offersData() {
    return this.offersService.getAll('');
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

    this.authSub = this.authService.getUserState().pipe(
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
    this.offers$ = this.offersService.getAll(searchTerm);
  }

  separateCategory(record, recordIndex, records) {
    if (recordIndex === 0) {
      return record.title[0].toUpperCase();
    }

    const firstPrev = records[recordIndex - 1].title[0];
    const firstCurrent = record.title[0];

    if (firstPrev !== firstCurrent) {
      return firstCurrent.toUpperCase();
    }

    return null;
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
