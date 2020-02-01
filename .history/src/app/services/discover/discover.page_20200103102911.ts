import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Observable, of } from 'rxjs';

import { Offers } from '../offers/offers';
import { OffersService } from '../offers/offers.service';

import { Plugins, Capacitor } from '@capacitor/core';
import { PlaceLocation, Coordinates } from '../../services/location';
import { AlertController } from '@ionic/angular';
import { switchMap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UsersService } from '../../users/users.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit {
  public isLoading: boolean;
  public offers$: Observable<Offers[]>;
  user: firebase.User;

  get offersData() {
    return this.offersService.getOffers('');
  }

  constructor(
    private offersService: OffersService,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private http: HttpClient,
    private userService: UsersService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoading = false;
  }

  ngOnInit() {
    this.offers$ = this.offersData;
    this.user = this.authService.getUsersProfile();
    if (this.user) {
      this.userService.getUser(this.user.uid).subscribe((detail) => {
        if (!detail.location) {
          this.alertCtrl
            .create({
              header: 'Location error',
              message: 'Please update your location!',
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    this.router.navigateByUrl('/t/profiles');
                  }
                }
              ]
            })
            .then(alertEl => alertEl.present());
        }
      });
    }
  }

  ionViewWillEnter() {
    this.offers$ = this.offersData;
  }

  onOpenMenu() {
    this.menuCtrl.toggle();
  }

  onClear(ev: any) {
    console.log(ev);
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
