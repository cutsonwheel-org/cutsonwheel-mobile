import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewOfferPage } from './new-offer.page';

const routes: Routes = [
  {
    path: ':offerId',
    component: NewOfferPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewOfferPageRoutingModule {}
