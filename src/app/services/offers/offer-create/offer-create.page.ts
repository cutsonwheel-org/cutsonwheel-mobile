import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';

import { switchMap } from 'rxjs/operators';
import { AuthService } from './../../../auth/auth.service';
import { OffersService } from '../offers.service';
import { ImagePickerService } from '../../../shared/components/image-picker/image-picker.service';
import { ImagePicker } from 'src/app/shared/components/image-picker/image-picker';
import { Subscription } from 'rxjs';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { CategoryComponent } from './category/category.component';

@Component({
  selector: 'app-offer-create',
  templateUrl: './offer-create.page.html',
  styleUrls: ['./offer-create.page.scss'],
})
export class OfferCreatePage implements OnInit, OnDestroy {

  form: FormGroup;
  user: firebase.User;
  imagePicker: ImagePicker;
  duration: string;

  objects: any[];
  public labelAttribute: string;

  private userAuth: Subscription;
  private offerSub: Subscription;

  constructor(
    private offersService: OffersService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    // private categoriesService: CategoriesService,
    private imagePickerService: ImagePickerService,
    private modalCtrl: ModalController
  ) {
    this.duration = 25 + ' minutes';
  }

  ngOnInit() {
    this.userAuth = this.authService.getUserState()
    .subscribe((user) => {
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
      category: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      duration: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      charges: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(2), Validators.maxLength(6)]
      }),
      image: new FormControl(null)
    });

  }

  onPickedCategory() {
    this.modalCtrl.create({
        component: CategoryComponent
      }).then(modalEl => {
        modalEl.onDidDismiss().then(modalData => {
          if (!modalData.data) {
            return;
          }
          this.form.patchValue({ category: modalData.data.selectedCategory });
        });
        modalEl.present();
      });
  }

  onDurationSelected(ev) {
    const selectedDuration = (ev.detail.value !== 60) ? ev.detail.value + ' min' : '1 hour';
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

        this.offerSub = this.imagePickerService
          .uploadImage(this.form.get('image').value)
          .pipe(
            switchMap(uploadRes => {
              const offer  = {
                title: this.form.value.title,
                description: this.form.value.description,
                imageUrl: uploadRes.imageUrl,
                availability: this.form.value.availability,
                category: this.form.value.category,
                duration: this.form.value.duration,
                charges: +this.form.value.charges,
                userId: this.user.uid
              };
              return this.offersService.insert(offer);
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

  ngOnDestroy() {
    this.userAuth.unsubscribe();
  }
}
