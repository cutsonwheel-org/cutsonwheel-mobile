import { Component, OnInit, OnDestroy } from '@angular/core';
import { Wallet } from './wallet';
import { Observable, Subscription } from 'rxjs';
import { WalletService } from './wallet.service';
import { switchMap } from 'rxjs/operators';
import { PaymentsService } from '../payments/payments.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit, OnDestroy {
  public wallet$: Observable<Wallet[]>;
  public user: firebase.User;

  private authSub: Subscription;
  constructor(
    private walletService: WalletService,
    private paymentsService: PaymentsService,
    private usersService: UsersService,
    private authService: AuthService
  ) { }

  ngOnInit() {

    // this.wallet$ = this.walletService.getByUserId(this.authService.getUsersProfile().uid);

    this.authSub = this.authService.getUserState()
      .subscribe( user => {
        if (user) {
          this.wallet$ = this.walletService.getByUserId(this.authService.getUsersProfile().uid);
        }
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
