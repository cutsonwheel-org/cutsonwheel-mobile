import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { MapModalComponent } from './map-modal/map-modal.component';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { ToastComponent } from './toast/toast.component';
import { CreateBookingComponent } from '../bookings/create-booking/create-booking.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LocationPickerComponent,
    MapModalComponent,
    CreateBookingComponent,
    ImagePickerComponent,
    ToastComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    LocationPickerComponent,
    MapModalComponent,
    CreateBookingComponent,
    ImagePickerComponent,
    ToastComponent
  ],
  entryComponents: [CreateBookingComponent, MapModalComponent]
})
export class SharedModule {}
