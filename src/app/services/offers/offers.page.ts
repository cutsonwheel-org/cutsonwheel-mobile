import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { OffersService } from './offers.service';
import { Offers } from './offers';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit, OnDestroy {
  public offers$: Observable<Offers[]>;
  public isLoading: boolean;

  private authSub: Subscription;

  constructor(
    private offersService: OffersService,
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    this.authSub = this.authService.getUserState()
      .subscribe( user => {
        this.offers$ = this.offersService.getByUserId(user.uid);
        if (this.offers$) {
          this.isLoading = false;
        }
      }
    );
  }

  onDelete(offerId: string, slidingItem: IonItemSliding) {
    this.loadingCtrl
      .create({
        message: 'Deleting...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.offersService.delete(offerId).then(() => {
          loadingEl.dismiss();
          slidingItem.close();
        });
      });
  }

  onDeail(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigateByUrl('/t/services/offers/offer-detail/' + offerId);
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
