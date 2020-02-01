import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletPageRoutingModule } from './wallet-routing.module';

import { WalletPage } from './wallet.page';
import { WalletDetailComponent } from './wallet-detail/wallet-detail.component';
import { TimestampPipe } from '../shared/pipes/timestamp.pipe';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalletPageRoutingModule
  ],
  declarations: [
    WalletPage,
    WalletDetailComponent,
    TimestampPipe
  ],
  providers: [PayPal],
  entryComponents: [WalletDetailComponent]
})
export class WalletPageModule {}
