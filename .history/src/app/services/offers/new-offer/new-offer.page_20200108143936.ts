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
  duration: number;

  constructor(
    private offersService: OffersService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private imagePickerService: ImagePickerService
  ) {
    this.duration = 45;
  }

  ngOnInit() {
    this.authService.getUserState().subscribe((user) => {
      this.user = user;
    });
    // const timeToRound = new Date();
    // const hh = timeToRound.getHours();
    // const mm = Math.round(timeToRound.getMinutes() / 15) * 15;
    // const froMin = 0;
    // if (hh >= 8 && hh < 19 || (hh == 19 && mm == 0)) {
    //   froMin = (hh - 8) * 4 + (mm / 15);
    // }
    // const slider = $("#range_time").data("ionRangeSlider"); // changed the identifier to match the initial post example
    // slider.update({
    //   from_min: froMin
    // });

    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(250)]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(1000)]
      }),
      status: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
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
    this.duration = ev.detail.value;
    this.form.patchValue({ duration: ev.detail.value });
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
