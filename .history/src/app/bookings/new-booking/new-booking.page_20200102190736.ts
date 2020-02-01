import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Plugins, Capacitor } from '@capacitor/core';


import { environment } from '../../../environments/environment';
import { PlaceLocation, Coordinates } from '../../services/location';
import { MapModalComponent } from '../../shared/map-modal/map-modal.component';
import { UsersService } from '../../users/users.service';
import { Users } from './../../users/users';
import { OffersService } from '../../services/offers/offers.service';
import { Offers } from 'src/app/services/offers/offers';
import { CreateBookingComponent } from '../create-booking/create-booking.component';
import { BookingsService } from '../bookings.service';

interface Schedule {
  datePicked: string;
  timePicked: string;
}

interface Assistant {
  assisstantId: string;
  offerId: string;
}

@Component({
  selector: 'app-new-booking',
  templateUrl: './new-booking.page.html',
  styleUrls: ['./new-booking.page.scss'],
})
export class NewBookingPage implements OnInit {
  public users$: Observable<Users[]>;
  public offers$: Observable<Offers[]>;

  selectedSegment: string;
  /** set variable for locations */
  selectedLocationImage: string;
  locationSelected: PlaceLocation;

  /** set variable for assistant and services */
  assistant: Assistant;
  assistantId: string;
  userInfo: Users;
  offerInfo: Offers;
  isNextAssistant = true;
  isSelectedAssistant = false;
  isSelectedOffer = false;

  /** et variable for schedule */
  schedule: Schedule;
  isNextSchedule = true;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private alertCtrl: AlertController,
    private usersService: UsersService,
    private offersService: OffersService,
    private bookingsService: BookingsService
  ) {}

  ngOnInit() {
    this.selectedSegment = this.onGetSegment() ? this.onGetSegment() : 'location';

    this.locationSelected = this.getLocation();

    this.users$ = this.usersService.getUsersByRole('assistant');

    this.assistant = this.getAssistant();
    if (this.assistant) {
      this.isNextAssistant = false;
      this.prePopulateAssistant(this.assistant);
    }

    this.schedule = this.getSchedule();
    if (this.schedule) {
      this.isNextSchedule = false;
      this.prePopulateSchedule(this.schedule);
    }
  }

  onPickedAssistant(userId: string) {
    this.isSelectedAssistant = true;
    this.offers$ = this.offersService.getMyOffers(userId);
  }

  onPickedService(serviceId: string) {
    this.isSelectedOffer = true;

    this.offersService.getOffer(serviceId).subscribe((offer) => {
      const assistantData = {
        assisstantId: offer.userId,
        offerId: offer.id
      };
      localStorage.setItem('assistant', JSON.stringify(assistantData));
      this.prePopulateAssistant(assistantData);
      this.isNextAssistant = false;
    });
  }

  prePopulateSchedule(schedule: Schedule) {
    this.schedule = schedule;
  }

  prePopulateAssistant(assistant: Assistant) {
    this.usersService.getUser(assistant.assisstantId).subscribe((user) => {
      this.userInfo = user;
    });

    this.offersService.getOffer(assistant.offerId).subscribe((offer) => {
      this.offerInfo = offer;
    });
  }

  segmentChanged(ev: any) {
    this.onSetSegment(ev.detail.value);
  }

  onPrev(target: string) {
    this.onSetSegment(target);
  }

  onNext(target: string) {
    this.onSetSegment(target);
  }

  onGetSegment() {
    return localStorage.getItem('segment');
  }

  onSetSegment(target: string) {
    localStorage.setItem('segment', target);
    this.selectedSegment = target;
  }

  getSchedule() {
    return JSON.parse(localStorage.getItem('schedule'));
  }

  onOpenDatePicker() {
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedOffer: this.offerInfo }
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        if (resultData.role === 'confirm') {
          this.setSchedule(resultData.data.scheduleDateTime);
          this.prePopulateSchedule(resultData.data.scheduleDateTime);
        }
      });
  }

  setSchedule(scheduled: any) {
    localStorage.setItem('schedule', JSON.stringify(scheduled));
  }

  getAssistant() {
    return JSON.parse(localStorage.getItem('assistant'));
  }

  getLocation() {
    return JSON.parse(localStorage.getItem('location'));
  }

  setLocation(location: any) {
    localStorage.setItem('location', location);
  }

  onChangeLocation() {
    this.locationSelected = null;
    localStorage.removeItem('location');
  }

  onLocateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }

    Plugins.Geolocation.getCurrentPosition()
      .then(geoPosition => {
        const coordinates: Coordinates = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude
        };
        this.createPlace(coordinates.lat, coordinates.lng);
      })
      .catch(err => {
        this.showErrorAlert();
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

  onOpenMap() {
    this.modalCtrl.create({ component: MapModalComponent }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
        const coordinates: Coordinates = {
          lat: modalData.data.lat,
          lng: modalData.data.lng
        };
        this.createPlace(coordinates.lat, coordinates.lng);
      });
      modalEl.present();
    });
  }

  private createPlace(latitude: number, longitude: number) {
    const pickedLocation: PlaceLocation = {
      lat: latitude,
      lng: longitude,
      address: null,
      staticMapImageUrl: null
    };

    this.getAddress(latitude, longitude)
      .pipe(
        switchMap(address => {
          pickedLocation.address = address;
          return of(
            this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14)
          );
        })
      )
      .subscribe(staticMapImageUrl => {
        pickedLocation.staticMapImageUrl = staticMapImageUrl;
        this.selectedLocationImage = staticMapImageUrl;
        this.setLocation(JSON.stringify(pickedLocation));
        this.locationSelected = this.getLocation();
      });
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

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${environment.googleMapsApiKey}`;
  }

  onPayment() {
    this.bookingsService.paymentProcess();
  }

  onPaymentLater() {

  }

  onCancel() {

  }
}
