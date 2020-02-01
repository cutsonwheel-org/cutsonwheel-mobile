import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { OffersService } from './offers.service';
import { Offers } from './offers';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit {
  isLoading = false;
  public offers$: Observable<Offers[]>;
  user: firebase.User;

  constructor(
    private offersService: OffersService,
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
  ) {}

  ngOnInit() {
    this.isLoading = true;

    this.authService.getUserState()
      .subscribe( user => {
        this.isLoading = false;
        this.user = user;
        this.offers$ = this.offersService.getMyOffers(user.uid);
      }
    );
  }

  onDeleteOffer(offerId: string, slidingItem: IonItemSliding) {
    this.loadingCtrl
      .create({
        message: 'Deleting offer...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.offersService.deleteOffer(offerId).then(() => {
          loadingEl.dismiss();
          slidingItem.close();
        });
      });
  }

  onDeailOffer(offerId: string, slidingItem: IonItemSliding) {

  }
}
