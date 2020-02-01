import { Component, OnInit, OnDestroy, AfterContentInit, AfterViewChecked, AfterViewInit, ViewChild } from '@angular/core';
import { Wallet } from './wallet';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { WalletService } from './wallet.service';
import { switchMap, map, mergeMap } from 'rxjs/operators';
import { PaymentsService } from '../payments/payments.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { Payments } from '../payments/payments';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit, AfterViewInit {
  @ViewChild(IonInfiniteScroll, { static: false}) infiniteScroll: IonInfiniteScroll;

  // public wallets: Payments[];
  public user: firebase.User;

  private authSub: Subscription;
  totals: [];
  eachTotal: number;
  total = 0;

  balance: number;
  wallets = [];
  constructor(
    private walletService: WalletService,
    private paymentsService: PaymentsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getUserState().subscribe((user) => {
      if (user) {
        this.user = user;
        this.paymentsService.getByUserId(user.uid).subscribe((payments) => {
          // this.wallets = payments;
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < payments.length; i++) {
            const element = payments[i];
            this.wallets.push( element.transactions.itemList.shippingAddress.recipientName );
          }

          let balance = 0;
          for (const payment of payments) {
            if (payment.paymentFrom === user.uid) {
              balance -= payment.transactions.amount.total;
            }

            if (payment.paymentTo === user.uid) {
              balance += payment.transactions.amount.total;
            }
          }

          this.balance = balance;
        });

      }
    });
  }

  loadData(event) {
    const length = 0;
    this.paymentsService.getByUserId(this.user.uid).subscribe((payments) => {

      payments.forEach(element => {
        this.wallets.push(element);
      });
      event.target.complete();
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (length < this.items.length) {
        console.log('no data available');
        // this.util.presentToast('No more data available', true, 'bottom', 1500);
        event.target.disabled = true;
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
