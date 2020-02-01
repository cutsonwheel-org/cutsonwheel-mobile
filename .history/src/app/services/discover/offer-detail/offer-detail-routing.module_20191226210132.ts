import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfferDetailPage } from './offer-detail.page';

const routes: Routes = [
  {
    path: '',
    component: OfferDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfferDetailPageRoutingModule {}
