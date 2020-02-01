import { Component, OnInit, Renderer2, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss'],
})
export class DirectionsComponent implements OnInit, AfterViewInit {
  @ViewChild('map', { static: false }) mapElementRef: ElementRef;
  @Input() center = { lat: 14.599512, lng: 120.984222 };
  googleMaps: any;

  constructor(
    private modalCtrl: ModalController,
    private renderer: Renderer2,
    private locationService: LocationService
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
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
