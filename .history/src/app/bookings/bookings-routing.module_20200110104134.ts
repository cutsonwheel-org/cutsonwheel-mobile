import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingsPage } from './bookings.page';

const routes: Routes = [
  {
    path: '',
    component: BookingsPage
  },
  {
    path: 'new-booking',
    loadChildren: () => import('./new-booking/new-booking.module').then( m => m.NewBookingPageModule)
  },
  {
    path: 'booking-detail',
    loadChildren: () => import('./booking-detail/booking-detail.module').then( m => m.BookingDetailPageModule)
  },
  {
    path: 'location',
    loadChildren: () => import('./booking-create/location/location.module').then( m => m.LocationPageModule)
  },
  {
    path: 'assistant',
    loadChildren: () => import('./booking-create/assistant/assistant.module').then( m => m.AssistantPageModule)
  },
  {
    path: 'schedule',
    loadChildren: () => import('./booking-create/schedule/schedule.module').then( m => m.SchedulePageModule)
  },
  {
    path: 'review',
    loadChildren: () => import('./booking-create/review/review.module').then( m => m.ReviewPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./booking-create/payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'booking-create',
    loadChildren: () => import('./booking-create/booking-create.module').then( m => m.BookingCreatePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingsPageRoutingModule {}
