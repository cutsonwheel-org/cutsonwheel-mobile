import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingDetailPageRoutingModule } from './booking-detail-routing.module';

import { BookingDetailPage } from './booking-detail.page';
import { DirectionsComponent } from 'src/app/shared/components/directions/directions.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingDetailPageRoutingModule
  ],
  declarations: [BookingDetailPage, DirectionsComponent],
  entryComponents: [DirectionsComponent]
})
export class BookingDetailPageModule {}
