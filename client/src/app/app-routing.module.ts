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
      // {
      //   path: 'contact',
      //   loadChildren: () => import('./module/contact/contact.module').then(m => m.ContactModule),
      //   data: { breadcrumb: 'Contact', title: 'Contact' },
      // },
    ]
  },
  // {
  //   path: 'signup',
  //   loadChildren: () => import('./module/login/login.module').then(m => m.LoginModule),
  // },
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
