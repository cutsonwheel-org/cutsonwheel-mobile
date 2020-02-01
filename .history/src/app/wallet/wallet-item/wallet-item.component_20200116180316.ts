import { Component, OnInit, Input } from '@angular/core';
import { Wallet } from '../wallet';

@Component({
  selector: 'app-wallet-item',
  templateUrl: './wallet-item.component.html',
  styleUrls: ['./wallet-item.component.scss'],
})
export class WalletItemComponent implements OnInit {
  @Input() wallet: Wallet;

  constructor() { }

  ngOnInit() {
    console.log(this.wallet);
  }

}
