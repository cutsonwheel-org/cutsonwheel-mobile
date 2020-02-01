import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilesPageRoutingModule } from './profiles-routing.module';

import { ProfilesPage } from './profiles.page';
import { SharedModule } from '../shared/shared.module';
import { UploadProfilePictureComponent } from './upload-profile-picture/upload-profile-picture.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilesPageRoutingModule,
    SharedModule,
    UploadProfilePictureComponent
  ],
  declarations: [ProfilesPage],
  entryComponents: [UploadProfilePictureComponent]
})
export class ProfilesPageModule {}
