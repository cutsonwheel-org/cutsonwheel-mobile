import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ProfilesPageRoutingModule } from './profiles-routing.module';
import { ProfilesPage } from './profiles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilesPageRoutingModule
  ],
  declarations: [ProfilesPage]
})
export class ProfilesPageModule {}
