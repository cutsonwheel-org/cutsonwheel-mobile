import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPagePage } from './tabs-page.page';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TabsPagePage,
    children: [
      {
        path: 'news',
        loadChildren: () => import('./../news/news.module').then( m => m.NewsPageModule)
      },
      {
        path: 'places',
        canLoad: [AuthGuard],
        loadChildren: () => import('./../places/places.module').then( m => m.PlacesPageModule),
      },
      {
        path: 'bookings',
        canLoad: [AuthGuard],
        loadChildren: () => import('./../bookings/bookings.module').then( m => m.BookingsPageModule)
      },
      {
        path: 'profiles',
        loadChildren: () => import('./../profiles/profiles.module').then( m => m.ProfilesPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPagePageRoutingModule {}
