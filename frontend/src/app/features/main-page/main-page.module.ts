import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPagePropertiesComponent } from './main-page-properties/main-page-properties.component';

const MAIN_PAGE_ROUTES: Routes = [
  {
    path: '',
    component: MainPagePropertiesComponent,
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(MAIN_PAGE_ROUTES)],
  exports: [RouterModule],
})
export class MainPageModule {}
