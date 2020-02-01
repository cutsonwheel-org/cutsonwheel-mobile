import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfferCreatePageRoutingModule } from './offer-create-routing.module';

import { OfferCreatePage } from './offer-create.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    OfferCreatePageRoutingModule,
    SharedModule
  ],
  declarations: [OfferCreatePage]
})
export class OfferCreatePageModule {}
