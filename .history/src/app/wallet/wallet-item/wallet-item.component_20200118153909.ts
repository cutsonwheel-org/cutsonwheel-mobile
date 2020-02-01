import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Wallet } from '../wallet';
import { UsersService } from 'src/app/users/users.service';
import { Payments } from 'src/app/payments/payments';
import { PaymentsService } from 'src/app/payments/payments.service';

@Component({
  selector: 'app-wallet-item',
  templateUrl: './wallet-item.component.html',
  styleUrls: ['./wallet-item.component.scss'],
})
export class WalletItemComponent implements OnInit {
  @Input() wallet: Wallet;
  @Output() totalItemWallet: EventEmitter<number> = new EventEmitter();
  displayName: string;
  payment: Payments;

  constructor(
    private usersService: UsersService,
    private paymentsService: PaymentsService
  ) { }

  ngOnInit() {

    this.usersService.getUser(this.wallet.paymentFrom).subscribe((user) => {
      this.displayName = user.displayName;
    });

  }

}
