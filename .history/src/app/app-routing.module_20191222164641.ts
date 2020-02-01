import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { TabsPageComponent } from './tabs-page/tabs-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'tabs',
    component: TabsPageComponent,
    children: [
      {
        path: 'places',
        canLoad: [AuthGuard],
        loadChildren: () => import('./places/places.module').then( m => m.PlacesPageModule),
      },
      {
        path: 'bookings',
        canLoad: [AuthGuard],
        loadChildren: () => import('./bookings/bookings.module').then( m => m.BookingsPageModule)
      },
      {
        path: 'profiles',
        loadChildren: () => import('./profiles/profiles.module').then( m => m.ProfilesPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
