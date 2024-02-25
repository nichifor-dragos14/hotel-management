import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const ADMIN_ROUTES: Routes = [
  {
    path: 'properties',
    loadChildren: () =>
      import('./properties/admin-properties.module').then(
        (m) => m.AdminPropertyModule
      ),
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(ADMIN_ROUTES)],
  exports: [RouterModule],
})
export class AdminModule {}
