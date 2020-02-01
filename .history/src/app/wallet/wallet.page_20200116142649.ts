import { Component, OnInit } from '@angular/core';
import { Wallet } from './wallet';
import { Observable } from 'rxjs';
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
export class WalletPage implements OnInit {
  // public wallet$: Observable<Wallet[]>;
  wallet: Wallet;
  constructor(
    private walletService: WalletService,
    private paymentsService: PaymentsService,
    private usersService: UsersService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    console.log(this.authService.getUsersProfile().uid);
    this.walletService.getByUserId(this.authService.getUsersProfile().uid).subscribe((wallet) => {
      console.log(wallet);
    });
    // this.walletService.getByUserId(this.authService.getUsersProfile().uid).pipe(
    //   switchMap(wallet => {

    //     console.log(wallet);
    //     return;
    //     // this.wallet = wallet;
    //     // return this.paymentsService.getOne(wallet.paymentTo);
    //   })
    // ).subscribe(() => {

    // });
  }

}
