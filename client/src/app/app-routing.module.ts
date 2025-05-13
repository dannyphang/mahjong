import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { Error404Component } from './layout/error-404/error-404.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./module/home/home.module').then(m => m.HomeModule),
        data: { breadcrumb: '', title: 'Lobby' }
      },
      {
        path: 'profile',
        loadChildren: () => import('./module/profile/profile.module').then(m => m.ProfileModule),
        data: { breadcrumb: 'Profile', title: 'Profile' },
      },
    ]
  },
  {
    path: 'login',
    loadChildren: () => import('./module/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'callback',
    loadChildren: () => import('./module/callback/callback.module').then(m => m.CallbackModule),
  },
  {
    path: 'pagenotfound',
    component: Error404Component
  },
  {
    path: '**',
    redirectTo: '/pagenotfound',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
