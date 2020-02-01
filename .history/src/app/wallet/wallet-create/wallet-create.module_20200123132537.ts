import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletCreatePageRoutingModule } from './wallet-create-routing.module';

import { WalletCreatePage } from './wallet-create.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalletCreatePageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [WalletCreatePage]
})
export class WalletCreatePageModule {}
