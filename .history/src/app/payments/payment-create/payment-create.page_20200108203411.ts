import { Component, OnInit } from '@angular/core';
import { BookingsService } from 'src/app/bookings/bookings.service';
import { Bookings } from 'src/app/bookings/bookings';
import { map, mergeMap } from 'rxjs/operators';
import { OffersService } from 'src/app/services/offers/offers.service';
import { forkJoin } from 'rxjs';
import { UsersService } from 'src/app/users/users.service';
import { PaymentsService } from '../payments.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-payment-create',
  templateUrl: './payment-create.page.html',
  styleUrls: ['./payment-create.page.scss'],
})
export class PaymentCreatePage implements OnInit {

  bookingId: string;
  bookings: Bookings;
  detail: any;

  service: string;
  description: string;
  amount: number;

  total: number;
  currency: string;
  qty: number;

  clientName: string;
  clientAddress: string;

  paymentMethod: string;

  note: string;

  isLoading: boolean;

  constructor(
    private bookingsService: BookingsService,
    private offersService: OffersService,
    private usersService: UsersService,
    private paymentsService: PaymentsService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {
    this.qty = 1;
    this.currency = 'PHP';
    this.paymentMethod = 'cash';
    this.isLoading = true;
  }

  ngOnInit() {
    this.bookingId = this.getBookingId();
    this.bookingsService.getBooking(this.bookingId)
    .pipe(
      map(booking => {
        this.bookings = booking;
        return booking;
      }),
      mergeMap( booking => {
        const offer = this.offersService.getOffer(booking.assistant.offerId);
        const assistant = this.usersService.getUser(booking.assistant.assisstantId);
        const client = this.usersService.getUser(booking.userId);

        return forkJoin([offer, assistant, client]);
      })
    )
    .subscribe((offers) => {
      this.isLoading = false;

      const offer = offers[0];
      const professional = offers[1];
      const client = offers[2];

      const bookingDetail = {
        offer,
        professional,
        client,
        ...this.bookings
      };

      this.amount = bookingDetail.offer.charges;
      this.service = bookingDetail.offer.title;
      this.description = bookingDetail.offer.description;

      this.total = this.amount * this.qty;

      this.clientName = bookingDetail.client.firstname + ' ' + bookingDetail.client.lastname;
      this.clientAddress = bookingDetail.client.location.address;

      this.detail = bookingDetail;
    });
  }

  getBookingId() {
    return localStorage.getItem('bookingId');
  }

  onPaymentConfirm() {
    this.loadingCtrl
      .create({
        message: 'saving payment...'
      })
      .then(loadingEl => {
        loadingEl.present();
        const payment = {
          bookings: this.bookings,
          intent: 'authorize',
          payer: {
            paymentMethod: this.paymentMethod
          },
          transactions: {
            amount: {
              total: this.total,
              currency: this.currency
            },
            description: 'Payment for ' + this.service,
            invoiceNumber: Math.floor(Math.random() * 999999999), // autogenerate
            itemList: {
              items: {
                name: this.service,
                description: this.description,
                quantity: this.qty,
                price: this.amount,
                currency: this.currency,
              },
              shippingAddress: {
                recipientName: this.clientName,
                address: this.clientAddress
              }
            }
          },
          note: this.note,
          datePaid: new Date().toISOString()
        };
        this.paymentsService.insertPayment(payment).then(() => {
          loadingEl.dismiss();
          localStorage.removeItem('bookingId');
          const booking  = {
            id: this.bookings.id,
            status: 'paid'
          };
          this.bookingsService.updateStatus(booking).then(() => {
            this.router.navigateByUrl('/payments');
          });
        });
      });
  }

}
