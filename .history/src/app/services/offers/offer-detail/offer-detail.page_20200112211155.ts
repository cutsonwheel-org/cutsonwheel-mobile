import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NavController,
  ModalController,
  ActionSheetController,
  LoadingController,
  AlertController
} from '@ionic/angular';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../auth/auth.service';
import { Offers } from '../../offers/offers';
import { OffersService } from '../../offers/offers.service';
import { UsersService } from '../../../users/users.service';
import { Users } from 'src/app/users/users';
import { DatetimePickerComponent } from './../../../bookings/booking-create/schedule/datetime-picker/datetime-picker.component';

@Component({
  selector: 'app-offer-detail',
  templateUrl: './offer-detail.page.html',
  styleUrls: ['./offer-detail.page.scss'],
})
export class OfferDetailPage implements OnInit, OnDestroy {

  isBookable: boolean;
  isLoading: boolean;
  user: firebase.User;
  assistantDetail: Users;
  userDetail: Users;
  canDelete: boolean;
  offer: Offers;
  private offerSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private offersService: OffersService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private usersService: UsersService,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    this.canDelete = false;
    this.isLoading = true;
    this.isBookable = false;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('offerId')) {
        this.navCtrl.navigateBack('/t/services/discover');
        return;
      }

      this.offerSub = this.offersService.getOne(paramMap.get('offerId'))
      .subscribe(offer => {
        // set loading to false
        this.isLoading = false;

        // set offer class
        this.offer = offer;

        // get assistant details
        this.usersService.getUser(offer.userId)
          .subscribe((assistant) => {
            this.assistantDetail = assistant;
          }
        );

        this.authService.getUserState()
          .subscribe((user) => {
            if (user) {
              // validate can delete access
              this.canDelete = this.canDeleteAction(user.uid, offer.userId);

              // validate client permission to booked
              this.usersService.getUser(user.uid)
                .subscribe((activeUser) => {
                  this.userDetail = activeUser;
                  if (activeUser.roles.client) {
                    this.isBookable = true;
                  }
                }
              );
            }
          }
        );
      },
      error => {
        this.alertCtrl
          .create({
            header: 'An error ocurred!',
            message: 'Could not load offer.',
            buttons: [
              {
                text: 'Okay',
                handler: () => {
                  this.router.navigate(['/t/services/discover']);
                }
              }
            ]
          })
          .then(alertEl => alertEl.present());
      });
    });
  }

  canDeleteAction(userId: string, key: any): boolean {
    return this.checkAuthorization(userId, key);
  }

  private checkAuthorization(userId: string, key: any): boolean {
    if (!userId) { return false; }

    if (userId === key) {
      return true;
    }

    return false;
  }

  onBookOffer(offerId: string) {
    this.offerSub = this.offersService.getOne(offerId)
      .subscribe(offer => {
        offer.qty = 1;
        const assistant = {
          assistantId: offer.userId,
          selectedServices: offer,
          subTotal: offer.charges
        };
        this.setAssistant(assistant);
        this.router.navigateByUrl('/t/bookings/booking-create/location');
      }
    );
  }

  setAssistant(serviceSelected: any) {
    localStorage.setItem('assistant', JSON.stringify(serviceSelected));
  }

  onDeleteOffer(offerId: string) {
    this.loadingCtrl
    .create({
      message: 'Deleting offer...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.offersService.delete(offerId).then(() => {
        loadingEl.dismiss();
        this.router.navigateByUrl('/t/services/offers');
      });
    });
  }

  ngOnDestroy() {
    this.offerSub.unsubscribe();
  }

}
