import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const PARTNER_ROUTES: Routes = [
  {
    path: 'my-properties',
    loadChildren: () =>
      import('./properties/partner-properties.module').then(
        (m) => m.PartnerPropertyModule
      ),
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(PARTNER_ROUTES)],
  exports: [RouterModule],
})
export class PartnerModule {}
