import { Routes } from '@angular/router';

export const routes: Routes = [
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
      import('../features/reports/reports.module').then((m) => m.ReportsModule),
  },
];
