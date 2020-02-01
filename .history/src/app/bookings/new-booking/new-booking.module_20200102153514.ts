import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewBookingPageRoutingModule } from './new-booking-routing.module';

import { NewBookingPage } from './new-booking.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateBookingComponent } from '../create-booking/create-booking.component';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewBookingPageRoutingModule,
    SharedModule
  ],
  declarations: [NewBookingPage]
})
export class NewBookingPageModule {}
