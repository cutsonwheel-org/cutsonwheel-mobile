import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UsersService } from '../users/users.service';
import { UploadProfilePictureComponent } from './upload-profile-picture/upload-profile-picture.component';
import { PlaceLocation } from '../services/location';

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
  pointLocation: any;

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private modalCtrl: ModalController,
  ) {
    this.selectedSegment = 'settings';
  }

  ngOnInit() {
    this.user = this.authService.getUsersProfile();
    this.getLocation(this.user.uid);
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
    this.pointLocation = selectedLocation;
    this.userService.setLocation(selectedLocation, this.user.uid).then(() => {
      this.getLocation(this.user.uid);
    });
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
