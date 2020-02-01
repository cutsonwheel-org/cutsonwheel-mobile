import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingDetailPage } from './booking-detail.page';

const routes: Routes = [
  {
    path: '',
    component: BookingDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingDetailPageRoutingModule {}
