import { Component, OnInit, Input } from '@angular/core';
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
  displayName: string;
  payment: Payments;
  total: number;

  constructor(
    private usersService: UsersService,
    private paymentsService: PaymentsService
  ) { }

  ngOnInit() {
    this.usersService.getUser(this.wallet.paymentFrom).subscribe((user) => {
      this.displayName = user.displayName;
    });

    this.paymentsService.getOne(this.wallet.paymentId).subscribe((payment) => {
      this.payment = payment;
    });

    this.total += this.payment.transactions.amount.total;
  }

}
