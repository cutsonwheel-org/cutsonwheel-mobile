import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilesPageRoutingModule } from './profiles-routing.module';

import { ProfilesPage } from './profiles.page';
import { SharedModule } from '../shared/shared.module';
import { ImagePickerModalComponent } from '../shared/pickers/image-picker/image-picker-modal/image-picker-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfilesPageRoutingModule,
    SharedModule
  ],
  declarations: [ProfilesPage, ImagePickerModalComponent],
  entryComponents: [ImagePickerModalComponent]
})
export class ProfilesPageModule {}
