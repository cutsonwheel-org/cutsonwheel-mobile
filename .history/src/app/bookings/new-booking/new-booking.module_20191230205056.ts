import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewBookingPageRoutingModule } from './new-booking-routing.module';

import { NewBookingPage } from './new-booking.page';
import { MapModalComponent } from '../../shared/map-modal/map-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';

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
