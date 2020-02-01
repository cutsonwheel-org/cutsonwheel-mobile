import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { switchMap } from 'rxjs/operators';
import { AuthService } from './../../../auth/auth.service';
import { OffersService } from '../offers.service';
import { ServicesService } from '../../services.service';
import { ImagePickerService } from './../../../shared/pickers/image-picker/image-picker.service';
import { ImagePicker } from 'src/app/shared/pickers/image-picker/image-picker';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss']
})
export class NewOfferPage implements OnInit {
  form: FormGroup;
  user: firebase.User;
  imagePicker: ImagePicker;
  duration: string;

  constructor(
    private offersService: OffersService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private imagePickerService: ImagePickerService
  ) {
    this.duration = 25 + ' minutes';
  }

  ngOnInit() {
    this.authService.getUserState().subscribe((user) => {
      this.user = user;
    });

    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(250)]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(1000)]
      }),
      availability: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      type: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(150)]
      }),
      duration: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      cost: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(2), Validators.maxLength(6)]
      }),
      image: new FormControl(null)
    });

  }

  onDurationSelected(ev) {
    const selectedDuration = (ev.detail.value !== 60) ? ev.detail.value + ' minutes' : '1 hour';
    this.duration = selectedDuration;
    this.form.patchValue({ duration: selectedDuration });
  }

  onAvailabilitySelected(ev) {
    this.form.patchValue({ availability: ev.detail.value });
  }

  onCreateOffer() {
    if (!this.form.valid || !this.form.get('image').value) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Creating offer...'
      })
      .then(loadingEl => {
        loadingEl.present();

        this.imagePickerService
          .uploadImage(this.form.get('image').value)
          .pipe(
            switchMap(uploadRes => {
              const offer  = {
                title: this.form.value.title,
                description: this.form.value.description,
                imageUrl: uploadRes.imageUrl,
                status: this.form.value.status,
                availability: this.form.value.availability,
                type: this.form.value.type,
                duration: this.form.value.duration,
                cost: +this.form.value.cost,
                userId: this.user.uid
              };
              return this.offersService.insertOffer(offer);
            })
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/t/services/offers']);
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
