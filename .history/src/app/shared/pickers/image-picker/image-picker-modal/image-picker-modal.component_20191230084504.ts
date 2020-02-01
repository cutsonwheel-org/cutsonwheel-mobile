import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { ImagePicker } from '../image-picker';
import { ModalController, LoadingController } from '@ionic/angular';
import { ImagePickerService } from '../image-picker.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-image-picker-modal',
  templateUrl: './image-picker-modal.component.html',
  styleUrls: ['./image-picker-modal.component.scss'],
})
export class ImagePickerModalComponent implements OnInit {
  @Output() imagePick = new EventEmitter<string | File>();

  form: FormGroup;
  user: firebase.User;
  imagePicker: ImagePicker;

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
