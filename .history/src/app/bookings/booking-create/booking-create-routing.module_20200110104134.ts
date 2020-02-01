import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingCreatePage } from './booking-create.page';

const routes: Routes = [
  {
    path: '',
    component: BookingCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingCreatePageRoutingModule {}
