import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin/properties',
    loadChildren: () =>
      import('../features/admin/properties/admin-properties.module').then(
        (m) => m.AdminPropertyModule
      ),
  },
  {
    path: 'my-properties',
    loadChildren: () =>
      import('../features/partner/properties/partner-properties.module').then(
        (m) => m.PartnerPropertiesModule
      ),
  },
  {
    path: 'properties',
    loadChildren: () =>
      import('../features/client/properties/client-properties.module').then(
        (m) => m.ClientPropertiesModule
      ),
  },
];
