import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfferCreatePageRoutingModule } from './offer-create-routing.module';

import { OfferCreatePage } from './offer-create.page';
import { SharedModule } from './../../../shared/shared.module';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { CategoryComponent } from './category/category.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    OfferCreatePageRoutingModule,
    AutoCompleteModule,
    SharedModule
  ],
  declarations: [OfferCreatePage, CategoryComponent],
  entryComponents: [CategoryComponent]
})
export class OfferCreatePageModule {}
