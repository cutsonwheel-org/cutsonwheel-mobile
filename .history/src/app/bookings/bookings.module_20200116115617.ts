import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingsPageRoutingModule } from './bookings-routing.module';

import { BookingsPage } from './bookings.page';
import { BookingItemComponent } from './booking-item/booking-item.component';
import { StatusPopoverComponent } from './status-popover/status-popover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingsPageRoutingModule
  ],
  declarations: [
    BookingsPage,
    BookingItemComponent,
    StatusPopoverComponent
  ],
  entryComponents: [StatusPopoverComponent]
})
export class BookingsPageModule {}
