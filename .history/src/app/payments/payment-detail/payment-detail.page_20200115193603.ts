import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { PaymentsService } from '../payments.service';
import { map, mergeMap } from 'rxjs/operators';
import { Payments } from '../payments';
import { forkJoin, Subscription } from 'rxjs';
import { UsersService } from 'src/app/users/users.service';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.page.html',
  styleUrls: ['./payment-detail.page.scss'],
})
export class PaymentDetailPage implements OnInit, OnDestroy {

  payments: Payments;
  paymentData: any;
  private routeSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private paymentsService: PaymentsService,
    private usersService: UsersService
  ) { }

  ngOnInit() {

    this.routeSub = this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('invoiceId')) {
        this.navCtrl.navigateBack('/t/payments');
        return;
      }

      this.paymentsService.getOne(paramMap.get('invoiceId')).pipe(
        map( payments => {
          this.payments = payments;
          return payments;
        }),
        // mergeMap( payment => {
        //   const assistant = this.usersService.getUser(payment.transactions.to);
        //   const client = this.usersService.getUser(payment.transactions.from);
        //   return forkJoin([assistant, client]);
        // })
      ).subscribe((payment) => {
        const assistant = payment[0];
        const client = payment[1];
        this.paymentData = {
          assistant,
          client,
          ...this.payments
        };
        console.log(this.paymentData);
      },
      error => {
        this.alertCtrl
          .create({
            header: 'An error ocurred!',
            message: 'Could not load payment data.',
            buttons: [
              {
                text: 'Okay',
                handler: () => {
                  this.navCtrl.navigateBack('/t/payments');
                }
              }
            ]
          })
          .then(alertEl => alertEl.present());
      });
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
