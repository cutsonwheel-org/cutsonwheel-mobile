import { Component, OnInit, OnDestroy, AfterContentInit, AfterViewChecked } from '@angular/core';
import { Wallet } from './wallet';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { WalletService } from './wallet.service';
import { switchMap, map, mergeMap } from 'rxjs/operators';
import { PaymentsService } from '../payments/payments.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  public wallet$: Observable<Wallet[]>;
  public user: firebase.User;

  private authSub: Subscription;
  totals: [];
  eachTotal: number;

  constructor(
    private walletService: WalletService,
    private authService: AuthService
  ) { }

  ngOnInit() {

    this.wallet$ = this.walletService.getByUserId(this.authService.getUsersProfile().uid);
  }

  getEachTotal(eachTotal: never) {
    console.log(eachTotal);
  }


  getTotal() {
    console.log(this.totals);
  }
}
