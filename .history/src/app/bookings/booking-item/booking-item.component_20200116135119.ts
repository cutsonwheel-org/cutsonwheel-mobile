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
      this.userSub = this.userService.getUser(user.uid)
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

      console.log(bookingDetail);
    });
    // popup for note
    // this.alertController.create({
    //   header: 'Add Note',
    //   inputs: [
    //     {
    //       name: 'note',
    //       type: 'text',
    //       placeholder: 'Add note'
    //     },
    //   ],
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       cssClass: 'secondary',
    //       handler: () => {
    //         console.log('Confirm Cancel');
    //       }
    //     }, {
    //       text: 'Ok',
    //       handler: (data) => {
    //         console.log(data.note);
    //         this.loadingCtrl
    //           .create({
    //             message: '...'
    //           })
    //           .then(loadingEl => {
    //             loadingEl.present();

    //             this.bookingsService.getOne(bookingId).subscribe((booking) => {
    //               const payment = {
    //                 intent: 'authorize',
    //                 payer: {
    //                   paymentMethod: this.paymentMethod
    //                 },
    //                 transactions: {
    //                   amount: {
    //                     total: this.total,
    //                     currency: this.currency
    //                   },
    //                   description: 'Payment for service.',
    //                   invoiceNumber: Math.floor(Math.random() * 999999999), // autogenerate
    //                   itemList: {
    //                     items: booking.assistant.selectedServices,
    //                     shippingAddress: {
    //                       recipientName: this.clientName,
    //                       address: this.clientAddress
    //                     }
    //                   }
    //                 },
    //                 note: data.note,
    //                 datePaid: new Date()
    //               };
    //               this.paymentsService.insert(payment).then(() => {
    //                 loadingEl.dismiss();
    //                 localStorage.removeItem('bookingId');
    //                 const booking  = {
    //                   id: booking.id,
    //                   status: 'paid'
    //                 };
    //                 this.bookingsService.update(booking).then(() => {
    //                   this.router.navigateByUrl('/t/payments');
    //                 });
    //               });
    //             });
    //           });
    //       }
    //     }
    //   ]
    // }).then(alertEl => {
    //   alertEl.present();
    // });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
