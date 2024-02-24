import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin/properties',
    loadChildren: () =>
      import('../features/admin/properties/admin-properties.module').then(
        (m) => m.AdminPropertyModule
      ),
  },
];
