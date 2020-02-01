import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingCreatePage } from './booking-create.page';

const routes: Routes = [
  {
    path: '',
    component: BookingCreatePage
  },
  {
    path: 'location',
    loadChildren: () => import('./location/location.module').then( m => m.LocationPageModule)
  },
  {
    path: 'assistant',
    loadChildren: () => import('./assistant/assistant.module').then( m => m.AssistantPageModule)
  },
  {
    path: 'schedule',
    loadChildren: () => import('./schedule/schedule.module').then( m => m.SchedulePageModule)
  },
  {
    path: 'review',
    loadChildren: () => import('./review/review.module').then( m => m.ReviewPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then( m => m.PaymentPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingCreatePageRoutingModule {}
