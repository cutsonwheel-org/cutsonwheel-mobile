import { Component, OnInit, OnDestroy, AfterContentInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Wallet } from './wallet';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { WalletService } from './wallet.service';
import { switchMap, map, mergeMap } from 'rxjs/operators';
import { PaymentsService } from '../payments/payments.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { Payments } from '../payments/payments';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit, AfterViewInit {
  public wallet$: Observable<Payments[]>;
  public user: firebase.User;

  private authSub: Subscription;
  totals: [];
  eachTotal: number;
  total = 0;
  constructor(
    private walletService: WalletService,
    private paymentsService: PaymentsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getUserState().subscribe((user) => {
      if (user) {
        // for (const trans of block.transactions) {
        //   if (trans.fromAddress === address) {
        //     balance -= trans.amount;
        //   }

        //   if (trans.toAddress === address) {
        //     balance += trans.amount;
        //   }
        // }
        this.paymentsService.getByUserId(user.uid).subscribe((payments) => {
          // console.log(payments);
          for (const payment of payments) {
            console.log(payment.transactions.amount.total);
          }
        });
        // this.wallet$ = this.paymentsService.getByUserId(user.uid);
      }
    });
  }

  getEachTotal(eachTotal: never) {
    console.log(eachTotal);
    this.total += eachTotal;
  }

  ngAfterViewInit() {

    console.log(this.total);
  }

}
