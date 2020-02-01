import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingsPage } from './bookings.page';

const routes: Routes = [
  {
    path: '',
    component: BookingsPage
  },
  {
    path: 'booking-create',
    loadChildren: () => import('./booking-create/booking-create.module').then( m => m.BookingCreatePageModule)
  },
  {
    path: 'booking-detail',
    loadChildren: () => import('./booking-detail/booking-detail.module').then( m => m.BookingDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingsPageRoutingModule {}
