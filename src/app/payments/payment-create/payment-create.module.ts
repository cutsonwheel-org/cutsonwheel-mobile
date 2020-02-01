import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentCreatePageRoutingModule } from './payment-create-routing.module';

import { PaymentCreatePage } from './payment-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentCreatePageRoutingModule
  ],
  declarations: [PaymentCreatePage]
})
export class PaymentCreatePageModule {}
