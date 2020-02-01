import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfferCreatePage } from './offer-create.page';

const routes: Routes = [
  {
    path: '',
    component: OfferCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfferCreatePageRoutingModule {}
