import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { UsersService } from '../users/users.service';
import { UploadProfilePictureComponent } from './upload-profile-picture/upload-profile-picture.component';
import { PlaceLocation } from '../services/location';
import { ServicesService } from '../services/services.service';
import { Services } from '../services/services';
import { Observable } from 'rxjs';

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
  selectedSegment: string;
  isLoading: boolean;
  notifications: any[];
  experiences: any[];
  selectedExperience: string;
  visibilities: any[];
  selectedVisibility: string;

  services: Observable<Services[]>;
  selectedClassification: string;

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private modalCtrl: ModalController,
    private servicesService: ServicesService,
    private toastCtrl: ToastController
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

    this.selectedExperience = 'entry';
    this.experiences = [
      { val: 'entry', label: 'Entry' },
      { val: 'intermediate', label: 'Intermediate' },
      { val: 'expert', label: 'Expert' }
    ];

    this.selectedVisibility = 'public';
    this.visibilities = [
      { val: 'public', label: 'Public' },
      { val: 'private', label: 'Private' }
    ];

    this.selectedClassification = 'barbers';
  }

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

  classificationChanged(ev: any) {
    // this.selectedSegment = ev.detail.value;
    console.log(ev.detail.value);
  }

  visibilityChanged(ev: any) {
    console.log(ev.detail.value);
  }

  experienceChanged(ev: any) {
    console.log(ev.detail.value);
  }

  notificationSelect(ev: any) {
    // let notification: Notification;
    const marvelHeroes =  this.notifications.filter((notif) => {
      if (notif.val === ev.detail.value) {
        return  ev.currentTarget.checked;
      }
      // return notif.val === ev.detail.value;
    });
    console.log(marvelHeroes);
    // this.notifications.forEach(el => {
    //   console.log();
    //   notifications.push()
    //   notification = {
    //     val: el.val,
    //     label: el.label,
    //     isChecked: ev.currentTarget.checked
    //   };
    //   // notification.push({
    //   //   el.val: ev.detail.value,
    //   //   el.label: ev.currentTarget.title,
    //   //   el.isChecked: ev.currentTarget.checked
    //   // });
    // });

    // this.userService.setNotification(notification, this.user.uid).then(() => {
    //   this.showToast(notification.label + ' set.');
    // });
  }

  onLocationPicked(selectedLocation: PlaceLocation) {
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

  private showToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }
}
