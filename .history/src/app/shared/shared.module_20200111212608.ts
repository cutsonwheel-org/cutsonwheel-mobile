import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { MapModalComponent } from './map-modal/map-modal.component';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { ToastComponent } from './toast/toast.component';
import { FormsModule } from '@angular/forms';
import { DateTimeModalComponent } from './date-time-modal/date-time-modal.component';

@NgModule({
  declarations: [
    LocationPickerComponent,
    MapModalComponent,
    DateTimeModalComponent,
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
    DateTimeModalComponent,
    ImagePickerComponent,
    ToastComponent
  ],
  entryComponents: [DateTimeModalComponent, MapModalComponent]
})
export class SharedModule {}
