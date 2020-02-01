import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingCreatePageRoutingModule } from './booking-create-routing.module';

import { BookingCreatePage } from './booking-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingCreatePageRoutingModule
  ],
  declarations: [BookingCreatePage]
})
export class BookingCreatePageModule {}
