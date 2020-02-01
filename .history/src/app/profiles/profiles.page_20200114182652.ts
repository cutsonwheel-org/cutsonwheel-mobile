import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { UsersService } from '../users/users.service';
import { UploadProfilePictureComponent } from './upload-profile-picture/upload-profile-picture.component';
import { PlaceLocation } from '../services/location';
import { ServicesService } from '../services/services.service';
import { Services } from '../services/services';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ProfilesService } from './profiles.service';
import { Users } from '../users/users';
import { ClassificationsService } from '../classifications/classifications.service';
import { Classifications } from '../classifications/classifications';

export interface Notification {
  val: string;
  label: string;
  isChecked: boolean;
}
@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.page.html',
  styleUrls: ['./profiles.page.scss'],
})
export class ProfilesPage implements OnInit {
  form: FormGroup;
  user: firebase.User;
  location: PlaceLocation;
  notifications: any;
  selectedSegment: string;
  isLoading: boolean;
  isLoadingImage: boolean;
  experiences: any[];
  selectedExperience: string;
  visibilities: any[];
  selectedVisibility: string;

  classifications: Observable<Classifications[]>;
  selectedClassification: string;

  userInfo: any;

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private modalCtrl: ModalController,
    private classificationsService: ClassificationsService,
    private toastCtrl: ToastController,
    private profileService: ProfilesService
  ) {
    this.selectedSegment = 'account';
    this.isLoading = true;
    this.isLoadingImage = true;
  }

  ngOnInit() {
    this.isLoading = true;
    this.authService.getUserState().pipe(
      switchMap(user => {
        if (user) {
          this.user = user;
          return this.userService.getUser(user.uid);
        } else {
          return of(null);
        }
      })
    ).subscribe((profile) => {
        this.isLoading = false;
        this.isLoadingImage = false;
        this.userInfo = { ...profile, ...this.user };

        this.getLocation(this.userInfo.uid).subscribe((location) => {
          this.location = location;
        });
        this.getNotification(this.userInfo.uid).subscribe((notification) => {
          this.notifications = notification;
        });
        this.getSetting(this.userInfo.uid).subscribe((detail) => {
          this.selectedExperience = detail.skills.level ? detail.skills.level : '';
          this.selectedVisibility = detail.visibility ? detail.visibility : 'public';
          this.selectedClassification = detail.skills.name ? detail.skills.name : '';
        });
    });

    this.classifications = this.classificationsService.getClassifications();
  }

  getAvatar(userId: string): Observable<Users> {
    return this.userService.getUser(userId);
  }

  getLocation(userId: string): Observable<PlaceLocation> {
    return this.profileService.getSetLocations(userId);
  }

  getNotification(userId: string): Observable<Notification> {
    return this.profileService.getSetNotifications(userId);
  }

  getSetting(userId: string): Observable<any> {
    return this.userService.getUser(userId);
  }

  segmentChanged(ev: any) {
    this.selectedSegment = ev.detail.value;
  }

  classificationChanged(ev: any, userId: string) {
    this.userService.setClassification(ev.target.value, userId).then(() => {
      this.showToast('Classification updated.');
      this.getSetting(userId).subscribe((detail) => {
        this.selectedClassification = detail.classification;
      });
    });
  }

  visibilityChanged(ev: any, userId: string) {
    this.userService.setVisibility(ev.detail.value, userId).then(() => {
      this.showToast('Visibility updated.');
      this.getSetting(userId).subscribe((detail) => {
        this.selectedVisibility = detail.visibility;
      });
    });
  }

  experienceChanged(ev: any, userId: string) {
    this.userService.setExpirience(ev.detail.value, userId).then(() => {
      this.showToast('Experience level updated.');
      this.getSetting(userId).subscribe((detail) => {
        this.selectedExperience = detail.experience;
      });
    });
  }

  notificationSelect(ev: any, userId: string) {
    this.userService.setNotification(this.notifications, userId).then(() => {
      this.getNotification(userId).subscribe((notification) => {
        this.notifications = notification;
      });
    });
  }

  onLocationPicked(selectedLocation: PlaceLocation, userId: string) {
    this.userService.setLocation(selectedLocation, userId).then(() => {
      this.getLocation(userId).subscribe((location) => {
        this.location = location;
      });
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
      })
      .then(resultData => {
        if (resultData.role === 'success') {
          this.isLoadingImage = true;
          this.getAvatar(this.userInfo.uid).subscribe((profile) => {
            this.isLoadingImage = false;
            this.userInfo = { ...profile, ...this.user };
          });
        }
      });
  }

  private showToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }
}
