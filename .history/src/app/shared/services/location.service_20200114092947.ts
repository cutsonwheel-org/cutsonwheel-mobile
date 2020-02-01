import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';
import { environment } from './../../../environments/environment';

import { PlaceLocation, Coordinates } from './../../services/location';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  center = {};
  googleMaps: any;
  location: PlaceLocation;

  constructor(
    private alertCtrl: AlertController,
    private http: HttpClient
  ) { }

  currentLocation() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }
    return Plugins.Geolocation.getCurrentPosition();
  }

  getAddress(lat: number, lng: number) {
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

  private showErrorAlert() {
    this.alertCtrl
      .create({
        header: 'Could not fetch location',
        message: 'Please use the map to pick a location!',
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
}
