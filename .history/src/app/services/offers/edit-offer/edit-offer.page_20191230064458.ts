import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NavController,
  LoadingController,
  AlertController
} from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { OffersService } from '../offers.service';
import { Offers } from '../offers';


@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit, OnDestroy {
  offer: Offers;
  offerId: string;
  form: FormGroup;
  isLoading = false;
  private offerSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private offersService: OffersService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('offerId')) {
        this.navCtrl.navigateBack('/t/services/offers');
        return;
      }
      this.offerId = paramMap.get('offerId');
      this.isLoading = true;
      this.offerSub = this.offersService.getOffer(paramMap.get('offerId'))
      .subscribe(
        place => {
          this.offer = place;

          this.form = new FormGroup({
            title: new FormControl(this.offer.title, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.maxLength(250)]
            }),
            description: new FormControl(this.offer.description, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.maxLength(180)]
            }),
            status: new FormControl(this.offer.status, {
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            availability: new FormControl(this.offer.availability, {
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            type: new FormControl(this.offer.type, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.maxLength(150)]
            }),
            duration: new FormControl(this.offer.duration, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.maxLength(25)]
            }),
            cost: new FormControl(this.offer.cost, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.min(2), Validators.maxLength(6)]
            }),
            image: new FormControl(this.offer.imageUrl)
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
        const offer  = {
          id: this.offer.id,
          title: this.form.value.title,
          description: this.form.value.description
        };
        this.offersService.updateOffer(offer).then(res => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigate(['/t/places/offers']);
        });
      });
  }

  ngOnDestroy() {
    if (this.offerSub) {
      this.offerSub.unsubscribe();
    }
  }
}
