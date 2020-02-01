import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { UsersService } from 'src/app/users/users.service';
import { switchMap } from 'rxjs/operators';
import { of, Observable, Subscription } from 'rxjs';
import { Users } from 'src/app/users/users';
import { UploadProfilePictureComponent } from '../upload-profile-picture/upload-profile-picture.component';
import { PlaceLocation } from 'src/app/services/location';
import { ProfilesService } from '../profiles.service';
import { ModalController } from '@ionic/angular';
import { ClassificationsService } from 'src/app/classifications/classifications.service';
import { Classifications } from 'src/app/classifications/classifications';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit, OnDestroy {
  user: firebase.User;
  users: Users;
  location: PlaceLocation;
  isLoading: boolean;
  classifications: Observable<Classifications[]>;
  selectedClassification: string;
  selectedExperience: string;
  private authSub: Subscription;
  private userSub: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private profileService: ProfilesService,
    private modalCtrl: ModalController,
    private classificationsService: ClassificationsService,
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    this.authSub = this.authService.getUserState().pipe(
      switchMap(user => {
        if (user) {
          this.user = user;
          return this.userService.getUser(user.uid);
        } else {
          return of(null);
        }
      })
    ).subscribe((users) => {
        this.isLoading = false;
        this.users = users;
        this.userSub = this.userService.getUser(this.user.uid)
        .subscribe((detail) => {
          this.selectedExperience = detail.skills.level;
          this.selectedClassification = detail.skills.name;
          this.location = detail.location;
        }
      );
    });

    this.classifications = this.classificationsService.getClassifications();
  }

  onLocationPicked(selectedLocation: PlaceLocation, userId: string) {
    this.userService.setLocation(selectedLocation, userId)
      .then(() => {
        this.profileService.getSetLocations(userId)
          .subscribe((location) => {
            this.location = location;
          }
        );
      }
    );
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
          this.userService.getUser(this.user.uid).subscribe((profile) => {
            this.users.photoURL = profile.photoURL;
          });
        }
      });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
