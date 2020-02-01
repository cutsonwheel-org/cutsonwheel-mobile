import { Component, OnInit, Renderer2, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { LocationService } from '../../services/location.service';
import { PlaceLocation, Coordinates } from '../../../services/location';

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

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private renderer: Renderer2,
    private locationService: LocationService
  ) { }

  ngOnInit() {
    console.log(this.navParams.get('latitude'));
    this.locationService.currentLocation().then((geoPosition) => {
      const coordinates: Coordinates = {
        lat: geoPosition.coords.latitude,
        lng: geoPosition.coords.longitude
      };
      this.center = coordinates;
    });
  }

  ngAfterViewInit() {

    console.log(this.center);
    this.locationService.getGoogleMaps()
    .then(googleMaps => {
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef.nativeElement;
      const mapView = new googleMaps.Map(mapEl, {
        center: this.center,
        zoom: 16
      });

      this.googleMaps.event.addListenerOnce(mapView, 'idle', () => {
        this.renderer.addClass(mapEl, 'visible');
      });

      const marker = new googleMaps.Marker({
        position: this.center,
        map: mapView,
        title: 'Picked Location'
      });
      marker.setMap(mapView);

    })
    .catch(err => {
      console.log(err);
    });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }
}
