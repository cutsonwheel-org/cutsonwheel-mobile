import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';
import { ImagePickerService } from './../../shared/pickers/image-picker/image-picker.service';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './../../auth/auth.service';
import { ImagePicker } from './../../shared/pickers/image-picker/image-picker';
import { UsersService } from 'src/app/users/users.service';

@Component({
  selector: 'app-upload-profile-picture',
  templateUrl: './upload-profile-picture.component.html',
  styleUrls: ['./upload-profile-picture.component.scss'],
})
export class UploadProfilePictureComponent implements OnInit {
  form: FormGroup;
  user: firebase.User;
  imagePicker: ImagePicker;

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

    this.authService.getUserState()
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

              return this.usersService.updateAvatar(uploadRes.imageUrl, this.user.uid);
            })
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.modalCtrl.dismiss(null, 'success');
          });
      });
  }
  // getAvatar(userId: string): Observable<Users> {
  //   return this.userService.getUser(userId);
  // }
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
}
