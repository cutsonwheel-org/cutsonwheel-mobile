import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FormGroup } from '@angular/forms';
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
export class ProfilesPage implements OnInit {
  form: FormGroup;
  user: firebase.User;
  location: PlaceLocation;
  selectedSegment: string;
  isLoading: boolean;
  notifications: any[];
  experiences: any[];
  services: Observable<Services[]>;

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
      { val: 1, label: 'Send push notification', isChecked: true },
      { val: 1, label: 'Send an email for invitations', isChecked: false },
      { val: 1, label: 'Send an email events and updates', isChecked: false }
    ];

    this.experiences = [
      { val: 1, label: 'Entry', isChecked: true },
      { val: 1, label: 'Intermediate', isChecked: false },
      { val: 1, label: 'Expert', isChecked: false }
    ];
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
