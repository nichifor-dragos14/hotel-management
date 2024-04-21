import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPagePropertiesComponent } from './main-page-properties/main-page-properties.component';
import { MainPagePropertiesListComponent } from './main-page-properties-list/main-page-properties-list.component';
import { MainPageOurRecommendationsComponent } from './main-page-our-recommendations/main-page-our-recommendations-list.component';

const MAIN_PAGE_ROUTES: Routes = [
  {
    path: '',
    component: MainPagePropertiesComponent,
    children: [
      {
        path: 'search-results',
        component: MainPagePropertiesListComponent,
      },
      {
        path: 'our-recommendations',
        component: MainPageOurRecommendationsComponent,
      },
    ],
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(MAIN_PAGE_ROUTES)],
  exports: [RouterModule],
})
export class MainPageModule {}
