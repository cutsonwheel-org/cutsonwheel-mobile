import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalletCreatePage } from './wallet-create.page';

const routes: Routes = [
  {
    path: '',
    component: WalletCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletCreatePageRoutingModule {}
