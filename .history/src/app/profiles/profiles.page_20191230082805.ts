import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { UsersService } from '../users/users.service';
import { ServicesService } from '../services/services.service';
import { Services } from '../services/services';
import { Observable } from 'rxjs';
import { ImagePickerModalComponent } from '../shared/pickers/image-picker/image-picker-modal/image-picker-modal.component';

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
        this.getNotification(this.user.uid);
        this.getSetting(this.user.uid);
      }
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

  getLocation(userId: string) {
    this.userService.getUser(userId).subscribe((detail) => {
      this.location = detail.location;
    });
  }

  getNotification(userId: string) {
    this.userService.getUser(userId).subscribe((detail) => {
      this.notifications = detail.notification ? detail.notification : this.notifications;
    });
  }

  getSetting(userId: string) {
    this.userService.getUser(userId).subscribe((detail) => {
      this.selectedExperience = detail.experience ? detail.experience : 'entry';
      this.selectedVisibility = detail.visibility ? detail.visibility : 'public';
      this.selectedClassification = detail.classification ? detail.classification : '';
    });
  }

  segmentChanged(ev: any) {
    this.selectedSegment = ev.detail.value;
  }

  classificationChanged(ev: any) {
    this.userService.setClassification(ev.target.value, this.user.uid).then(() => {
      this.showToast('Classification updated.');
    });
  }

  visibilityChanged(ev: any) {
    this.userService.setVisibility(ev.detail.value, this.user.uid).then(() => {
      this.showToast('Visibility updated.');
    });
  }

  experienceChanged(ev: any) {
    this.userService.setExpirience(ev.detail.value, this.user.uid).then(() => {
      this.showToast('Experience level updated.');
    });
  }

  notificationSelect(ev: any) {
    this.userService.setNotification(this.notifications, this.user.uid).then(() => {
      this.showToast('Notificaiton updated.');
    });
  }

  onLocationPicked(selectedLocation: PlaceLocation) {
    this.userService.setLocation(selectedLocation, this.user.uid).then(() => {
      this.getLocation(this.user.uid);
    });
  }

  onImagePicked() {
    this.modalCtrl
      .create({
        component: ImagePickerModalComponent
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
