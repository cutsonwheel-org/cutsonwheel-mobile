import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfferCreatePageRoutingModule } from './offer-create-routing.module';

import { OfferCreatePage } from './offer-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfferCreatePageRoutingModule
  ],
  declarations: [OfferCreatePage]
})
export class OfferCreatePageModule {}
