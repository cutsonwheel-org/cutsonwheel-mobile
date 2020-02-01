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
          // this.locateUser(this.user.uid);
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

  onClear() {
    this.offers$ = this.offersData;
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    const searchTerm = event.detail.value;
    if (!searchTerm) {
      this.offers$ = this.offersData;
    }
    this.offers$ = this.offersService.getOffers(searchTerm);
  }

  // private locateUser(userId: string) {

  //   if (!Capacitor.isPluginAvailable('Geolocation')) {
  //     this.showErrorAlert();
  //     return;
  //   }

  //   Plugins.Geolocation.getCurrentPosition()
  //     .then(geoPosition => {
  //       const coordinates: Coordinates = {
  //         lat: geoPosition.coords.latitude,
  //         lng: geoPosition.coords.longitude
  //       };
  //       this.createPlace(coordinates.lat, coordinates.lng, userId);
  //     })
  //     .catch(err => {
  //       this.showErrorAlert();
  //     });
  // }

  // private showErrorAlert() {
  //   this.alertCtrl
  //     .create({
  //       header: 'Could not fetch location',
  //       message: 'Please use the map to pick a location!',
  //       buttons: ['Okay']
  //     })
  //     .then(alertEl => alertEl.present());
  // }

  // private createPlace(latitude: number, longitude: number, userId: string) {
  //   const pickedLocation: PlaceLocation = {
  //     lat: latitude,
  //     lng: longitude,
  //     address: null,
  //     staticMapImageUrl: null
  //   };
  //   this.isLoading = true;
  //   this.getAddress(latitude, longitude)
  //     .pipe(
  //       switchMap(address => {
  //         pickedLocation.address = address;
  //         return of(
  //           this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14)
  //         );
  //       })
  //     )
  //     .subscribe(staticMapImageUrl => {
  //       pickedLocation.staticMapImageUrl = staticMapImageUrl;
  //       this.userService.setLocation(pickedLocation, userId);
  //     });
  // }

  // private getAddress(lat: number, lng: number) {
  //   return this.http
  //     .get<any>(
  //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
  //         environment.googleMapsApiKey
  //       }`
  //     )
  //     .pipe(
  //       map(geoData => {
  //         if (!geoData || !geoData.results || geoData.results.length === 0) {
  //           return null;
  //         }
  //         return geoData.results[0].formatted_address;
  //       })
  //     );
  // }

  // private getMapImage(lat: number, lng: number, zoom: number) {
  //   return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
  //   &markers=color:red%7Clabel:Place%7C${lat},${lng}
  //   &key=${environment.googleMapsApiKey}`;
  // }
}
