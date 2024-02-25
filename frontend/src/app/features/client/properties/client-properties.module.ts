import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertiesPageClientComponent } from './properties-page/properties-page.component';

const STAYS_ROUTES: Routes = [
  {
    path: '',
    component: PropertiesPageClientComponent,
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(STAYS_ROUTES)],
  exports: [RouterModule],
})
export class ClientPropertiesModule {}
