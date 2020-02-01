import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { MapModalComponent } from './map-modal/map-modal.component';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { ToastComponent } from './toast/toast.component';

@NgModule({
  declarations: [
    LocationPickerComponent,
    MapModalComponent,
    ImagePickerComponent,
    ToastComponent
  ],
  imports: [CommonModule, IonicModule],
  exports: [
    LocationPickerComponent,
    MapModalComponent,
    ImagePickerComponent,
    ToastComponent
  ],
  entryComponents: [MapModalComponent]
})
export class SharedModule {}
