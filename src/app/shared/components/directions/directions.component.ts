import { Component, OnInit, Renderer2, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { LocationService } from '../../services/location.service';
import { PlaceLocation, Coordinates } from '../../../services/location';

import { Plugins, Capacitor } from '@capacitor/core';
declare var google;

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss'],
})
export class DirectionsComponent implements OnInit, AfterViewInit {
  @ViewChild('map', { static: false }) mapElementRef: ElementRef;
  @Input() latitude: number;
  @Input() longitude: number;
  center: {};
  googleMaps: any;
  directionsDisplay: any;
  directionsService: any;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private renderer: Renderer2,
    private locationService: LocationService
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      return;
    }

    Plugins.Geolocation.watchPosition({timeout: 30000, enableHighAccuracy: true}, (position) => {
      if (position) {
        const coordinates: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.center = coordinates;
      }
    });

    this.locationService.getGoogleMaps()
    .then(googleMaps => {
      this.googleMaps = googleMaps;

      this.directionsService = new googleMaps.DirectionsService();
      this.directionsDisplay = new googleMaps.DirectionsRenderer();

      const mapEl = this.mapElementRef.nativeElement;
      const mapView = new googleMaps.Map(mapEl, {
        center: this.center,
        zoom: 7
      });

      this.googleMaps.event.addListenerOnce(mapView, 'idle', () => {
        this.renderer.addClass(mapEl, 'visible');
      });

      this.directionsDisplay.setMap(mapView);

      this.directionsService.route({
        origin: this.center,
        destination: {
          lat: this.navParams.get('latitude'),
          lng: this.navParams.get('longitude')
        },
        travelMode: 'DRIVING'
      }, (response, status) => {
        if (status === 'OK') {
          this.directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });

    })
    .catch(err => {
      console.log(err);
    });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }
}
