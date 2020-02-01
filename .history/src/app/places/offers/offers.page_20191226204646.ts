import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { PlacesService } from '../places.service';
import { Places } from '../places';
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
  public offers: Observable<Offers[]>;
  user: firebase.User;

  constructor(
    private offersService: OffersService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getUserState()
      .subscribe( user => {
        this.user = user;
        this.offers = this.offersService.getMyOffers(user.uid);
      }
    );
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/t/', 'places', 'offers', 'edit-offer', offerId]);
  }

}
