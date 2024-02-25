import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPropertyPagePartnerComponent } from './new-property/new-property.component';
import { MyPropertiesPagePartnerComponent } from './my-properties/my-properties.component';

const PARTNER_ROUTES: Routes = [
  {
    path: '',
    component: MyPropertiesPagePartnerComponent,
  },
  {
    path: 'new',
    component: NewPropertyPagePartnerComponent,
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(PARTNER_ROUTES)],
  exports: [RouterModule],
})
export class PartnerPropertyModule {}
