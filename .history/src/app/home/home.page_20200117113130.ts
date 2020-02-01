import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { WalletService } from '../wallet/wallet.service';
import { Wallet } from '../wallet/wallet';
import { Wallets } from '../wallet/wallets';
import { map, mergeMap } from 'rxjs/operators';
import { PaymentsService } from '../payments/payments.service';
import { Payments } from '../payments/payments';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  slideOpts: any;

  user: firebase.User;
  token: firebase.auth.IdTokenResult;
  private authSub: Subscription;

  wallets: Wallets;
  payments: Payments;
  // wallets: any;

  total: number;
  constructor(
    private authService: AuthService,
    private walletService: WalletService,
    private paymentsService: PaymentsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.slideOpts = {
      initialSlide: 0,
      speed: 400
    };

    this.authSub = this.authService.getUserState()
      .subscribe( user => {
        if (user) {
          this.user = user;

          this.walletService.getTotalWallet(user.uid).pipe(
            map( wallet => {
              this.wallets = wallet;
              return wallet;
            })
          ).subscribe((wallets) => {

            wallets.forEach(element => {
              this.paymentsService.getOne(element.paymentId)
              .pipe(
                map(payment => {
                  return 0 + payment.transactions.amount.total;
                })
              )
              .subscribe((total) => {
                this.total += total;
              });
            });
            console.log(this.total);
            // const payments = this.paymentsService.getOne(wallets.paymentId);
            // console.log(payments);
            console.log(wallets);
          });
        }
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
