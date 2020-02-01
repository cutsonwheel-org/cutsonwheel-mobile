import { Component, OnInit } from '@angular/core';
import { Wallet } from './wallet';
import { Observable } from 'rxjs';
import { WalletService } from './wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  public wallet$: Observable<Wallet[]>;

  constructor(
    private walletService: WalletService
  ) { }

  ngOnInit() {
    this.wallet$ = this.walletService.getAll();
  }

}
