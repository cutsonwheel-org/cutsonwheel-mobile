import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NavController,
  LoadingController,
  AlertController,
  ModalController
} from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { OffersService } from '../offers.service';
import { Offers } from '../offers';
import { switchMap } from 'rxjs/operators';
import { ImagePickerService } from './../../../shared/pickers/image-picker/image-picker.service';
import { ImagePicker } from './../../../shared/pickers/image-picker/image-picker';


@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit, OnDestroy {
  offer: Offers;
  offerId: string;
  form: FormGroup;
  imagePicker: ImagePicker;
  defaultImage: string;
  isLoading = false;
  private offerSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private offersService: OffersService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private imagePickerService: ImagePickerService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('offerId')) {
        this.navCtrl.navigateBack('/t/services/offers');
        return;
      }
      this.offerId = paramMap.get('offerId');
      this.isLoading = true;

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
          validators: [Validators.required, Validators.min(2), Validators.maxLength(6)]
        }),
        image: new FormControl(null)
      });

      this.offerSub = this.offersService.getOffer(paramMap.get('offerId'))
      .subscribe(
        place => {
          this.offer = place;
          this.form.patchValue({
            title: this.offer.title,
            description: this.offer.description,
            status: this.offer.status,
            availability: this.offer.availability,
            type: this.offer.type,
            duration: this.offer.duration,
            cost: this.offer.cost,
            image: this.offer.imageUrl
          });

          this.isLoading = false;
        },
        error => {
          this.alertCtrl
            .create({
              header: 'An error occurred!',
              message: 'Place could not be fetched. Please try again later.',
              buttons: [
                {
                  text: 'Okay',
                  handler: () => {
                    this.router.navigate(['/t/services/offers']);
                  }
                }
              ]
            })
            .then(alertEl => {
              alertEl.present();
            });
        }
      );
    });
  }

  onAvailabilitySelected(ev) {
    this.form.patchValue({ availability: ev.detail.value });
  }

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }

    this.loadingCtrl
      .create({
        message: 'Updating offer...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.imagePickerService
          .uploadImage(this.form.get('image').value)
          .pipe(
            switchMap(uploadRes => {
              const offer  = {
                id: this.offer.id,
                title: this.form.value.title,
                description: this.form.value.description,
                imageUrl: uploadRes.imageUrl,
                status: this.form.value.status,
                availability: this.form.value.availability,
                type: this.form.value.type,
                duration: this.form.value.duration,
                cost: +this.form.value.cost,
              };
              return this.offersService.updateOffer(offer);
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
    if (this.offerSub) {
      this.offerSub.unsubscribe();
    }
  }
}
