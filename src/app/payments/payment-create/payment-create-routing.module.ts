import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentCreatePage } from './payment-create.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentCreatePageRoutingModule {}
