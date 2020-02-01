import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { UsersService } from 'src/app/users/users.service';
import { switchMap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { Users } from 'src/app/users/users';
import { UploadProfilePictureComponent } from './upload-profile-picture/upload-profile-picture.component';
import { PlaceLocation } from 'src/app/services/location';
import { ModalController, PopoverController } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';
import { Classifications } from './../../shared/class/classifications';
import { ClassificationsService } from './../../shared/services/classifications.service';

import { Plugins, CameraResultType, Capacitor, FilesystemDirectory,
  CameraPhoto, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImagePicker } from 'src/app/shared/components/image-picker/image-picker';

const { Camera, Filesystem, Storage } = Plugins;

export interface Photo {
  filepath: string;
  webviewPath: string;
  base64?: string;
}

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
  classifications: Classifications[];
  selectedClassification: string;
  selectedExperience: string;
  private authSub: Subscription;
  private userSub: Subscription;

  image: SafeResourceUrl;
  imagePicker: ImagePicker;
  photos: Photo = {
    filepath: '',
    webviewPath: ''
  };

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  })

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private modalCtrl: ModalController,
    private classificationsService: ClassificationsService,
    private popper: PopoverController,
    private domSanitizer: DomSanitizer
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
        this.getUser(this.user.uid);
    });

    this.classificationsService.getClassifications().subscribe((classifications) => {
      this.classifications = classifications;
    });
  }

  getUser(userId: string) {
    this.userSub = this.userService.getUser(userId)
      .subscribe((detail) => {
        this.selectedExperience = (detail.skills) ? detail.skills.level : '';
        this.selectedClassification = (detail.skills) ? detail.skills.name : '';
        this.location = detail.location;
      }
    );
  }

  presentPopover(e: CustomEvent) {
    this.popper.create({
      component: PopoverComponent,
      event: e
    }).then((popoverEl) => {
      popoverEl.present();
    });
  }

  onLocationPicked(selectedLocation: PlaceLocation, userId: string) {
    const data = {
      id: userId,
      location: selectedLocation
    };
    this.userService.update(data)
      .then(() => {
        this.getUser(userId);
      }
    );
  }

  onImagePicked(event: CustomEvent) {
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
          this.getPhotoUrl(this.user.uid);
        }
      });
  }

  async onTakePicture() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      saveToGallery: true,
      source: CameraSource.Camera,
      quality: 100,
      allowEditing: false,
      correctOrientation: true
    });
    // this.selectedImage = image.base64String;
    // Save the picture and add it to photo collection
    const savedImageFile = await this.savePicture(capturedPhoto);
    console.log(savedImageFile);
    this.photos = savedImageFile;
  }

  private async savePicture(cameraPhoto: CameraPhoto) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(cameraPhoto);
    // console.log(base64Data);
    // const imageFile = await this.imagePicker.base64toBlob(
    //   base64Data.replace('data:image/jpeg;base64,', ''),
    //   'image/jpeg'
    // );

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';

    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });

    // Get platform-specific photo filepaths
    return await this.getPhotoFile(cameraPhoto, fileName);
  }

  private async readAsBase64(cameraPhoto: CameraPhoto) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(cameraPhoto.webPath); // ! no-non-null-assertion
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }

  private async getPhotoFile(cameraPhoto: CameraPhoto, fileName: string): Promise<Photo> {
    console.log(cameraPhoto.webPath);
    return {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath
    };
  }

  getPhotoUrl(userId: string) {
    this.userSub = this.userService.getUser(this.user.uid)
      .subscribe((profile) => {
        this.users.photoURL = profile.photoURL;
      }
    );
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
