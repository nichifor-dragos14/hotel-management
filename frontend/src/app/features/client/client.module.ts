import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const CLIENT_ROUTES: Routes = [
  {
    path: 'properties',
    loadChildren: () =>
      import('./properties/client-properties.module').then(
        (m) => m.ClientPropertyModule
      ),
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(CLIENT_ROUTES)],
  exports: [RouterModule],
})
export class ClientModule {}
