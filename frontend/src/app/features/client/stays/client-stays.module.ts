import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaysPageComponent } from './stays-page/stays-page.component';

const STAYS_ROUTES: Routes = [
  {
    path: '',
    component: StaysPageComponent,
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(STAYS_ROUTES)],
  exports: [RouterModule],
})
export class ClientStaysModule {}
