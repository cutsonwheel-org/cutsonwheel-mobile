import { Component, OnInit, Renderer2, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { LocationService } from '../../services/location.service';
import { PlaceLocation, Coordinates } from '../../../services/location';


declare var google;

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss'],
})
export class DirectionsComponent implements OnInit, AfterViewInit {
  @ViewChild('map', { static: false }) mapElementRef: ElementRef;
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  @Input() latitude: number;
  @Input() longitude: number;
  center: {};
  googleMaps: any;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private renderer: Renderer2,
    private locationService: LocationService
  ) { }

  ngOnInit() {
    console.log(this.navParams.get('latitude'));
  }

  ngAfterViewInit() {

    this.locationService.currentLocation().then((geoPosition) => {
      const coordinates: Coordinates = {
        lat: geoPosition.coords.latitude,
        lng: geoPosition.coords.longitude
      };
      this.center = coordinates;
    });

    this.locationService.getGoogleMaps()
    .then(googleMaps => {
      this.googleMaps = googleMaps;

      const mapEl = this.mapElementRef.nativeElement;
      const mapView = new googleMaps.Map(mapEl, {
        center: this.center,
        zoom: 7
      });

      this.directionsDisplay.setMap(mapView);

      // this.googleMaps.event.addListenerOnce(mapView, 'idle', () => {
      //   this.renderer.addClass(mapEl, 'visible');
      // });

      // const marker = new googleMaps.Marker({
      //   position: this.center,
      //   map: mapView,
      //   title: 'Picked Location'
      // });
      // marker.setMap(mapView);

    })
    .catch(err => {
      console.log(err);
    });
  }

  calculateAndDisplayRoute() {
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
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }
}
