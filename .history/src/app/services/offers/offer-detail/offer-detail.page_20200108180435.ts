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

import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

import { AuthService } from '../../../auth/auth.service';
import { BookingsService } from '../../../bookings/bookings.service';
import { Offers } from '../../offers/offers';
import { OffersService } from '../../offers/offers.service';
import { UsersService } from '../../../users/users.service';
import { Users } from 'src/app/users/users';

@Component({
  selector: 'app-offer-detail',
  templateUrl: './offer-detail.page.html',
  styleUrls: ['./offer-detail.page.scss'],
})
export class OfferDetailPage implements OnInit, OnDestroy {

  offer: Offers;
  isBookable = false;
  isLoading = false;
  private offerSub: Subscription;

  user: firebase.User;

  assistantDetail: Users;
  userDetail: Users;

  canDelete: boolean;
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
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('offerId')) {
        this.navCtrl.navigateBack('/t/services/discover');
        return;
      }
      this.isLoading = true;
      this.offersService.getOffer(paramMap.get('offerId')).subscribe(offer => {
        this.isLoading = false;

        this.offer = offer;

        this.usersService.getUser(offer.userId).subscribe((assistant) => {
          this.assistantDetail = assistant;
        });

        this.user = this.authService.getUsersProfile();

        if (this.user.uid === this.offer.userId) {
          this.canDelete = true;
        }
        this.usersService.getUser(this.user.uid).subscribe((activeUser) => {
          this.userDetail = activeUser;

          if (activeUser.role !== 'assistant') {
            this.isBookable = true;
          }
        });
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

  onBookOffer() {
    this.actionSheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal();
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      })
      .then(actionSheetEl => {
        actionSheetEl.present();
      });
  }

  openBookingModal() {
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedOffer: this.offer }
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        if (resultData.role === 'confirm') {
          this.loadingCtrl
            .create({ message: 'Booking offer...' })
            .then(loadingEl => {
              loadingEl.present();

              this.setAssistant(resultData.data.serviceSelected);
              this.setSchedule(resultData.data.scheduleDateTime);
              this.router.navigateByUrl('/t/bookings/new-booking');
              loadingEl.dismiss();
            });
        }
      });
  }

  setSchedule(scheduled: any) {
    localStorage.setItem('schedule', JSON.stringify(scheduled));
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
      this.offersService.deleteOffer(offerId).then(() => {
        loadingEl.dismiss();
        this.router.navigateByUrl('/t/services/offers');
      });
    });
  }

  ngOnDestroy() {
    if (this.offerSub) {
      this.offerSub.unsubscribe();
    }
  }

}
