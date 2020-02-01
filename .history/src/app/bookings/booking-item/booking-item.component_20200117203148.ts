import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Bookings } from '../bookings';
import { AuthService } from 'src/app/auth/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { BookingsService } from '../bookings.service';
import { UsersService } from 'src/app/users/users.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaymentsService } from 'src/app/payments/payments.service';
import { switchMap } from 'rxjs/operators';
import { WalletService } from 'src/app/wallet/wallet.service';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-booking-item',
  templateUrl: './booking-item.component.html',
  styleUrls: ['./booking-item.component.scss'],
})
export class BookingItemComponent implements OnInit, OnDestroy {
  @Input() booking: Bookings;
  @Output() wasCanceled = new EventEmitter<boolean>();

  user: firebase.User;
  isAssistant: boolean;

  total: number;
  currency: string;
  qty: number;
  paymentMethod: string;

  private userSub: Subscription;

  constructor(
    private authsService: AuthService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private bookingsService: BookingsService,
    private userService: UsersService,
    private paymentsService: PaymentsService,
    private walletService: WalletService,
    private router: Router
  ) {
    this.isAssistant = false;
    this.qty = 1;
    this.currency = 'PHP';
    this.paymentMethod = 'cash';
  }

  ngOnInit() {
    const user = this.authsService.getUsersProfile();
    if (user) {
      this.user = user;
      this.userService.getUser(user.uid)
        .subscribe((profile) => {
          this.isAssistant = profile.roles.assistant;
        }
      );
    }
  }

  onView(bookingId: string) {
    this.router.navigateByUrl('/t/bookings/booking-detail/' + bookingId);
  }

  onCancel(bookingId: string) {
    this.loadingCtrl
      .create({
        message: 'Updating status...'
      })
      .then(loadingEl => {
        loadingEl.present();
        const booking  = {
          id: bookingId,
          status: 'canceled'
        };
        this.bookingsService.update(booking).then(() => {
            loadingEl.dismiss();
            this.wasCanceled.emit(true);
        });
      });
  }

  onPay(bookingId: string) {
    // popup for note
    this.alertController.create({
      header: 'Add Note',
      inputs: [
        {
          name: 'note',
          type: 'text',
          placeholder: 'Add note'
        },
      ],
      buttons: [
        {
          text: 'Ok',
          handler: (data) => {
            // show some loading effect...
            this.loadingCtrl
              .create({
                message: ''
              })
              .then(loadingEl => {
                loadingEl.present();
                // get services
                this.bookingsService.getOne(bookingId).pipe(
                  switchMap(booking => {
                    this.booking = booking;
                    return this.userService.getUser(booking.userId);
                  })
                ).subscribe((client) => {
                  const bookingDetail = {
                    client,
                    ...this.booking
                  };

                  const payment = {
                    intent: 'authorize',
                    payer: {
                      paymentMethod: this.paymentMethod
                    },
                    transactions: {
                      amount: {
                        total: bookingDetail.assistant.subTotal,
                        currency: this.currency
                      },
                      description: 'Payment for service.',
                      invoiceNumber: Math.floor(Math.random() * 999999999), // autogenerate
                      itemList: {
                        items: bookingDetail.assistant.selectedServices,
                        shippingAddress: {
                          recipientName: bookingDetail.client.displayName,
                          address: bookingDetail.location.address
                        }
                      }
                    },
                    note: data.note,
                    paymentCreated: new Date(),
                    paymentFrom: bookingDetail.client.id,
                    paymentTo: bookingDetail.assistant.assistantId
                  };
                  // insert payments
                  this.paymentsService.insert(payment).then((ref) => {
                    loadingEl.dismiss();
                    this.router.navigateByUrl('/t/services/discover');
                  });
                });
              }
            );
          }
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  ngOnDestroy() {

  }
}
