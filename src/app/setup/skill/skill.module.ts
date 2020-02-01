import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SkillPageRoutingModule } from './skill-routing.module';

import { SkillPage } from './skill.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SkillPageRoutingModule
  ],
  declarations: [SkillPage]
})
export class SkillPageModule {}
