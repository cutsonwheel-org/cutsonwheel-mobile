import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';
import { ImagePickerService } from '../../../shared/components/image-picker/image-picker.service';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../../auth/auth.service';
import { ImagePicker } from '../../../shared/components/image-picker/image-picker';
import { UsersService } from 'src/app/users/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload-profile-picture',
  templateUrl: './upload-profile-picture.component.html',
  styleUrls: ['./upload-profile-picture.component.scss'],
})
export class UploadProfilePictureComponent implements OnInit, OnDestroy {
  form: FormGroup;
  user: firebase.User;
  imagePicker: ImagePicker;

  private authSub: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private imagePickerService: ImagePickerService,
    private authService: AuthService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      image: new FormControl(null)
    });

    this.authSub = this.authService.getUserState()
      .subscribe( user => {
        this.user = user;
      }
    );
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onUpload() {
    if (!this.form.get('image').value) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Uploading...'
      })
      .then(loadingEl => {
        loadingEl.present();

        this.imagePickerService
          .uploadImage(this.form.get('image').value)
          .pipe(
            switchMap(uploadRes => {
              this.user.updateProfile( {
                photoURL: uploadRes.imageUrl
              });

              const data = {
                id: this.user.uid,
                photoURL: uploadRes.imageUrl
              };
              return this.usersService.update(data);
            })
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.modalCtrl.dismiss(null, 'success');
          });
      });
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = this.imagePicker.base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({ image: imageFile });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
