import { Component, OnInit, Input } from '@angular/core';
import { Wallet } from '../wallet';
import { UsersService } from 'src/app/users/users.service';

@Component({
  selector: 'app-wallet-item',
  templateUrl: './wallet-item.component.html',
  styleUrls: ['./wallet-item.component.scss'],
})
export class WalletItemComponent implements OnInit {
  @Input() wallet: Wallet;
  displayName: string;

  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.usersService.getUser(this.wallet.paymentFrom).subscribe((user) => {
      this.displayName = user.displayName;
    });
    // console.log(this.wallet);
  }

}
