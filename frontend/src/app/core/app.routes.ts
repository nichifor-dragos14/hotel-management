import { Routes } from '@angular/router';
import { AppLayoutComponent } from './app-layout.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { PageErrorComponent } from './page-error.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/main',
    pathMatch: 'full',
  },
  {
    path: 'error',
    component: PageErrorComponent,
  },
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
          import('../features/users/users.module').then((m) => m.UserModule),
      },
      {
        path: 'bookings',
        loadChildren: () =>
          import('../features/bookings/bookings.module').then(
            (m) => m.BookingsModule
          ),
      },
      {
        path: 'reviews',
        loadChildren: () =>
          import('../features/reviews/reviews.module').then(
            (m) => m.ReviewsModule
          ),
      },
      {
        path: 'rooms',
        loadChildren: () =>
          import('../features/rooms/rooms.module').then((m) => m.RoomsModule),
      },
      {
        path: 'statistics',
        loadChildren: () =>
          import('../features/statistics/statistics.module').then(
            (m) => m.StatisticsModule
          ),
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    component: PageNotFoundComponent,
  },
];
