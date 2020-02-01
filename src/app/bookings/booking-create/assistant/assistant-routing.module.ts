import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssistantPage } from './assistant.page';

const routes: Routes = [
  {
    path: '',
    component: AssistantPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssistantPageRoutingModule {}
