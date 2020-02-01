import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssistantPageRoutingModule } from './assistant-routing.module';

import { AssistantPage } from './assistant.page';
import { ServicesComponent } from './services/services.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssistantPageRoutingModule
  ],
  declarations: [AssistantPage, ServicesComponent],
  entryComponents: [ServicesComponent]
})
export class AssistantPageModule {}
