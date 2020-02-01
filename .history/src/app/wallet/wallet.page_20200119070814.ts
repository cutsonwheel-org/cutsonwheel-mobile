import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { PaymentsService } from '../payments/payments.service';
import { AuthService } from '../auth/auth.service';
import { IonInfiniteScroll, ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Payments } from '../payments/payments';
const list = document.getElementById('list');
@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false}) infiniteScroll: IonInfiniteScroll;

  public user: firebase.User;
  balance: number;
  wallets = [];
  payments: Payments;
  isLoading: boolean;
  length = 0;

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
        this.paymentsService.getByUserId(user.uid).subscribe((payments) => {
          this.isLoading = false;
          this.appendItems(payments);
          // payments.forEach(element => {
          //   this.wallets.push(element);
          // });

          let balance = 0;
          for (const payment of payments) {
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
    this.paymentsService.getByUserId(this.user.uid).subscribe((payments) => {
      console.log(payments.length);
      if (this.length < payments.length) {
        console.log('Loading data...');
        this.wait(500);
        event.target.complete();
        this.appendItems(payments);
        console.log('Done');
      } else {
        console.log('No More Data');
        event.target.disabled = true;
      }

      // payments.forEach(element => {
      //   this.wallets.push(element);
      // });
      // event.target.complete();
      // // App logic to determine if all data is loaded
      // // and disable the infinite scroll
      // if (this.wallets.length === 14) {
      //   this.toastCtrl.create({
      //     message: 'All transaction loaded!',
      //     duration: 2000
      //   }).then(toast => toast.present());
      //   event.target.disabled = true;
      // }
    });
  }

  appendItems(payments: any) {
    console.log(payments);
    for (let i = 0; i < payments.length; i++) {
      const element = payments[i];
      // this.renderer.
      const el = this.renderer.createElement('#list');
      const item = this.renderer.createText('uyi');
      this.renderer.appendChild(el, item);
      // list.appendChild(el);
      this.length++;
    }
  }

  wait(time) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }
}
