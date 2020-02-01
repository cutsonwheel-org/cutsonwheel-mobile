import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { PlaceLocation } from '../../location';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './../../../auth/auth.service';
import { OffersService } from '../offers.service';
import { ServicesService } from '../../services.service';
import { Observable } from 'rxjs';
import { Services } from '../../services';

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
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss']
})
export class NewOfferPage implements OnInit {
  form: FormGroup;
  user: firebase.User;
  services: Observable<Services[]>;

  constructor(
    private offersService: OffersService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private servicesService: ServicesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUsersProfile();
    this.services = this.servicesService.getCategories();

    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(250)]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      status: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      availability: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      category: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      type: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(150)]
      }),
      duration: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(25)]
      }),
      cost: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(6)]
      }),
      image: new FormControl(null)
    });

  }

  onCategorySelected(ev) {
    console.log(ev.detail.value);
  }

  onCreateOffer() {
    if (!this.form.valid || !this.form.get('image').value) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Creating place...'
      })
      .then(loadingEl => {
        loadingEl.present();

        this.offersService
          .uploadImage(this.form.get('image').value)
          .pipe(
            switchMap(uploadRes => {
              const offer  = {
                title: this.form.value.title,
                description: this.form.value.description,
                imageUrl: uploadRes.imageUrl,
                price: +this.form.value.price,
                availableFrom: new Date(this.form.value.dateFrom),
                availableTo: new Date(this.form.value.dateTo),
                userId: this.user.uid, // change on actual id
                location: this.form.value.location
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

  onLocationPicked(selectedLocation: PlaceLocation) {
    this.form.patchValue({
      location: selectedLocation
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
