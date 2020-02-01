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
          // this.walletService.getOne('HahDL2ZRjvtxtADZr4Cg').subscribe((wallet) => {
          //   this.wallet = wallet;
          //   console.log(wallet);
          // });
          this.walletService.getTotalWallet(user.uid).pipe(
            map( wallet => {
              this.wallets = wallet;
              return wallet;
            })
          ).subscribe((wallets) => {
            const payments = this.paymentsService.getOne(wallets.paymentId);
            console.log(payments);
            console.log(wallets);
          });
        }
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
