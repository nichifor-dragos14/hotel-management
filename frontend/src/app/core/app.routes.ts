import { Routes } from '@angular/router';
import { AppLayoutComponent } from './app-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('../features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'properties',
        loadChildren: () =>
          import('../features/properties/properties.module').then(
            (m) => m.PropertiesModule
          ),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('../features/reports/reports.module').then(
            (m) => m.ReportsModule
          ),
      },
      {
        path: 'main',
        loadChildren: () =>
          import('../features/main-page/main-page.module').then(
            (m) => m.MainPageModule
          ),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('../features/auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('$features/users/users.module').then((m) => m.UserModule),
      },
    ],
  },
];
