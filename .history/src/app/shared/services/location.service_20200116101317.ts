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
    let watch = Plugins.Geolocation.watchPosition({timeout: 30000, enableHighAccuracy: true}, result => {
      if (result && result.coords) {
        this.position = result;
        this.changeDetector.detectChanges();
        Geolocation.clearWatch({id: this.positionWatchId});
        this.positionWatchId = null;
      }
    });

    return Plugins.Geolocation.getCurrentPosition({timeout: 30000, enableHighAccuracy: true});
  }

  watchLocation() {
    let newPosition;
    Plugins.Geolocation.watchPosition({timeout: 30000, enableHighAccuracy: true}, (position) => {
      if (position) {
        newPosition = position.coords;
      }
    });
    return newPosition;
  }

  addNewLocation(lat, lng) {
    this.locationsCollection.add({
      lat,
      lng,
      timestamp
    });

    let position = new google.maps.LatLng(lat, lng);
    this.map.setCenter(position);
    this.map.setZoom(5);
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

  getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${environment.googleMapsApiKey}`;
  }

  getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        environment.googleMapsApiKey;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available.');
        }
      };
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
}
