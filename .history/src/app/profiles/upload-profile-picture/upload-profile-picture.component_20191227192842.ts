import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';
import { ImagePickerService } from './../../shared/pickers/image-picker/image-picker.service';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-upload-profile-picture',
  templateUrl: './upload-profile-picture.component.html',
  styleUrls: ['./upload-profile-picture.component.scss'],
})
export class UploadProfilePictureComponent implements OnInit {
  form: FormGroup;
  user: firebase.User;
  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private imagePickerService: ImagePickerService,
    private authService: AuthService,

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
    if (!this.form.valid || !this.form.get('image').value) {
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
              return this.user.updateProfile( {
                photoURL: uploadRes.imageUrl
              });
            })
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.modalCtrl.dismiss(null, 'cancel');
          });
      });
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(
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
