import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPagePage } from './tabs-page.page';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectLoggedInToItems = () => redirectLoggedInTo(['t/places/discover']);
const redirectLogin = redirectUnauthorizedTo(['auth']);

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
        canActivate: [AngularFireAuthGuard],
        loadChildren: () => import('./../places/places.module').then( m => m.PlacesPageModule),
      },
      {
        path: 'bookings',
        canActivate: [AngularFireAuthGuard],
        loadChildren: () => import('./../bookings/bookings.module').then( m => m.BookingsPageModule)
      },
      {
        path: 'profiles',
        canActivate: [AngularFireAuthGuard],
        loadChildren: () => import('./../profiles/profiles.module').then( m => m.ProfilesPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [
    AngularFireAuthGuard
  ],
})
export class TabsPagePageRoutingModule {}
