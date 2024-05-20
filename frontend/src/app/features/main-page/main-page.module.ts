import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPagePropertiesComponent } from './main-page-properties/main-page-properties.component';
import { MainPagePropertiesListComponent } from './main-page-properties-list/main-page-properties-list.component';
import { MainPageOurRecommendationsComponent } from './main-page-our-recommendations/main-page-our-recommendations-list.component';
import { AuthGuard } from '$features/auth/auth.guard';

const MAIN_PAGE_ROUTES: Routes = [
  {
    path: '',
    component: MainPagePropertiesComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['Client'],
    },
    children: [
      {
        path: 'search-results',
        component: MainPagePropertiesListComponent,
        canActivate: [AuthGuard],
        data: {
          animation: 'SearchPage',
          role: ['Client'],
        },
      },
      {
        path: 'our-recommendations',
        component: MainPageOurRecommendationsComponent,
        canActivate: [AuthGuard],
        data: {
          animation: 'RecommendationsPage',
          role: ['Client'],
        },
      },
    ],
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(MAIN_PAGE_ROUTES)],
  exports: [RouterModule],
})
export class MainPageModule {}
