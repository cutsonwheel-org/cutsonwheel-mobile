import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletCreatePageRoutingModule } from './wallet-create-routing.module';

import { WalletCreatePage } from './wallet-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalletCreatePageRoutingModule
  ],
  declarations: [WalletCreatePage]
})
export class WalletCreatePageModule {}
