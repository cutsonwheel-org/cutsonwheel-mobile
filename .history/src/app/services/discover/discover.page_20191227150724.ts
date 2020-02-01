import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Observable } from 'rxjs';

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
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private http: HttpClient,
    private userService: UsersService,
    private authService: AuthService
  ) {
    this.isLoading = false;
  }

  ngOnInit() {
    this.offers = this.offersData;
    this.locateUser();
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

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }
    this.authService.getUserState().pipe(
      map(user => {
        return user;
      })
    ).subscribe((u) => {
      if (u) {
        Plugins.Geolocation.getCurrentPosition()
          .then(geoPosition => {
            const coordinates: Coordinates = {
              lat: geoPosition.coords.latitude,
              lng: geoPosition.coords.longitude
            };
            this.getAddress(coordinates.lat, coordinates.lng).subscribe(currentAddress => {
              const user  = {
                id: u.uid,
                address: currentAddress,
                latitude: coordinates.lat,
                longitude: coordinates.lng
              };
              this.userService.setUserLocation(user);
            });
          })
          .catch(err => {
            this.showErrorAlert();
          });
      }
    });
  }

  private showErrorAlert() {
    this.alertCtrl
      .create({
        header: 'Could not fetch location',
        message: 'Please use the map to pick a location!',
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

  private getAddress(lat: number, lng: number) {
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
          environment.googleMapsApiKey
        }`
      )
      .pipe(
        map(geoData => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }
          return geoData.results[0].formatted_address;
        })
      );
  }
}
