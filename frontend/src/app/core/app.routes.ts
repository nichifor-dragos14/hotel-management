import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('../features/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'partner',
    loadChildren: () =>
      import('../features/partner/partner.module').then((m) => m.PartnerModule),
  },
  {
    path: 'client',
    loadChildren: () =>
      import('../features/client/client.module').then((m) => m.ClientModule),
  },
];
