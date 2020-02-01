import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditOfferPageRoutingModule } from './edit-offer-routing.module';

import { EditOfferPage } from './edit-offer.page';
import { SharedModule } from './../../../shared/shared.module';
import { ImagePickerModalComponent } from './../../../shared/pickers/image-picker/image-picker-modal/image-picker-modal.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    EditOfferPageRoutingModule,
    SharedModule
  ],
  declarations: [EditOfferPage, ImagePickerModalComponent],
  entryComponents: [ImagePickerModalComponent]
})
export class EditOfferPageModule {}
