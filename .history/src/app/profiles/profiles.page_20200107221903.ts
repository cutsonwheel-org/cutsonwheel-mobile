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
  experiences: any[];
  selectedExperience: string;
  visibilities: any[];
  selectedVisibility: string;

  services: Observable<Services[]>;
  selectedClassification: string;

  userInfo: any;

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private modalCtrl: ModalController,
    private servicesService: ServicesService,
    private toastCtrl: ToastController,
    private profileService: ProfilesService
  ) {
    this.selectedSegment = 'account';
    this.isLoading = true;
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

        this.userInfo = { ...profile, ...this.user };

        this.getLocation(this.userInfo.uid).subscribe((location) => {
          this.location = location;
        });
        this.getNotification(this.userInfo.uid).subscribe((detail) => {
          this.notifications = detail.notification ? detail.notification : this.notifications;
        });
        this.getSetting(this.userInfo.uid).subscribe((detail) => {
          this.selectedExperience = detail.experience ? detail.experience : 'entry';
          this.selectedVisibility = detail.visibility ? detail.visibility : 'public';
          this.selectedClassification = detail.classification ? detail.classification : '';
        });
    });

    this.services = this.servicesService.getCategories();

    this.notifications = [
      { val: 'send-push-notification', label: 'Send push notification', isChecked: true },
      { val: 'send-for-invitations', label: 'Send an email for invitations', isChecked: true },
      { val: 'send-events-updates', label: 'Send an email events and updates', isChecked: true }
    ];

    this.experiences = [
      { val: 'entry', label: 'Entry' },
      { val: 'intermediate', label: 'Intermediate' },
      { val: 'expert', label: 'Expert' }
    ];

    this.visibilities = [
      { val: 'public', label: 'Public' },
      { val: 'private', label: 'Private' }
    ];

  }

  getAvatar(userId: string): Observable<Users> {
    return this.userService.getUser(userId);
  }

  getLocation(userId: string): Observable<PlaceLocation> {
    return this.profileService.getSetLocations(this.userInfo.uid);
  }

  getNotification(userId: string): Observable<any> {
    return this.userService.getUser(userId);
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
      this.showToast('Notificaiton updated.');
      this.getNotification(userId).subscribe((detail) => {
        this.notifications = detail.notification ? detail.notification : this.notifications;
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
          this.getAvatar(this.userInfo.uid).subscribe((profile) => {
            this.userInfo = { ...profile, ...this.user };
            console.log(this.userInfo);
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
