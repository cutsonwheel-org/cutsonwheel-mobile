import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { PaymentsService } from '../payments/payments.service';
import { AuthService } from '../auth/auth.service';
import { IonInfiniteScroll, ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Payments } from '../payments/payments';
import { Observable } from 'rxjs';
const list = document.getElementById('list');
@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false}) infiniteScroll: IonInfiniteScroll;
  public payments$: Observable<Payments[]>;
  public user: firebase.User;
  balance: number;
  wallets = [];
  payments: Payments;
  isLoading: boolean;
  length = 0;
  lastVisible: number;
  constructor(
    private paymentsService: PaymentsService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private renderer: Renderer2
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    this.authService.getUserState().subscribe((user) => {
      if (user) {
        this.user = user;

        // this.getTotalWallet(user.uid);
        this.loadTransactions();
      }
    });
  }

  getTotalWallet(userId: string) {
    this.paymentsService.getUserWallet(userId).subscribe((payments) => {
      let balance = 0;
      for (const payment of payments) {
        if (payment.paymentTo === this.user.uid) {
          balance += payment.transactions.amount.total;
        }
      }
      this.balance = balance;
    });
  }

  loadTransactions(event?) {
    this.paymentsService.getByUserId(this.user.uid).subscribe((wallets) => {
      this.isLoading = false;
      // this is an options
      this.wallets = this.wallets.concat(wallets);

      let balance = 0;
      for (const wallet of wallets) {
        if (wallet.paymentTo === this.user.uid) {
          balance += wallet.transactions.amount.total;
        }
      }
      this.balance = balance;

      if (event) {
        event.target.complete();
      }
    });
  }

  loadMore(event) {
    const length = 0;
    this.loadTransactions(event);
    if (length < this.wallets.length) {
      this.toastCtrl.create({
        message: 'All transaction loaded!',
        duration: 2000
      }).then(toast => toast.present());
      event.target.disabled = true;
    }
  }

  // loadData(event) {
  //   this.paymentsService.getByUserIdByLastVisible(this.user.uid).subscribe((payments) => {
  //     if (this.wallets.length < payments.length) {
  //       console.log('Loading data...');
  //       event.target.complete();

  //       payments.forEach(element => {
  //         this.wallets.push(element);
  //       });

  //       console.log('Done');
  //     } else {
  //       console.log('No More Data');
  //       this.toastCtrl.create({
  //         message: 'All transaction loaded!',
  //         duration: 2000
  //       }).then(toast => toast.present());
  //       event.target.disabled = true;
  //     }

  //   });
  // }
}
