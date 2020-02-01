import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, AfterContentInit } from '@angular/core';
import { Wallet } from '../wallet';
import { UsersService } from 'src/app/users/users.service';
import { Payments } from 'src/app/payments/payments';
import { PaymentsService } from 'src/app/payments/payments.service';

@Component({
  selector: 'app-wallet-item',
  templateUrl: './wallet-item.component.html',
  styleUrls: ['./wallet-item.component.scss'],
})
export class WalletItemComponent implements OnInit, AfterContentInit {
  @Input() wallet: Wallet;
  @Output() totalWallet = new EventEmitter();
  displayName: string;
  payment: Payments;
  sum = 0;
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
      this.sum += payment.transactions.amount.total;
    });

  }

  ngAfterContentInit(): void {
    this.totalWallet.emit(this.sum);
  }

}
