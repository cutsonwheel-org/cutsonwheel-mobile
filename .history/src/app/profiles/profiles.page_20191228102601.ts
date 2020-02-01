import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UsersService } from '../users/users.service';
import { UploadProfilePictureComponent } from './upload-profile-picture/upload-profile-picture.component';
import { PlaceLocation } from '../services/location';
import { ServicesService } from '../services/services.service';
import { Services } from '../services/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.page.html',
  styleUrls: ['./profiles.page.scss'],
})
export class ProfilesPage implements OnInit, AfterViewInit {
  form: FormGroup;
  user: firebase.User;
  location: PlaceLocation;
  selectedSegment: string;
  isLoading: boolean;
  notifications: any[];
  experiences: any[];
  visibilities: any[];
  services: Observable<Services[]>;
  visibilityControlObj: FormControl;

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private modalCtrl: ModalController,
    private servicesService: ServicesService,
  ) {
    this.selectedSegment = 'account';
    this.isLoading = false;
  }

  ngOnInit() {
    this.isLoading = true;
    this.authService.getUserState().subscribe((user) => {
      if (user) {
        this.isLoading = false;
        this.user = user;
        this.getLocation(this.user.uid);
      }
    });

    this.services = this.servicesService.getCategories();

    this.notifications = [
      { val: 'send-push-notification', label: 'Send push notification', isChecked: true },
      { val: 'send-for-invitations', label: 'Send an email for invitations', isChecked: false },
      { val: 'send-events-updates', label: 'Send an email events and updates', isChecked: false }
    ];

    this.experiences = [
      { val: 'entry', label: 'Entry', isSelected: true },
      { val: 'intermediate', label: 'Intermediate', isSelected: false },
      { val: 'expert', label: 'Expert', isSelected: false }
    ];

    this.visibilities = [
      { val: 'public', label: 'Public', isSelected: true },
      { val: 'private', label: 'Private', isSelected: false }
    ];

    this.visibilityControlObj = new FormControl(this.visibilities);
  }

  ngAfterViewInit() {
    this.visibilityControlObj.setValue(this.visibilities);
  }

  // compareWithFn = (o1, o2) => {
  //   return o1 && o2 ? o1.id === o2.id : o1 === o2;
  // };

  compareWithVisibility(c1: {val: string}, c2: {val: string}): boolean {
    return c1.val === c2.val;
  }

  getLocation(userId: string) {
    this.userService.getUser(userId).subscribe((detail) => {
      this.location = detail.location;
    });
  }

  segmentChanged(ev: any) {
    this.selectedSegment = ev.detail.value;
  }

  onLocationPicked(selectedLocation: PlaceLocation) {
    this.userService.setLocation(selectedLocation, this.user.uid).then(() => {
      this.getLocation(this.user.uid);
    });
  }

  onSetSettings(setings: any) {
    console.log(setings);
    // this.userService.setLocation(selectedLocation, this.user.uid).then(() => {
    //   this.getLocation(this.user.uid);
    // });
  }

  onImagePicked() {
    this.modalCtrl
      .create({
        component: UploadProfilePictureComponent
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      });
  }
}
